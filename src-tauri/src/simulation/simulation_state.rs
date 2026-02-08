use crate::simulation::{quaternion::Quaternion, vec3::Vec3};

/// Simulation state orbits sub-object.
#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OrbitState {
    pub name: String,
    pub position_eci_km: Vec3,
    pub velocity_eci_km_s: Vec3,
}

/// Data transfer from backend to frontend to update simulation state in UI.
#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationState {
    pub paused: bool,
    pub time_multiplier: f64,
    pub elapsed_time_s: f64,
    pub simulated_time_days: u32,
    pub simulated_time_seconds: f64,
    pub orbits: Vec<OrbitState>,
    pub spacecraft_position_eci_km: Vec3,
    pub spacecraft_velocity_eci_km_s: Vec3,
    pub spacecraft_position_ecef_km: Vec3,
    pub spacecraft_velocity_ecef_km_s: Vec3,
    pub spacecraft_position_lla: Vec3,
    pub spacecraft_specific_angular_momentum_km2_s: f64,
    pub spacecraft_inclination_deg: f64,
    pub spacecraft_right_ascension_ascending_node_deg: f64,
    pub spacecraft_eccentricity: f64,
    pub spacecraft_argument_of_perigee_deg: f64,
    pub spacecraft_true_anomaly_deg: f64,
    pub spacecraft_periapsis_altitude_km: f64,
    pub spacecraft_apoapsis_altitude_km: f64,
    pub spacecraft_orbit_period_hr: f64,
    pub spacecraft_attitude: Quaternion,
    pub spacecraft_angular_rate_rad_s: Vec3,
    pub inertial_axis_angular_error_rad: f64,
}
