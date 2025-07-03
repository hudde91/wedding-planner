use super::run;

#[cfg(mobile)]
#[no_mangle]
#[cfg(target_os = "android")]
pub extern "C" fn Java_com_weddingplanner_app_MainActivity_init() {
    run();
}

#[cfg(mobile)]
#[no_mangle]
#[cfg(target_os = "ios")]
pub extern "C" fn start_app() {
    run();
}