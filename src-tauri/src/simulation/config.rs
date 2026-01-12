#![allow(dead_code)]

use crate::simulation::vec3::Vec3;

/// Simulated time epoch sub-config object schema.
#[derive(Debug, serde::Deserialize)]
pub struct EpochConfig {
    pub year: u32,
    pub month: u8,
    pub day: u8,
    pub hour: u8,
    pub minute: u8,
    pub second: f64,
}

/// Perturbation definition sub-config object schema.
#[derive(Debug, serde::Deserialize)]
pub struct PerturbationConfig {
    pub aero_drag_area_m2: f64,
    pub aero_drag_coef: f64,
    pub solar_rad_pres_area_m2: f64,
    pub solar_rad_pres_coef: f64,
}

/// Body definition sub-config object schema.
#[derive(Debug, serde::Deserialize)]
pub struct BodyConfig {
    pub name: String,
    pub mass_kg: f64,
    pub position_eci_km: Vec3,
    pub velocity_eci_km_s: Vec3,
    pub perturbation_stats: Option<PerturbationConfig>,
}

/// Config file schema for load.
/// Should match exactly config JSON schema.
#[derive(Debug, serde::Deserialize)]
pub struct Config {
    pub base_rate_hz: u32,
    pub frontend_update_rate_hz: u32,
    pub initial_time: EpochConfig,
    pub unfocused_bodies: Vec<BodyConfig>,
    pub focused_body: BodyConfig,
}

impl Config {
    /// Load config file data into object.
    pub fn from_file(filename: &str) -> Self {
        serde_json::from_str(std::fs::read_to_string(filename).expect("Config file not found").as_str()).expect("JSON not well formatted")
    }
}
