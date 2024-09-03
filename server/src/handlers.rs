pub use crate::models::article::Article;
use actix_web::{web, HttpResponse, Responder};
use futures_util::stream::StreamExt;
use mongodb::Client;
use std::sync::Arc;
use tokio::sync::Mutex;

pub async fn get_articles(client: web::Data<Arc<Mutex<Client>>>) -> impl Responder {
    let client = client.lock().await;
    let db = client.database("devdosedb");
    let collection = db.collection::<Article>("articles");

    let mut cursor = collection.find(None, None).await.unwrap();
    let mut articles = vec![];

    while let Some(doc) = cursor.next().await {
        match doc {
            Ok(article) => {
                println!("Fetched article: {:?}", article); // Debugging line
                articles.push(article)
            }
            Err(err) => {
                eprintln!("Error fetching article: {}", err); // Error handling
                return HttpResponse::InternalServerError().finish();
            }
        }
    }

    HttpResponse::Ok().json(articles)
}

pub async fn post_article(
    client: web::Data<Arc<Mutex<Client>>>,
    article: web::Json<Article>,
) -> impl Responder {
    let client = client.lock().await;
    let db = client.database("devdosedb");
    let collection = db.collection::<Article>("articles");

    let result = collection.insert_one(article.into_inner(), None).await;

    match result {
        Ok(_) => {
            println!("Article inserted successfully"); // Debugging line
            HttpResponse::Created().finish()
        }
        Err(err) => {
            eprintln!("Error inserting article: {}", err); // Error handling
            HttpResponse::InternalServerError().finish()
        }
    }
}
