mod simulation;

use tauri::{Emitter, Manager};

type SimSync = std::sync::Mutex<simulation::Simulation>;
const CONFIG_FILENAME: &str = "config.json";

/// Invoked on frontend mount.
/// Spawn the main execution thread.
/// Thread continuously steps the Simulation and emits current SimulationState
///     to the frontend at configured regular intervals.
#[tauri::command]
fn start_simulation(app: tauri::AppHandle) {
    std::thread::spawn(move || loop {
        if let Some(state) = app.state::<SimSync>().lock().unwrap().step() {
            app.emit("update", state).unwrap();
        }
    });
}

/// Pause the update loop until a run_time command is received.
#[tauri::command]
fn pause_time(app: tauri::AppHandle) {
    app.state::<SimSync>().lock().unwrap().pause();
}

/// Unpause (if needed) the update loop and set the pseudo_real_time multiplier as commanded.
#[tauri::command]
fn run_time(app: tauri::AppHandle, time_multiplier: f64) {
    app.state::<SimSync>().lock().unwrap().run(time_multiplier);
}

/// Main entry point of the program.
/// Create the Tauri instance.
/// Create a Simulation instance managed by Tauri.
/// Setup all command callbacks.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(std::sync::Mutex::new(simulation::Simulation::new(CONFIG_FILENAME)))
        .invoke_handler(tauri::generate_handler![start_simulation, pause_time, run_time])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
