mod config;
mod psuedo_real_time;
mod epoch;
mod n_body;
mod simulation_state;
mod vec3;

/// Main program state object.
/// Collection of all components and handles passing data between them.
#[derive(Debug)]
pub struct Simulation {
    frontend_update_rate_hz: f64,
    time_source: psuedo_real_time::PseudoRealTime,
    simulated_time: epoch::Epoch,
    orbit_propagator: n_body::NBody,
}

impl Simulation {
    /// Create a new Simulation object.
    /// Read parameters from config file and pass to applicable components.
    pub fn new(config_filename: &str) -> Self {
        let config = config::Config::from_file(config_filename);
        Self {
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
            orbit_propagator: n_body::NBody::new(&config.bodies),
        }
    }

    /// Step the simulation.
    /// Pend on pseudo-real-time sync clock.
    /// Run all components at their desired rates.
    /// Return current SimulationState at desired rate.
    pub fn step(&mut self) -> Option<simulation_state::SimulationState> {
        self.time_source.wait_for_sync();

        if self.time_source.check_run_tick(epoch::UPDATE_RATE_HZ) {self.simulated_time.update();}
        if self.time_source.check_run_tick(n_body::UPDATE_RATE_HZ) {self.orbit_propagator.update();}

        if self.time_source.check_run_tick(self.frontend_update_rate_hz) { Some(self.frontend_update()) } else { None }
    }

    /// Create current SimulationState object from component data.
    fn frontend_update(&self) -> simulation_state::SimulationState {
        simulation_state::SimulationState {
            elapsed_time_ms: self.time_source.get_elapsed_time_ms(),
            simulated_time_days: self.simulated_time.get_current_days(),
            simulated_time_seconds: self.simulated_time.get_current_seconds(),
        }
    }
}
