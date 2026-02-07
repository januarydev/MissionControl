const PAUSE_LOOP_HZ: f64 = 10.0;

mod config;
mod epoch;
mod mat3;
mod mat4;
mod n_body;
mod psuedo_real_time;
mod quaternion;
mod simulation_state;
mod torques;
mod ussa76;
mod vec3;

/// Main program state object.
/// Collection of all components and handles passing data between them.
#[derive(Debug)]
pub struct Simulation {
    paused: bool,
    frontend_update_rate_hz: f64,
    time_source: psuedo_real_time::PseudoRealTime,
    simulated_time: epoch::Epoch,
    orbit_propagator: n_body::NBody,
    spacecraft_attitude: torques::Torques,
}

impl Simulation {
    /// Create a new Simulation object.
    /// Read parameters from config file and pass to applicable components.
    pub fn new(config_filename: &str) -> Self {
        let config = config::Config::from_file(config_filename);
        Self {
            paused: false,
            frontend_update_rate_hz: config.frontend_update_rate_hz as f64,
            time_source: psuedo_real_time::PseudoRealTime::new(config.base_rate_hz as f64),
            simulated_time: epoch::Epoch::from_calendar(
                config.initial_time.year,
                config.initial_time.month,
                config.initial_time.day,
                config.initial_time.hour,
                config.initial_time.minute,
                config.initial_time.second,
            ),
            orbit_propagator: n_body::NBody::new(&config.unfocused_bodies, &config.focused_body),
            spacecraft_attitude: torques::Torques::new(
                &config.focused_body.q_inertial_to_body.unwrap(),
                &config.focused_body.inertia_kg_m2.unwrap(),
            ),
        }
    }

    /// Set the pause state to true.
    pub fn pause(&mut self) {
        self.paused = true;
    }

    /// Set the pause state to false and pass the time multipler to pseudo_real_time.
    pub fn run(&mut self, time_multiplier: f64) {
        self.paused = false;
        self.time_source.set_time_multiplier(time_multiplier);
    }

    /// Step the simulation.
    /// Pend on pseudo-real-time sync clock.
    /// Run all components at their desired rates.
    /// Return current SimulationState at desired rate.
    /// If paused exit early with a short sleep to prevent freewheeling.
    pub fn step(&mut self) -> Option<simulation_state::SimulationState> {
        if self.paused {
            std::thread::sleep(std::time::Duration::from_secs_f64(1.0 / PAUSE_LOOP_HZ));
            return Some(self.frontend_update());
        }

        self.time_source.wait_for_sync();

        if self.time_source.check_run_tick(epoch::UPDATE_RATE_HZ) {
            self.simulated_time.update();
        }
        if self.time_source.check_run_tick(n_body::UPDATE_RATE_HZ) {
            self.orbit_propagator.update();
        }
        if self.time_source.check_run_tick(torques::UPDATE_RATE_HZ) {
            self.spacecraft_attitude.update(&self.orbit_propagator.get_focused_body().position_eci_km);
        }

        if self.time_source.check_run_tick(self.frontend_update_rate_hz) {
            Some(self.frontend_update())
        } else {
            None
        }
    }

    /// Create current SimulationState object from component data.
    fn frontend_update(&self) -> simulation_state::SimulationState {
        let mut bodies = vec![];
        for body in self.orbit_propagator.get_unfocused_bodies() {
            bodies.push(simulation_state::OrbitState {
                name: body.name.clone(),
                position_eci_km: body.position_eci_km,
                velocity_eci_km_s: body.velocity_eci_km_s,
            });
        }
        let focused_body = self.orbit_propagator.get_focused_body();
        let focused_body_orbital_elements = self.orbit_propagator.get_focused_body_orbital_elements(&self.simulated_time);
        simulation_state::SimulationState {
            paused: self.paused,
            time_multiplier: self.time_source.get_time_multiplier(),
            elapsed_time_s: self.time_source.get_elapsed_time_ms() / epoch::MILLISECONDS_PER_SECOND as f64,
            simulated_time_days: self.simulated_time.get_current_days(),
            simulated_time_seconds: self.simulated_time.get_current_seconds(),
            orbits: bodies,
            spacecraft_position_eci_km: focused_body.position_eci_km,
            spacecraft_velocity_eci_km_s: focused_body.velocity_eci_km_s,
            spacecraft_position_ecef_km: focused_body_orbital_elements.position_ecef_km,
            spacecraft_velocity_ecef_km_s: focused_body_orbital_elements.velocity_ecef_km_s,
            spacecraft_position_lla: focused_body_orbital_elements.position_lla,
            spacecraft_specific_angular_momentum_km2_s: focused_body_orbital_elements.specific_angular_momentum_km2_s,
            spacecraft_inclination_deg: focused_body_orbital_elements.inclination_deg,
            spacecraft_right_ascension_ascending_node_deg: focused_body_orbital_elements.right_ascension_ascending_node_deg,
            spacecraft_eccentricity: focused_body_orbital_elements.eccentricity,
            spacecraft_argument_of_perigee_deg: focused_body_orbital_elements.argument_of_perigee_deg,
            spacecraft_true_anomaly_deg: focused_body_orbital_elements.true_anomaly_deg,
            spacecraft_periapsis_altitude_km: focused_body_orbital_elements.periapsis_altitude_km,
            spacecraft_apoapsis_altitude_km: focused_body_orbital_elements.apoapsis_altitude_km,
            spacecraft_orbit_period_hr: focused_body_orbital_elements.orbit_period_hr,
        }
    }
}
