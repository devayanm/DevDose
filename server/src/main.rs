use crate::db::establish_connection;
use crate::routes::{auth_routes, content_aggregation_routes, search_routes, social_routes};
use actix_web::{web, App, HttpServer};
use std::sync::Arc;
use tokio::sync::Mutex;

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

    // test::test_insert_article().await;

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .configure(auth_routes)
            .configure(content_aggregation_routes)
            .configure(social_routes)
            .configure(search_routes)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
