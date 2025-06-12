#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
  )]
  
  use serde::{Deserialize, Serialize};
  use std::fs;
  use tauri::api::path::app_data_dir;
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  #[serde(rename_all = "lowercase")]
  pub enum RSVPStatus {
      Pending,
      Attending,
      Declined,
  }
  
  impl Default for RSVPStatus {
      fn default() -> Self {
          RSVPStatus::Pending
      }
  }
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  #[serde(rename_all = "lowercase")]
  pub enum TableShape {
      Round,
      Rectangular,
  }
  
  impl Default for TableShape {
      fn default() -> Self {
          TableShape::Round
      }
  }
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  struct SeatAssignment {
      #[serde(rename = "tableId")]
      table_id: String,
      #[serde(rename = "seatNumber")]
      seat_number: i32,
      #[serde(rename = "guestId")]
      guest_id: String,
      #[serde(rename = "guestName")]
      guest_name: String,
  }
  
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
      #[serde(skip_serializing_if = "Option::is_none")]
      cost: Option<f64>,
      #[serde(skip_serializing_if = "Option::is_none")]
      vendor_name: Option<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      vendor_contact: Option<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      vendor_email: Option<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      vendor_phone: Option<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      notes: Option<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      completion_date: Option<String>,
  }
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  struct Guest {
      id: String,
      name: String,
      email: String,
      phone: String,
      #[serde(default)]
      rsvp_status: RSVPStatus,
      meal_preference: String,
      #[serde(default)]
      plus_ones: Vec<PlusOne>,
      notes: String,
  }
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  struct PlusOne {
      id: String,
      name: String,
      meal_preference: String,
      notes: String,
  }
  
  #[derive(Serialize, Deserialize, Debug, Clone)]
  struct Table {
      id: String,
      name: String,
      capacity: i32,
      #[serde(default)]
      assigned_guests: Vec<String>,
      #[serde(skip_serializing_if = "Option::is_none")]
      shape: Option<TableShape>,
      #[serde(skip_serializing_if = "Option::is_none")]
      x: Option<f64>,
      #[serde(skip_serializing_if = "Option::is_none")]
      y: Option<f64>,
      #[serde(skip_serializing_if = "Option::is_none", rename = "seatAssignments")]
      seat_assignments: Option<Vec<SeatAssignment>>,
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
      
      let json = serde_json::to_string_pretty(&plan).map_err(|e| e.to_string())?;
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
      
      let data = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
      let plan: WeddingPlan = serde_json::from_str(&data).map_err(|e| e.to_string())?;
      
      Ok(plan)
  }
  
  fn main() {
      tauri::Builder::default()
          .invoke_handler(tauri::generate_handler![save_wedding_plan, load_wedding_plan])
          .run(tauri::generate_context!())
          .expect("error while running tauri application");
  }