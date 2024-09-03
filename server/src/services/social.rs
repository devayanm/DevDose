use crate::models::{comment::Comment, like::Like};
use mongodb::bson::{doc, oid::ObjectId};
use actix_web::{web, HttpResponse, Responder};
use mongodb::{Client, Collection};
use std::sync::{Arc, Mutex};


pub async fn add_comment(
    client: web::Data<Arc<Mutex<Client>>>,
    article_id: String,
    user_id: String,
    content: String,
) -> impl Responder {
    let comment = Comment::new(
        ObjectId::parse_str(&article_id).unwrap(),
        ObjectId::parse_str(&user_id).unwrap(),
        content,
    );

    let collection= client.lock().unwrap().database("devdose").collection("comments");
    collection.insert_one(comment, None).await.unwrap();

    HttpResponse::Created().body("Comment added")
}

pub async fn like_article(
    client: web::Data<Arc<Mutex<Client>>>,
    article_id: String,
    user_id: String,
) -> impl Responder {
    let like = Like {
        id: None,
        article_id: ObjectId::parse_str(&article_id).unwrap(),
        user_id: ObjectId::parse_str(&user_id).unwrap(),
    };

    let collection: Collection<Like> = client.lock().unwrap().database("devdose").collection("likes");
    collection.insert_one(like, None).await.unwrap();

    HttpResponse::Ok().body("Article liked")
}

pub async fn unlike_article(
    client: web::Data<Arc<Mutex<Client>>>,
    article_id: String,
    user_id: String,
) -> impl Responder {
    let collection: Collection<Like> = client.lock().unwrap().database("devdose").collection("likes");

    let article_id = match ObjectId::parse_str(&article_id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().body("Invalid article ID"),
    };

    let user_id = match ObjectId::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().body("Invalid user ID"),
    };

    match collection
        .delete_one(
            doc! {
                "article_id": article_id,
                "user_id": user_id,
            },
            None,
        )
        .await
    {
        Ok(_) => HttpResponse::Ok().body("Article unliked"),
        Err(_) => HttpResponse::InternalServerError().body("Failed to unlike article"),
    }
}