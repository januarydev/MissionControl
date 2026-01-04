#![allow(dead_code)]

use crate::simulation::vec3::Vec3;

/// Simulated time epoch sub-config object schema.
#[derive(Debug, serde::Deserialize)]
pub struct Epoch {
    pub year: u32,
    pub month: u8,
    pub day: u8,
    pub hour: u8,
    pub minute: u8,
    pub second: f64,
}

/// Config file schema for load.
/// Should match exactly config JSON schema.
#[derive(Debug, serde::Deserialize)]
pub struct Config {
    pub base_rate_hz: u32,
    pub frontend_update_rate_hz: u32,
    pub initial_time: Epoch,
    pub initial_position_ecef_km: Vec3,
    pub initial_velocity_ecef_km_s: Vec3,
    pub spacecraft_mass_kg: f64,
    pub spacecraft_aero_drag_area_m2: f64,
    pub spacecraft_areo_drag_coef: f64,
    pub spacecraft_solar_rad_pres_area_m2: f64,
    pub spacecraft_solar_rad_pres_coef: f64,
}

impl Config {
    /// Load config file data into object.
    pub fn from_file(filename: &str) -> Self {
        serde_json::from_str(std::fs::read_to_string(filename).expect("Config file not found").as_str()).expect("JSON not well formatted")
    }
}
