use crate::simulation::vec3::{self, Vec3};
use crate::simulation::epoch::SECONDS_PER_DAY;

pub const UPDATE_RATE_HZ: f64 = 10.0;

const GRAVITATIONAL_CONSTANT: f64 = 6.67259e-20;
const THREE_BODY_PROPAGATION_RATE_HZ: f64 = 1.0 / 10.0;
const SUN_EPOCH_POSITION_KM: Vec3 = Vec3 { x: 2.52128392e+7, y: -1.32968699e+8, z: -5.76483146e+7 };
const SUN_EPOCH_VELOCITY_KM_S: Vec3 = Vec3 { x: 29.83976734, y: 4.77829212, z: 2.07157574 };
const MOON_EPOCH_POSITION_KM: Vec3 = Vec3 { x: -317575.10336463, y: -236504.22146683, z: -62693.60375344 };
const MOON_EPOCH_VELOCITY_KM_S: Vec3 = Vec3 { x: 0.56091175, y: -0.73317161, z: -0.31967135 };
const EARTH_MASS_KG: f64 = 5.974e+24;
const SUN_MASS_KG: f64 = 1.989e+30;
const MOON_MASS_KG: f64 = 7.348e+22;

#[derive(Copy, Clone, Debug, PartialEq)]
struct Body {
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
            dxdt_dvdt.push(Self { mass_kg: bodies[idx].mass_kg, position_eci_km: bodies[idx].velocity_eci_km_s + accelerations[idx] * dt, velocity_eci_km_s: accelerations[idx] });
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
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k1[idx].position_eci_km / 2.0,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k1[idx].velocity_eci_km_s / 2.0
            });
        }
        let k2 = Self::dxdt(h / 2.0, &k2_y);

        let mut k3_y = vec![];
        for idx in 0..bodies.len() {
            k3_y.push(Self {
                mass_kg: bodies[idx].mass_kg,
                position_eci_km: bodies[idx].position_eci_km + h * k2[idx].position_eci_km / 2.0,
                velocity_eci_km_s: bodies[idx].velocity_eci_km_s + h * k2[idx].velocity_eci_km_s / 2.0
            });
        }
        let k3 = Self::dxdt(h / 2.0, &k3_y);

        let mut k4_y = vec![];
        for idx in 0..bodies.len() {
            k4_y.push(Self {
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
}

/// **Very** rough Newtonian 3-body 3D orbit propagator.
/// Used to estimate initial sun and moon positions at given 4-body initial time.
#[derive(Debug)]
struct ThreeBody {
    pub propagation_steps: u64,
    pub j2000_days: u32,
    pub j2000_seconds: f64,
    pub sun: Body,
    pub earth: Body,
    pub moon: Body,
}

impl ThreeBody {
    /// Create the default J2000 epoch-initialized propagator.
    fn new() -> Self {
        Self {
            propagation_steps: 0,
            j2000_days: 0,
            j2000_seconds: 0.0,
            sun: Body { mass_kg: SUN_MASS_KG, position_eci_km: SUN_EPOCH_POSITION_KM, velocity_eci_km_s: SUN_EPOCH_VELOCITY_KM_S },
            earth: Body { mass_kg: EARTH_MASS_KG, position_eci_km: vec3::ZERO, velocity_eci_km_s: vec3::ZERO },
            moon: Body { mass_kg: MOON_MASS_KG, position_eci_km: MOON_EPOCH_POSITION_KM, velocity_eci_km_s: MOON_EPOCH_VELOCITY_KM_S },
        }
    }

    /// Correct the state of all bodies so that Earth is inertially centered in the coordinate frame.
    /// Subtract Earth's position and velocity from all bodies (including Earth).
    fn correct_earth_inertial_frame(&mut self) {
        for body in vec![&mut self.sun, &mut self.moon] {
            body.position_eci_km -= self.earth.position_eci_km;
            body.velocity_eci_km_s -= self.earth.velocity_eci_km_s;
        }
        self.earth.position_eci_km = vec3::ZERO;
        self.earth.velocity_eci_km_s = vec3::ZERO;
    }

    /// Propagate sun and moon orbits forward in rough steps until we've hit the desired time.
    /// Enable the commented out lines to export the positions at each step to a csv for analysis.
    fn propagate_until(&mut self, j2000_days: u32, j2000_seconds: f64) {
        // let mut file = std::fs::File::create("data.csv").unwrap();
        while self.j2000_days < j2000_days || self.j2000_seconds < j2000_seconds {
            self.propagation_steps += 1;
            let delta_seconds = 1.0 / THREE_BODY_PROPAGATION_RATE_HZ;

            self.j2000_seconds += delta_seconds;
            if self.j2000_seconds > SECONDS_PER_DAY as f64 {
                self.j2000_days += 1;
                self.j2000_seconds -= SECONDS_PER_DAY as f64;
            }

            Body::rk4_integrator(&mut vec![&mut self.sun, &mut self.earth, &mut self.moon], delta_seconds);
            self.correct_earth_inertial_frame();

            // file.write_fmt(format_args!("{days},{seconds},{sunposx},{sunposy},{sunposz},{moonposx},{moonposy},{moonposz},{earthposx},{earthposy},{earthposz}\n",
            //     days = self.j2000_days, seconds = self.j2000_seconds,
            //     sunposx = self.sun.position_eci_km.x, sunposy = self.sun.position_eci_km.y, sunposz = self.sun.position_eci_km.z,
            //     moonposx = self.moon.position_eci_km.x, moonposy = self.moon.position_eci_km.y, moonposz = self.moon.position_eci_km.z,
            //     earthposx = self.earth.position_eci_km.x, earthposy = self.earth.position_eci_km.y, earthposz = self.earth.position_eci_km.z)).unwrap();
        }
    }
}

/// Extremely basic Newtonian 4-body 3D orbit propagator object.
/// All masses are assumed to be point masses.
/// All calculations done in ECI J2000.
/// Four included bodies are sun, earth, moon, and spacecraft.
#[derive(Debug)]
pub struct FourBody {
    sun: Body,
    earth: Body,
    moon: Body,
    spacecraft: Body,
}

impl FourBody {
    /// Create a new FourBody object from given ICV.
    /// Sun and moon positions are propagated forward from epoch to correct time point.
    /// Spacecraft ECEF state vector is then converted to ECI J2000.
    pub fn new(j2000_days: u32, j2000_seconds: f64, spacecraft_pos_ecef_km: Vec3, spacecraft_vel_ecef_km_s: Vec3, spacecraft_mass_kg: f64) -> Self {
        println!("Initializing new sun-earth-moon system and propagating orbits to julian date {j2000_days} days, {j2000_seconds} seconds...");
        let mut three_body = ThreeBody::new();
        let start = std::time::Instant::now();
        three_body.propagate_until(j2000_days, j2000_seconds);
        let finish = std::time::Instant::now();
        println!("...complete. Three-body propagation results:\n{three_body:#?}");
        println!("Time elapsed: {time} s", time = (finish - start).as_secs_f64());
        Self {
            sun: three_body.sun,
            earth: three_body.earth,
            moon: three_body.moon,
            spacecraft: Body {
                mass_kg: spacecraft_mass_kg,
                position_eci_km: Self::ecef_to_eci(j2000_days, j2000_seconds, spacecraft_pos_ecef_km),
                velocity_eci_km_s: Self::ecef_to_eci(j2000_days, j2000_seconds, spacecraft_vel_ecef_km_s),
            }
        }
    }

    /// TODO: Convert vector from ECEF to J2000 ECI.
    fn ecef_to_eci(_j2000_days: u32, _j2000_seconds: f64, ecef_vec: Vec3) -> Vec3 {
        ecef_vec
    }

    /// Correct the state of all bodies so that Earth is inertially centered in the coordinate frame.
    /// Subtract Earth's position and velocity from all bodies (including Earth).
    fn correct_earth_inertial_frame(&mut self) {
        for body in vec![&mut self.sun, &mut self.moon, &mut self.spacecraft] {
            body.position_eci_km -= self.earth.position_eci_km;
            body.velocity_eci_km_s -= self.earth.velocity_eci_km_s;
        }
        self.earth.position_eci_km = vec3::ZERO;
        self.earth.velocity_eci_km_s = vec3::ZERO;
    }

    /// Step the integrator by the update rate timestep and correct the inertial frame coordinates.
    pub fn update(&mut self) {
        Body::rk4_integrator(&mut vec![&mut self.sun, &mut self.earth, &mut self.moon, &mut self.spacecraft], 1.0 / UPDATE_RATE_HZ);
        self.correct_earth_inertial_frame();
    }
}
