#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs;

#[tauri::command]
fn save_config(app_handle: tauri::AppHandle, data: String) -> Result<(), String> {
    let config_dir = app_handle.path().app_config_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    let file_path = config_dir.join("config.json");
    fs::write(file_path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_config(app_handle: tauri::AppHandle) -> Result<String, String> {
    let file_path = app_handle.path().app_config_dir().map_err(|e| e.to_string())?.join("config.json");
    fs::read_to_string(file_path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![save_config, load_config])
        .setup(|app| {
            let _window = app.get_webview_window("main").unwrap();
            println!("SmellyCat 窗口已创建");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running SmellyCat");
}
