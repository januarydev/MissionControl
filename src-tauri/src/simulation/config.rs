/// Simulated time epoch sub-config object schema
#[derive(Debug, serde::Deserialize)]
pub struct Epoch {
    pub days: u64,
    pub seconds: f64
}

/// Config file schema for load
/// Should match exactly config JSON schema
#[derive(Debug, serde::Deserialize)]
pub struct Config {
    pub base_rate_hz: u32,
    pub frontend_update_rate_hz: u32,
    pub initial_time: Epoch,
}

impl Config {
    /// Load config file data into object
    pub fn from_file(filename: &str) -> Self {
        serde_json::from_str(std::fs::read_to_string(filename).expect("Config file not found").as_str()).expect("JSON not well formatted")
    }
}
