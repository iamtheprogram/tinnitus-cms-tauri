#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

//Libraries
use hound::WavReader;
use std::{
    fs::{self, File},
    io::BufReader,
    path::Path,
};
use tauri::{
    api::{dialog::blocking::*, shell},
    utils::assets::EmbeddedAssets,
    AboutMetadata, Context, Manager, MenuEntry,
};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

//Project specific modules
mod oci;
mod utils;
use oci::object_storage::*;
use oci::provider::*;

#[tauri::command]
fn set_oci_credentials(
    user: String,
    tenancy: String,
    fingerprint: String,
    namespace: String,
    preauthreq: String,
    key: String,
    key_id: String,
) -> Result<String, String> {
    let provider_credentials = OciProvider::new(
        user,
        tenancy,
        fingerprint,
        namespace,
        preauthreq,
        key,
        key_id,
    );
    let result = init_provider(provider_credentials);

    match result {
        Ok(_) => Ok("OK".to_string()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn get_album_object(
    bucket: String,
    object_path: String,
    object_name: String,
) -> Result<String, String> {
    let album_service = ObjectStorage::new();
    let result = album_service
        .get_object(&bucket, &object_path, &object_name)
        .await;

    match result {
        Ok(body) => Ok(body),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
async fn get_artwork() -> (bool, String, String) {
    let dialog = FileDialogBuilder::new();
    let mut path = "".to_string();
    let mut result = false;
    let mut data: String = "".to_string();

    let dialog_result = dialog
        .set_title("Select Artwork")
        .add_filter("Images", &["png", "jpg", "jpeg", "bmp"])
        .pick_file();

    if dialog_result.is_some() {
        path = dialog_result.unwrap().to_str().unwrap().to_string();
        let temp_path = Path::new(&path);
        result = true;
        let read_data = fs::read(temp_path).unwrap();
        //Use base64 to represent data as a string and process image in frontend
        data = base64::encode(&read_data);
    }

    (result, path, data)
}

#[tauri::command]
async fn get_audio_files() -> (bool, Vec<SongData>) {
    let dialog = FileDialogBuilder::new();
    let mut result = false;
    let mut songs: Vec<SongData> = Vec::new();

    let dialog_result = dialog
        .set_title("Select Artwork")
        .add_filter("Images", &["wav"])
        .pick_files();

    if dialog_result.is_some() {
        result = true;
        let paths = dialog_result.unwrap();

        for path in &paths {
            let file = File::open(&path).unwrap();
            //Underlying file is a BufReader, so we can read it directly
            let buff_reader = BufReader::new(file);
            //Use WAVE reader to read the WAV file
            let wav_reader = WavReader::new(buff_reader).unwrap();
            let sample_rate = wav_reader.spec().sample_rate;
            let sample_count = wav_reader.duration();
            //Duration[s] = sample_count / sample_rate
            let duration_sec = (sample_count as f64 / sample_rate as f64).round() as i64;
            let song_data = SongData::new(
                path.to_str().unwrap().to_string(),
                path.extension().unwrap().to_str().unwrap().to_string(),
                path.file_stem().unwrap().to_str().unwrap().to_string(),
                duration_sec,
            );
            songs.push(song_data);
        }
    }

    (result, songs)
}

#[tauri::command]
async fn upload_file(name: String, path: String, file: String) -> (bool, String) {
    let read_data = fs::read(Path::new(file.as_str())).unwrap();
    // let data = base64::encode(&read_data);
    let oci_album_service = ObjectStorage::new();
    // let response: Result<String, Box<dyn std::error::Error + Send + Sync>>;

    // TODO: Feature to come in next release
    //Upload with multipart if greater than 100MB
    // if read_data.len() > 104857600 {
    //     response = oci_album_service
    //         .put_object_multipart(&"tinnitus".to_string(), &path, &name, read_data)
    //         .await;
    // } else {
    //     response = oci_album_service
    //         .put_object(&"tinnitus".to_string(), &path, &name, read_data)
    //         .await;
    // }

    let response = oci_album_service
        .put_object("tinnitus", &path, &name, read_data)
        .await;

    match response {
        Ok(body) => (true, body),
        Err(e) => (false, e.to_string()),
    }
}

#[tauri::command]
async fn delete_album(album: String, files: Vec<String>) -> (bool, String) {
    let oci_album_service = ObjectStorage::new();
    let mut response: Result<(), Box<dyn std::error::Error + Send + Sync>> = Ok(());

    for file in files {
        response = oci_album_service.delete_object(&album, &file).await;
    }

    match response {
        Ok(_body) => (true, "OK".to_string()),
        Err(e) => (false, e.to_string()),
    }
}

fn create_menu(ctx: &Context<EmbeddedAssets>) -> Menu {
    return Menu::with_items([
        #[cfg(target_os = "macos")]
        MenuEntry::Submenu(Submenu::new(
            &ctx.package_info().name,
            Menu::with_items([
                MenuItem::About(ctx.package_info().name.clone(), AboutMetadata::new()).into(),
                MenuItem::Separator.into(),
                MenuItem::Services.into(),
                MenuItem::Separator.into(),
                MenuItem::Hide.into(),
                MenuItem::HideOthers.into(),
                MenuItem::ShowAll.into(),
                MenuItem::Separator.into(),
                MenuItem::Quit.into(),
            ]),
        )),
        MenuEntry::Submenu(Submenu::new(
            "Edit",
            Menu::with_items([
                MenuItem::Undo.into(),
                MenuItem::Redo.into(),
                MenuItem::Separator.into(),
                MenuItem::Cut.into(),
                MenuItem::Copy.into(),
                MenuItem::Paste.into(),
                #[cfg(not(target_os = "macos"))]
                MenuItem::Separator.into(),
                MenuItem::SelectAll.into(),
            ]),
        )),
        MenuEntry::Submenu(Submenu::new(
            "View",
            Menu::with_items([MenuItem::EnterFullScreen.into()]),
        )),
        MenuEntry::Submenu(Submenu::new(
            "Window",
            Menu::with_items([MenuItem::Minimize.into(), MenuItem::Zoom.into()]),
        )),
        // You should always have a Help menu on macOS because it will automatically
        // show a menu search field
        // MenuEntry::Submenu(Submenu::new(
        //     "Help",
        //     Menu::with_items([CustomMenuItem::new("Learn More", "Learn More").into()]),
        // )),
    ]);
}

fn main() {
    let ctx = tauri::generate_context!();
    let menu = create_menu(&ctx);
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            set_oci_credentials,
            get_album_object,
            get_artwork,
            get_audio_files,
            upload_file,
            delete_album,
        ])
        .menu(menu)
        .on_menu_event(|event| {
            let event_name = event.menu_item_id();
            event.window().emit("menu", event_name).unwrap();
            if event_name == "Learn More" {
                let link = "https://github.com/probablykasper/mr-tagger".to_string();
                shell::open(&event.window().shell_scope(), link, None).unwrap();
            }
        })
        .run(ctx)
        .expect("error while running tauri application");
}
