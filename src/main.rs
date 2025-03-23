use actix_files::Files;
use actix_web::{web, App, HttpServer, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct ApiResponse {
    message: String,
}

async fn api_handler() -> impl Responder {
    web::Json(ApiResponse {
        message: "Hello from Rust!".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/api").route(web::get().to(api_handler)))
            .service(Files::new("/", "./static").index_file("index.html"))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
