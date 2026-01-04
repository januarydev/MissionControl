mod simulation;

use tauri::{Emitter, Manager};

const CONFIG_FILENAME: &str = "config.json";

#[tauri::command]
fn start_simulation(app: tauri::AppHandle) {
    std::thread::spawn(move || {
        loop {
            if let Some(state) = app.state::<std::sync::Mutex<simulation::Simulation>>().lock().unwrap().step() {
                app.emit("update", state).unwrap();
            }
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(std::sync::Mutex::new(simulation::Simulation::new(CONFIG_FILENAME)))
        .invoke_handler(tauri::generate_handler![start_simulation])
        .run(tauri::generate_context!())
        .expect("Error while running tauri application");
}
