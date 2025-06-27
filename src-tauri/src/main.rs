#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
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
#[serde(rename_all = "lowercase")]
pub enum WishStatus {
    Available,
    Reserved,
    Purchased,
}

impl Default for WishStatus {
    fn default() -> Self {
        WishStatus::Available
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum MediaType {
    Image,
    Video,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "lowercase")]
pub enum MediaCategory {
    Ceremony,
    Reception,
    Preparation,
    Portraits,
    Party,
    Other,
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
struct MediaDimensions {
    width: u32,
    height: u32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct MediaItem {
    id: String,
    filename: String,
    #[serde(rename = "originalName")]
    original_name: String,
    #[serde(rename = "type")]
    media_type: MediaType,
    category: MediaCategory,
    #[serde(rename = "uploadedAt")]
    uploaded_at: String,
    #[serde(rename = "uploadedBy")]
    uploaded_by: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    caption: Option<String>,
    #[serde(default)]
    tags: Vec<String>,
    #[serde(rename = "isFavorite", default)]
    is_favorite: bool,
    #[serde(rename = "fileSize")]
    file_size: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    dimensions: Option<MediaDimensions>,
    #[serde(skip_serializing_if = "Option::is_none")]
    duration: Option<f64>,
    #[serde(rename = "thumbnailPath", skip_serializing_if = "Option::is_none")]
    thumbnail_path: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct WishlistItem {
    id: String,
    title: String,
    price: f64,
    currency: String,
    image_url: String,
    product_url: String,
    #[serde(default)]
    status: WishStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    reserved_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    reserved_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    notes: Option<String>,
}

// Extended ceremony details
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
struct CeremonyDetails {
    #[serde(skip_serializing_if = "Option::is_none")]
    venue: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    city: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    state: Option<String>,
    #[serde(rename = "zipCode", skip_serializing_if = "Option::is_none")]
    zip_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    duration: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    officiant: Option<String>,
}

// Extended reception details
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
struct ReceptionDetails {
    #[serde(skip_serializing_if = "Option::is_none")]
    venue: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    city: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    state: Option<String>,
    #[serde(rename = "zipCode", skip_serializing_if = "Option::is_none")]
    zip_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    time: Option<String>,
    #[serde(rename = "endTime", skip_serializing_if = "Option::is_none")]
    end_time: Option<String>,
    #[serde(rename = "cocktailHour", skip_serializing_if = "Option::is_none")]
    cocktail_hour: Option<String>,
    #[serde(rename = "dinnerTime", skip_serializing_if = "Option::is_none")]
    dinner_time: Option<String>,
    #[serde(rename = "dancingTime", skip_serializing_if = "Option::is_none")]
    dancing_time: Option<String>,
}

// Contact information
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
struct WeddingContactInfo {
    #[serde(rename = "coupleEmail", skip_serializing_if = "Option::is_none")]
    couple_email: Option<String>,
    #[serde(rename = "couplePhone", skip_serializing_if = "Option::is_none")]
    couple_phone: Option<String>,
    #[serde(rename = "plannerName", skip_serializing_if = "Option::is_none")]
    planner_name: Option<String>,
    #[serde(rename = "plannerEmail", skip_serializing_if = "Option::is_none")]
    planner_email: Option<String>,
    #[serde(rename = "plannerPhone", skip_serializing_if = "Option::is_none")]
    planner_phone: Option<String>,
    #[serde(rename = "emergencyContactName", skip_serializing_if = "Option::is_none")]
    emergency_contact_name: Option<String>,
    #[serde(rename = "emergencyContactPhone", skip_serializing_if = "Option::is_none")]
    emergency_contact_phone: Option<String>,
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
    #[serde(default)]
    wishlist: Vec<WishlistItem>,
    #[serde(default)]
    media: Vec<MediaItem>,
    
    // Extended wedding details
    #[serde(default)]
    ceremony: CeremonyDetails,
    #[serde(default)]
    reception: ReceptionDetails,
    #[serde(rename = "contactInfo", default)]
    contact_info: WeddingContactInfo,
    
    // Additional details
    #[serde(rename = "dressCode", skip_serializing_if = "Option::is_none")]
    dress_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    theme: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    colors: Option<String>,
    #[serde(rename = "rsvpDeadline", skip_serializing_if = "Option::is_none")]
    rsvp_deadline: Option<String>,
    #[serde(rename = "giftMessage", skip_serializing_if = "Option::is_none")]
    gift_message: Option<String>,
    #[serde(rename = "specialInstructions", skip_serializing_if = "Option::is_none")]
    special_instructions: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    parking: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    transportation: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    accommodation: Option<String>,
    #[serde(rename = "weatherPlan", skip_serializing_if = "Option::is_none")]
    weather_plan: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    website: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    hashtag: Option<String>,
    
    // Schedule/Timeline
    #[serde(rename = "gettingReadyTime", skip_serializing_if = "Option::is_none")]
    getting_ready_time: Option<String>,
    #[serde(rename = "photosTime", skip_serializing_if = "Option::is_none")]
    photos_time: Option<String>,
    #[serde(rename = "ceremonyStartTime", skip_serializing_if = "Option::is_none")]
    ceremony_start_time: Option<String>,
    #[serde(rename = "cocktailStartTime", skip_serializing_if = "Option::is_none")]
    cocktail_start_time: Option<String>,
    #[serde(rename = "receptionStartTime", skip_serializing_if = "Option::is_none")]
    reception_start_time: Option<String>,
    #[serde(rename = "cakeTime", skip_serializing_if = "Option::is_none")]
    cake_time: Option<String>,
    #[serde(rename = "bouquetTossTime", skip_serializing_if = "Option::is_none")]
    bouquet_toss_time: Option<String>,
    #[serde(rename = "lastDanceTime", skip_serializing_if = "Option::is_none")]
    last_dance_time: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct TodoItem {
    id: i64,
    text: String,
    completed: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    cost: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    budget: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    payment_status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    due_date: Option<String>,
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
            wishlist: Vec::new(),
            media: Vec::new(),
            ceremony: CeremonyDetails::default(),
            reception: ReceptionDetails::default(),
            contact_info: WeddingContactInfo::default(),
            dress_code: None,
            theme: None,
            colors: None,
            rsvp_deadline: None,
            gift_message: None,
            special_instructions: None,
            parking: None,
            transportation: None,
            accommodation: None,
            weather_plan: None,
            website: None,
            hashtag: None,
            getting_ready_time: None,
            photos_time: None,
            ceremony_start_time: None,
            cocktail_start_time: None,
            reception_start_time: None,
            cake_time: None,
            bouquet_toss_time: None,
            last_dance_time: None,
        }
    }
}

// Helper function to get media directory
fn get_media_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_data_dir(&app_handle.config()).ok_or("Failed to get app data dir")?;
    let media_dir = app_data_dir.join("media");
    
