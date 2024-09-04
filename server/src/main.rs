use actix_cors::Cors;
use crate::db::establish_connection;
use actix_web::{middleware, web, App, HttpServer};
use std::sync::Arc;
use tokio::sync::Mutex;
use reqwest;

mod db;
mod handlers;
mod models;
mod routes;
mod services;
mod test;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let client = establish_connection()
        .await
        .expect("Failed to connect to MongoDB");
    let data = web::Data::new(Arc::new(Mutex::new(client)));

    let aggregator_client = reqwest::Client::new();
    tokio::spawn(async move {
        let _ = aggregator_client.post("http://localhost:8080/content/aggregate")
            .send()
            .await
            .map_err(|e| eprintln!("Failed to aggregate content: {:?}", e));
    });

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials(),
            )
            .wrap(middleware::Logger::default())
            .configure(routes::auth_routes)
            .configure(routes::content_aggregation_routes)
            .configure(routes::social_routes)
            .configure(routes::search_routes)
            .configure(routes::article_routes)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
