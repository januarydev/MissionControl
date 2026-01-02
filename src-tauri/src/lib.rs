mod simulation;

use tauri::{Manager, Emitter};

const BASE_RATE_HZ: u32 = 100;

#[tauri::command]
fn start_simulation(app: tauri::AppHandle) {
    std::thread::spawn(move || {
        loop {
            app.emit("update", app.state::<std::sync::Mutex<simulation::Simulation>>().lock().unwrap().iterate()).unwrap();
        }
    });
}

#[tauri::command]
fn stop_simulation(simulation: tauri::State<std::sync::Mutex<simulation::Simulation>>) {
    // unsure what we want to do here
    // simulation.lock().unwrap().stop();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(std::sync::Mutex::new(simulation::Simulation::new(BASE_RATE_HZ as f64)))
        .invoke_handler(tauri::generate_handler![start_simulation, stop_simulation])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
