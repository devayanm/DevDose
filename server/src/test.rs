use crate::handlers::Article;
use crate::db;
use std::sync::Arc;
use tokio::sync::Mutex;

pub async fn test_insert_article() {
    let client = db::establish_connection().await.expect("Failed to connect to MongoDB");
    let client = Arc::new(Mutex::new(client));

    let article = Article {
        id: None,
        title: "Test Article".to_string(),
        url: "http://example.com".to_string(),
        description: "This is a test article".to_string(),
        source: "Test Source".to_string(),
        published_at: "2024-09-03T00:00:00Z".to_string(),
    };

    let db = client.lock().await.database("devdosedb");
    let collection = db.collection::<Article>("articles");
    let result = collection.insert_one(article, None).await;

    match result {
        Ok(_) => println!("Test article inserted successfully"),
        Err(err) => eprintln!("Error inserting test article: {}", err),
    }
}
