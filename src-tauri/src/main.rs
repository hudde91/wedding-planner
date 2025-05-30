#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::fs;
use tauri::api::path::app_data_dir;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct WeddingPlan {
  couple_name1: String,
  couple_name2: String,
  wedding_date: String,
  budget: f64,
  todos: Vec<TodoItem>,
  #[serde(default)]
  guests: Vec<Guest>,
  #[serde(default)]
  tables: Vec<Table>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct TodoItem {
  id: i64,
  text: String,
  completed: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Guest {
  id: i64,
  name: String,
  email: String,
  phone: String,
  rsvp_status: String, // "pending", "attending", "declined"
  meal_preference: String,
  plus_ones: i32,
  notes: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Table {
  id: i64,
  name: String,
  seats: Vec<Seat>,
  shape: String, // "round" or "rectangular"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Seat {
  id: i32,
  #[serde(rename = "guestId")]
  guest_id: Option<i64>,
  #[serde(rename = "guestName")]
  guest_name: String,
}

impl Default for WeddingPlan {
  fn default() -> Self {
      WeddingPlan {
          couple_name1: String::new(),
          couple_name2: String::new(),
          wedding_date: String::new(),
          budget: 0.0,
          todos: Vec::new(),
          guests: Vec::new(),
          tables: Vec::new(),
      }
  }
}

#[tauri::command]
fn save_wedding_plan(app_handle: tauri::AppHandle, plan: WeddingPlan) -> Result<(), String> {
  let app_data_dir = app_data_dir(&app_handle.config()).expect("Failed to get app data dir");
  let file_path = app_data_dir.join("wedding_plan.json");
  
  // Ensure the directory exists
  if !app_data_dir.exists() {
      fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;
  }
  
  let json = serde_json::to_string(&plan).map_err(|e| e.to_string())?;
  fs::write(file_path, json).map_err(|e| e.to_string())?;
  
  Ok(())
}

#[tauri::command]
fn load_wedding_plan(app_handle: tauri::AppHandle) -> Result<WeddingPlan, String> {
  let app_data_dir = app_data_dir(&app_handle.config()).expect("Failed to get app data dir");
  let file_path = app_data_dir.join("wedding_plan.json");
  
  if !file_path.exists() {
      return Ok(WeddingPlan::default());
  }
  
  let data = fs::read_to_string(file_path).map_err(|e| e.to_string())?;
  let plan: WeddingPlan = serde_json::from_str(&data).map_err(|e| e.to_string())?;
  
  Ok(plan)
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![save_wedding_plan, load_wedding_plan])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}