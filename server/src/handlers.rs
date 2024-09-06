pub use crate::models::article::Article;
use actix_web::{web, HttpResponse, Responder};
use futures_util::stream::StreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use mongodb::Client;
use std::sync::Arc;
use tokio::sync::Mutex;

pub async fn get_articles(client: web::Data<Arc<Mutex<Client>>>) -> impl Responder {
    let client = client.lock().await;
    let db = client.database("devdosedb");
    let collection = db.collection::<Article>("articles");

    let mut cursor = match collection.find(None, None).await {
        Ok(cursor) => cursor,
        Err(err) => {
            eprintln!("Error creating MongoDB cursor: {}", err);
            return HttpResponse::InternalServerError().json("Failed to fetch articles");
        }
    };

    let mut articles = vec![];

    while let Some(doc) = cursor.next().await {
        match doc {
            Ok(article) => {
                println!("Fetched article: {:?}", article); 
                articles.push(article)
            }
            Err(err) => {
                eprintln!("Error fetching article: {}", err); 
                return HttpResponse::InternalServerError().json("Failed to fetch articles");
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
            println!("Article inserted successfully");
            HttpResponse::Created().finish()
        }
        Err(err) => {
            eprintln!("Error inserting article: {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}

pub async fn get_article_by_id(
    client: web::Data<Arc<Mutex<Client>>>,
    article_id: web::Path<String>,
) -> impl Responder {
    let client = client.lock().await;
    let db = client.database("devdosedb");
    let collection = db.collection::<Article>("articles");

    let object_id = match ObjectId::parse_str(&article_id.into_inner()) {
        Ok(oid) => oid,
        Err(_) => return HttpResponse::BadRequest().json("Invalid article ID format"),
    };

    let filter = doc! { "_id": object_id };
    match collection.find_one(filter, None).await {
        Ok(Some(article)) => HttpResponse::Ok().json(article),
        Ok(None) => HttpResponse::NotFound().json("Article not found"),
        Err(err) => {
            eprintln!("Error fetching article by ID: {}", err);
            HttpResponse::InternalServerError().json("Failed to fetch article")
        }
    }
}