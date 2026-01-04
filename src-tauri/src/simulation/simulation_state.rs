/// Data transfer from backend to frontend to update simulation state in UI.
#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimulationState {
    pub elapsed_time_ms: f64,
    pub simulated_time_days: u32,
    pub simulated_time_seconds: f64,
}
