use std::ops::Neg;

use crate::simulation::vec3::{self, Vec3};
use crate::simulation::mat3::Mat3;
use crate::simulation::{config, epoch};

pub const UPDATE_RATE_HZ: f64 = 10.0;

const GRAVITATIONAL_CONSTANT: f64 = 6.67259e-20;
const EARTH_MASS_KG: f64 = 5.974e+24;
const EARTH_ANGULAR_VELOCITY_DEG_S: f64 = 4.1778e-3;
const EARTH_AVERAGE_RADIUS_KM: f64 = 6378.1;

#[derive(Clone, Debug, PartialEq)]
pub struct Body {
    pub name: String,
    pub mass_kg: f64,
    pub position_eci_km: Vec3,
    pub velocity_eci_km_s: Vec3,
}

impl Body {
    /// Implementation of Newton's law of gravitation to calculate instantaneous accelerations
    ///     on all bodies provided in the vector acting on eachother.
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
                velocity_eci_km_s: accelerations[idx]
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
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k1[idx].velocity_eci_km_s / 2.0
            });
        }
        let k2 = Self::dxdt(h / 2.0, &k2_y);

        let mut k3_y = vec![];
        for idx in 0..bodies.len() {
            k3_y.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k2[idx].position_eci_km / 2.0,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k2[idx].velocity_eci_km_s / 2.0
            });
        }
        let k3 = Self::dxdt(h / 2.0, &k3_y);

        let mut k4_y = vec![];
        for idx in 0..bodies.len() {
            k4_y.push(Self {
                name: bodies[idx].name.clone(),
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k3[idx].position_eci_km,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k3[idx].velocity_eci_km_s
            });
        }
        let k4 = Self::dxdt(h, &k4_y);

        for idx in 0..bodies.len() {
            bodies[idx].position_eci_km += h / 6.0 * (k1[idx].position_eci_km + 2.0 * k2[idx].position_eci_km + 2.0 * k3[idx].position_eci_km + k4[idx].position_eci_km);
            bodies[idx].velocity_eci_km_s += h / 6.0 * (k1[idx].velocity_eci_km_s + 2.0 * k2[idx].velocity_eci_km_s + 2.0 * k3[idx].velocity_eci_km_s + k4[idx].velocity_eci_km_s);
        }
    }

    pub fn pos_vel_to_ecef(&self, julian_time: &epoch::Epoch) -> (Vec3, Vec3) {
        let theta_deg = EARTH_ANGULAR_VELOCITY_DEG_S * ((julian_time.get_current_days() * epoch::SECONDS_PER_DAY) as f64 + julian_time.get_current_seconds());
        let rotation_matrix = Mat3 {
            r1c1: theta_deg.to_radians().cos(),         r1c2: theta_deg.to_radians().sin(), r1c3: 0.0,
            r2c1: theta_deg.to_radians().sin().neg(),   r2c2: theta_deg.to_radians().cos(), r2c3: 0.0,
            r3c1: 0.0,                                  r3c2: 0.0,                          r3c3: 1.0,
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
        for body in unfocused_bodies {
            converted_bodies.push(Body {
                name: body.name.clone(),
                mass_kg: body.mass_kg,
                position_eci_km: body.position_eci_km,
                velocity_eci_km_s: body.velocity_eci_km_s,
            })
        }
        Self {
            earth: Body {
                name: "Earth".to_string(),
                mass_kg: EARTH_MASS_KG,
                position_eci_km: vec3::ZERO,
                velocity_eci_km_s: vec3::ZERO,
            },
            unfocused_bodies: converted_bodies,
            focused_body: Body {
                name: focused_body.name.clone(),
                mass_kg: focused_body.mass_kg,
                position_eci_km: focused_body.position_eci_km,
                velocity_eci_km_s: focused_body.velocity_eci_km_s,
            }
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

pub fn position_ecef_km_to_lla(position: &Vec3) -> Vec3 {
    let r_km = position.length();
    let l = position.x / r_km;
    let m = position.y / r_km;
    let n = position.z / r_km;
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

// Storing ISS stuff for later
// "spacecraft_aero_drag_area_m2": 1951,
// "spacecraft_areo_drag_coef": 2,
// "spacecraft_solar_rad_pres_area_m2": 1500,
// "spacecraft_solar_rad_pres_coef": 1.8
