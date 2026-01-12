use crate::simulation::vec3::{self, Vec3};
use crate::simulation::mat3::Mat3;
use crate::simulation::{config, epoch};
use crate::simulation::ussa76;

pub const UPDATE_RATE_HZ: f64 = 10.0;

const GRAVITATIONAL_CONSTANT: f64 = 6.67259e-20;
const EARTH_MASS_KG: f64 = 5.974e+24;
const EARTH_ANGULAR_VELOCITY_DEG_S: f64 = 4.1778e-3;
const EARTH_AVERAGE_RADIUS_KM: f64 = 6378.1;
const SOLAR_RADIATION_PRESSURE_N_M2: f64 = 4.56e-6;

#[derive(Copy, Clone, Debug, PartialEq)]
pub struct PerturbationStats {
    pub aero_drag_area_m2: f64,
    pub aero_drag_coef: f64,
    pub solar_rad_pres_area_m2: f64,
    pub solar_rad_pres_coef: f64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Body {
    pub name: String,
    pub mass_kg: f64,
    pub position_eci_km: Vec3,
    pub velocity_eci_km_s: Vec3,
    pub perturbation_stats: Option<PerturbationStats>,
}

impl Body {
    /// Utility to convert a body struct from the config file schema to our body struct.
    fn from_config(config_body: &config::BodyConfig) -> Self {
        let mut body = Self {
            name: config_body.name.clone(),
            mass_kg: config_body.mass_kg,
            position_eci_km: config_body.position_eci_km,
            velocity_eci_km_s: config_body.velocity_eci_km_s,
            perturbation_stats: None,
        };
        if let Some(perturbation_stats) = &config_body.perturbation_stats {
            body.perturbation_stats = Some(PerturbationStats {
                aero_drag_area_m2: perturbation_stats.aero_drag_area_m2,
                aero_drag_coef: perturbation_stats.aero_drag_coef,
                solar_rad_pres_area_m2: perturbation_stats.solar_rad_pres_area_m2,
                solar_rad_pres_coef: perturbation_stats.solar_rad_pres_coef,
            });
        }
        body
    }

    /// Calculates acceleration due to aerodynamic drag using USSA76 atmosphere model.
    /// Implements p = -1/2 * rho * ||v_rel|| * B * v_rel.
    /// Where v_rel = v - v_atm = v - omega_E * r, B = C_D * A / m.
    fn aero_drag_acceleration(&self, perturbation_stats: &PerturbationStats) -> Vec3 {
        let v_rel = self.velocity_eci_km_s - EARTH_ANGULAR_VELOCITY_DEG_S * self.position_eci_km;
        let altitude_km = self.position_eci_km.length() - EARTH_AVERAGE_RADIUS_KM;
        let ballistic_coef = perturbation_stats.aero_drag_coef * perturbation_stats.aero_drag_area_m2 / self.mass_kg;
        -0.5 * ussa76::get_atmos_density_kg_m3(altitude_km) * v_rel.length() * ballistic_coef * v_rel
    }

    /// Calculates if body is in sunlight, and if so the acceleration due to solar radiation pressure assuming orbit around Earth.
    /// In sun is caluclated by checking if theta_1 + theta_2 <= theta.
    /// Where theta = acos(r_sun dot r / ||r_sun||*||r||), theta_1 = acos(R_E / r), theta_2 = acos(R_E / r_sun).
    /// Implements p = -p_SR * u_hat where p_SR = S / c * C_R * A_s / m and u_hat is the unit vector from the Earth to the sun.
    fn solar_rad_pres_acceleration(&self, perturbation_stats: &PerturbationStats, sun_position_eci_km: &Vec3) -> Vec3 {
        if *sun_position_eci_km == vec3::ZERO { return vec3::ZERO; }
        let theta = (sun_position_eci_km.dot(self.position_eci_km) / (sun_position_eci_km.length() * self.position_eci_km.length())).acos().to_degrees();
        let theta_1 = (EARTH_AVERAGE_RADIUS_KM / self.position_eci_km.length()).acos().to_degrees();
        let theta_2 = (EARTH_AVERAGE_RADIUS_KM / sun_position_eci_km.length()).acos().to_degrees();
        if theta_1 + theta_2 <= theta { return vec3::ZERO; } // In Earth shadow
        let sun_direction_unit_vector = *sun_position_eci_km / sun_position_eci_km.length();
        -SOLAR_RADIATION_PRESSURE_N_M2 * perturbation_stats.solar_rad_pres_coef * perturbation_stats.solar_rad_pres_area_m2 / self.mass_kg * sun_direction_unit_vector
    }

