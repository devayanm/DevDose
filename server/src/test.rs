use crate::handlers::{get_articles, post_article, Article};
use crate::db;
use std::sync::Arc;
use tokio::sync::Mutex;
use actix_web::{test, web, App};

pub async fn test_insert_article() {
    let client = db::establish_connection()
        .await
        .expect("Failed to connect to MongoDB");
    let client_data = web::Data::new(Arc::new(Mutex::new(client)));

    // Set up the Actix Web app with the article routes
    let mut app = test::init_service(
        App::new()
            .app_data(client_data.clone())
            .route("/articles", web::post().to(post_article))
            .route("/articles", web::get().to(get_articles)),
    )
    .await;

    // Create a sample article
    let article = serde_json::json!({
        "title": "Test Article via HTTP",
        "url": "http://example.com",
        "description": "This is a test article sent via HTTP",
        "source": "Test Source",
        "published_at": "2024-09-03T00:00:00Z"
    });

    // Send a POST request to insert the article
    let req = test::TestRequest::post()
        .uri("/articles")
        .set_json(&article)
        .to_request();
    let resp = test::call_service(&mut app, req).await;
    assert!(resp.status().is_success());

    println!("Test article inserted via HTTP successfully");

    // Send a GET request to retrieve the inserted article
    let req = test::TestRequest::get().uri("/articles").to_request();
    let resp: Vec<Article> = test::call_and_read_body_json(&mut app, req).await;

    assert!(!resp.is_empty());
    println!("Fetched inserted article via HTTP: {:?}", resp);
}