    if !media_dir.exists() {
        fs::create_dir_all(&media_dir).map_err(|e| e.to_string())?;
    }
    
    Ok(media_dir)
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

#[tauri::command]
async fn save_media_file(
    app_handle: tauri::AppHandle,
    file_name: String,
    file_data: Vec<u8>,
) -> Result<String, String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(&file_name);
    
    fs::write(&file_path, file_data).map_err(|e| e.to_string())?;
    
    // Return the relative path
    Ok(format!("media/{}", file_name))
}

#[tauri::command]
fn get_media_file_data(app_handle: tauri::AppHandle, filename: String) -> Result<Vec<u8>, String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(&filename);
    
    if !file_path.exists() {
        return Err(format!("File not found: {}", filename));
    }
    
    fs::read(file_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_media_file(app_handle: tauri::AppHandle, filename: String) -> Result<(), String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(filename);
    
    if file_path.exists() {
        fs::remove_file(file_path).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
fn get_media_file_info(app_handle: tauri::AppHandle, filename: String) -> Result<(u64, Option<MediaDimensions>), String> {
    let media_dir = get_media_dir(&app_handle)?;
    let file_path = media_dir.join(&filename);
    
    if !file_path.exists() {
        return Err("File not found".to_string());
    }
    
    let metadata = fs::metadata(&file_path).map_err(|e| e.to_string())?;
    let file_size = metadata.len();
    
    // For now, we'll return None for dimensions
    // In a real implementation, you'd use an image processing library
    // to get actual dimensions for images
    Ok((file_size, None))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_wedding_plan,
            load_wedding_plan,
            save_media_file,
            get_media_file_data,
            delete_media_file,
            get_media_file_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}