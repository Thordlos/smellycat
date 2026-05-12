#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let _window = app.get_webview_window("main").unwrap();
            println!("SmellyCat 窗口已创建");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running SmellyCat");
}