    /// Implementation of Newton's law of gravitation to calculate instantaneous accelerations on all bodies provided in the vector acting on eachother.
    /// Also includes aerodynamic drag and solar radiation pressure perturbation accelerations for all bodies that have it enabled.
    /// Can be used as the basis of N-body orbit propagation using various solvers.
    /// Returns a vector of the accelerations for each body provided.
    fn newtonian_grav_accels(bodies: &Vec<Self>) -> Vec<Vec3> {
        let mut result = vec![];
        for our_body in bodies.iter() {
            let mut accel = vec3::ZERO;
            for other_body in bodies.iter() {
                if other_body == our_body { continue; }
                accel += Vec3 {
                    x: GRAVITATIONAL_CONSTANT * other_body.mass_kg * (other_body.position_eci_km.x - our_body.position_eci_km.x) / (other_body.position_eci_km - our_body.position_eci_km).length().powi(3),
                    y: GRAVITATIONAL_CONSTANT * other_body.mass_kg * (other_body.position_eci_km.y - our_body.position_eci_km.y) / (other_body.position_eci_km - our_body.position_eci_km).length().powi(3),
                    z: GRAVITATIONAL_CONSTANT * other_body.mass_kg * (other_body.position_eci_km.z - our_body.position_eci_km.z) / (other_body.position_eci_km - our_body.position_eci_km).length().powi(3),
                }
            }
            if let Some(perturbation_stats) = &our_body.perturbation_stats {
                accel += our_body.aero_drag_acceleration(perturbation_stats);
                let mut sun_position = &vec3::ZERO;
                for body in bodies.iter() {
                    if body.name == "Sun" {
                        sun_position = &body.position_eci_km;
                        break;
                    }
                }
                accel += our_body.solar_rad_pres_acceleration(perturbation_stats, sun_position);
            }
            result.push(accel);
        }
        result
    }

    /// Differential equation of gravitational motion for N-bodies over a given timestep.
    /// Kinematics equation: x(t) (i.e., position) = x0 + v0*a*t + 1/2*a*t^2
    /// Calculates:
    ///     dx/dt (i.e., derivative of position AKA velocity) = v0 + a*t
    ///     dv/dt (i.e., derivative of velocity AKA acceleration) = a
    /// a = f(x) (i.e., acceleration depends on position) and v = f(t,x) (i.e., velocity depends on time and position (because of acceleration)),
    ///     therefore valid for RK integration (x_n+1 = f(t_n,x_n))
    /// Returns a vector of the derivatives held in the body struct for convenience (i.e., x = dx/dt, v = dv/dt (mass untouched)).
    fn dxdt(dt: f64, bodies: &Vec<Self>) -> Vec<Self> {
        let accelerations = Self::newtonian_grav_accels(bodies);
        let mut dxdt_dvdt = vec![];
        for idx in 0..bodies.len() {
            dxdt_dvdt.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].velocity_eci_km_s + accelerations[idx] * dt,
                velocity_eci_km_s: accelerations[idx],
                perturbation_stats: bodies[idx].perturbation_stats,
            });
        }
        dxdt_dvdt
    }

    /// Run a Runge-Kutta 4th-order (RK4) fixed-size integration step for orbit propagation on the provided vector of bodies.
    /// Implements the algorithm, for x(t) such that dx/dt = f(t,x), x(t0) = x0, with some step size h:\
    ///     Let:
    ///         k1 = f(t_n,x_n),
    ///         k2 = f(t_n + h / 2,y_n + h * k1 / 2),
    ///         k3 = f(t_n + h / 2,y_n + h * k2 / 2),
    ///         k4 = f(t_n + h,y_n + h * k3),
    ///     Then:
    ///         y_n+1 = y_n + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    ///         t_n+1 = t_n + h
    ///     (Assuming t_n = 0 for instantaneous integration)
    fn rk4_integrator(bodies: &mut Vec<&mut Self>, h: f64) {
        let mut k1_y = vec![];
        for idx in 0..bodies.len() {
            k1_y.push(bodies[idx].clone());
        }
        let k1 = Self::dxdt(0.0, &k1_y);

        let mut k2_y = vec![];
        for idx in 0..bodies.len() {
            k2_y.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k1[idx].position_eci_km / 2.0,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k1[idx].velocity_eci_km_s / 2.0,
                perturbation_stats: bodies[idx].perturbation_stats,
            });
        }
        let k2 = Self::dxdt(h / 2.0, &k2_y);

        let mut k3_y = vec![];
        for idx in 0..bodies.len() {
            k3_y.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k2[idx].position_eci_km / 2.0,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k2[idx].velocity_eci_km_s / 2.0,
                perturbation_stats: bodies[idx].perturbation_stats,
            });
        }
        let k3 = Self::dxdt(h / 2.0, &k3_y);

        let mut k4_y = vec![];
        for idx in 0..bodies.len() {
            k4_y.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k3[idx].position_eci_km,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k3[idx].velocity_eci_km_s,
                perturbation_stats: bodies[idx].perturbation_stats,
            });
        }
        let k4 = Self::dxdt(h, &k4_y);

        for idx in 0..bodies.len() {
            bodies[idx].position_eci_km += h / 6.0 * (k1[idx].position_eci_km + 2.0 * k2[idx].position_eci_km + 2.0 * k3[idx].position_eci_km + k4[idx].position_eci_km);
            bodies[idx].velocity_eci_km_s += h / 6.0 * (k1[idx].velocity_eci_km_s + 2.0 * k2[idx].velocity_eci_km_s + 2.0 * k3[idx].velocity_eci_km_s + k4[idx].velocity_eci_km_s);
        }
    }

    /// Transform our ECI J2000 position and velocity into ECEF measurements with the correct rotation matrix.
    pub fn pos_vel_to_ecef(&self, julian_time: &epoch::Epoch) -> (Vec3, Vec3) {
        let theta_deg = EARTH_ANGULAR_VELOCITY_DEG_S * ((julian_time.get_current_days() * epoch::SECONDS_PER_DAY) as f64 + julian_time.get_current_seconds());
        let rotation_matrix = Mat3 {
            r1c1: theta_deg.to_radians().cos(),     r1c2: theta_deg.to_radians().sin(), r1c3: 0.0,
            r2c1: -(theta_deg.to_radians().sin()),  r2c2: theta_deg.to_radians().cos(), r2c3: 0.0,
            r3c1: 0.0,                              r3c2: 0.0,                          r3c3: 1.0,
        };
        (rotation_matrix * self.position_eci_km, rotation_matrix * self.velocity_eci_km_s)
    }
}

