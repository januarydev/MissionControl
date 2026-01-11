use crate::simulation::vec3::Vec3;

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
    pub elapsed_time_ms: f64,
    pub simulated_time_days: u32,
    pub simulated_time_seconds: f64,
    pub orbits: Vec<OrbitState>,
    pub spacecraft_position_eci_km: Vec3,
    pub spacecraft_velocity_eci_km_s: Vec3,
    pub spacecraft_position_ecef_km: Vec3,
    pub spacecraft_velocity_ecef_km_s: Vec3,
    pub spacecraft_position_lla: Vec3,
}
