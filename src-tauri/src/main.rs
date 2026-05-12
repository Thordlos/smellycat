#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs::OpenOptions;
use std::io::Write;
use std::time::SystemTime;

#[tauri::command]
fn log_to_file(message: String) -> Result<(), String> {
    let timestamp = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();
    
    let log_entry = format!("[{}] {}\n", timestamp, message);
    
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open("smellycat.log")
        .map_err(|e| e.to_string())?;
    
    file.write_all(log_entry.as_bytes())
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![log_to_file])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            println!("SmellyCat 窗口已创建");
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running SmellyCat");
}
