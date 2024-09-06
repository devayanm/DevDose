use crate::models::{article::Article, search::SearchQuery};
use mongodb::bson::{doc, Document};
use mongodb::Client;
use actix_web::{web, HttpResponse, Responder};
use std::sync::Arc;
use tokio::sync::Mutex;
use futures_util::TryStreamExt;

pub async fn search_articles(
    client: web::Data<Arc<Mutex<Client>>>,
    query: web::Json<SearchQuery>,
) -> impl Responder {
    let mut filter = Document::new();

    if let Some(keyword) = &query.keyword {
        filter.insert("title", doc! { "$regex": keyword, "$options": "i" });
    }

    if let Some(tags) = &query.tags {
        filter.insert("tags", doc! { "$in": tags });
    }

    if let Some(category) = &query.category {
        filter.insert("category", category);
    }

    let collection = client.lock().await.database("devdosedb").collection::<Article>("articles");
    let cursor = collection.find(filter, None).await.unwrap();

    let articles: Vec<Article> = cursor.try_collect().await.unwrap();

    HttpResponse::Ok().json(articles)
}