/// Extremely basic Newtonian 4-body 3D orbit propagator object.
/// All masses are assumed to be point masses.
/// All calculations done in ECI J2000.
/// Four included bodies are sun, earth, moon, and spacecraft.
#[derive(Debug)]
pub struct NBody {
    earth: Body,
    unfocused_bodies: Vec<Body>,
    focused_body: Body,
}

impl NBody {
    /// Create a new FourBody object from given ICV.
    /// Sun and moon positions are propagated forward from epoch to correct time point.
    /// Spacecraft ECEF state vector is then converted to ECI J2000.
    pub fn new(unfocused_bodies: &Vec<config::BodyConfig>, focused_body: &config::BodyConfig) -> Self {
        let mut converted_bodies = vec![];
        for body in unfocused_bodies { converted_bodies.push(Body::from_config(body)); }
        Self {
            earth: Body {
                name: "Earth".to_string(),
                mass_kg: EARTH_MASS_KG,
                position_eci_km: vec3::ZERO,
                velocity_eci_km_s: vec3::ZERO,
                perturbation_stats: None,
            },
            unfocused_bodies: converted_bodies,
            focused_body: Body::from_config(focused_body),
        }
    }

    /// Correct the state of all bodies so that Earth is inertially centered in the coordinate frame.
    /// Subtract Earth's position and velocity from all bodies (including Earth).
    fn correct_earth_inertial_frame(&mut self) {
        self.focused_body.position_eci_km -= self.earth.position_eci_km;
        self.focused_body.velocity_eci_km_s -= self.earth.velocity_eci_km_s;
        for body in &mut self.unfocused_bodies {
            body.position_eci_km -= self.earth.position_eci_km;
            body.velocity_eci_km_s -= self.earth.velocity_eci_km_s;
        }
        self.earth.position_eci_km = vec3::ZERO;
        self.earth.velocity_eci_km_s = vec3::ZERO;
    }

    /// Step the integrator by the update rate timestep and correct the inertial frame coordinates.
    pub fn update(&mut self) {
        // let start_time = std::time::Instant::now();
        let mut bodies = vec![&mut self.earth, &mut self.focused_body];
        for body in &mut self.unfocused_bodies {
            bodies.push(body);
        }
        Body::rk4_integrator(&mut bodies, 1.0 / UPDATE_RATE_HZ);
        self.correct_earth_inertial_frame();
        // let execution_time = std::time::Instant::now() - start_time;
        // println!("Orbit update: {time} us ({percent:.3}%)", time = execution_time.as_micros(), percent = execution_time.as_secs_f64() * UPDATE_RATE_HZ);
    }

    pub fn get_unfocused_bodies(&self) -> Vec<&Body> {
        let mut bodies = vec![];
        for body in &self.unfocused_bodies {
            bodies.push(body);
        }
        bodies
    }

    pub fn get_focused_body(&self) -> &Body {
        &self.focused_body
    }
}

/// Calculate right ascension (longitude), declination (latitude) and elevation (altitude) from an ECEF position.
pub fn position_ecef_km_to_lla(position_ecef_km: &Vec3) -> Vec3 {
    let r_km = position_ecef_km.length();
    let l = position_ecef_km.x / r_km;
    let m = position_ecef_km.y / r_km;
    let n = position_ecef_km.z / r_km;
    let declination = n.asin().to_degrees();
    let right_ascension;
    if m > 0.0 {
        right_ascension = (l / declination.to_radians().cos()).acos().to_degrees();
    } else {
        right_ascension = 360.0 - (l / declination.to_radians().cos()).acos().to_degrees();
    }
    Vec3 {
        x: right_ascension,
        y: declination,
        z: r_km - EARTH_AVERAGE_RADIUS_KM,
    }
}
