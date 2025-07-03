// Import the main module
mod main;

// Mobile entry point - just calls the main run function
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    main::run();
}