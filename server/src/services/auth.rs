use jsonwebtoken::{encode, Header, EncodingKey};
use mongodb::bson::{doc, Document};
use mongodb::Client;
use serde::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;
use tokio::sync::Mutex;
use actix_web::{web, HttpResponse, Responder, Result, Error};
use actix_web::error::ErrorInternalServerError;
use chrono::Utc;
use crate::models::user::{NewUser, User, LoginData};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

fn get_secret_key() -> Vec<u8> {
    dotenv::dotenv().ok();
    env::var("SECRET_KEY").unwrap_or_else(|_| "your_secret_key".to_string()).into_bytes()
}

pub async fn register_user(
    client: web::Data<Arc<Mutex<Client>>>,
    new_user: web::Json<NewUser>,
) -> Result<impl Responder, Error> {
    let user_collection = client.lock().await.database("devdosedb").collection::<User>("users");

    let password_hash = User::hash_password(&new_user.password)
        .map_err(|_| ErrorInternalServerError("Failed to hash password"))?;
    let user = User {
        id: None,
        username: new_user.username.clone(),
        email: new_user.email.clone(),
        password_hash,
    };

    user_collection
        .insert_one(user, None)
        .await
        .map_err(|_| ErrorInternalServerError("Failed to insert user"))?;

    Ok(HttpResponse::Created().finish())
}

pub async fn login_user(
    client: web::Data<Arc<Mutex<Client>>>,
    login_data: web::Json<LoginData>,
) -> Result<impl Responder, Error> {
    let user_collection = client.lock().await.database("devdosedb").collection::<Document>("users");

    if let Some(user_doc) = user_collection
        .find_one(doc! {"email": &login_data.email}, None)
        .await
        .map_err(|_| ErrorInternalServerError("Failed to find user"))?
    {
        let user: User = mongodb::bson::from_document(user_doc)
            .map_err(|_| ErrorInternalServerError("Failed to deserialize user"))?;

        if user.verify_password(&login_data.password)
            .map_err(|_| ErrorInternalServerError("Failed to verify password"))?
        {
            let token = encode(
                &Header::default(),
                &Claims {
                    sub: user.email.clone(),
                    exp: Utc::now()
                        .checked_add_signed(chrono::Duration::hours(24))
                        .expect("valid timestamp")
                        .timestamp() as usize,
                },
                &EncodingKey::from_secret(&get_secret_key()),
            ).map_err(|_| ErrorInternalServerError("Failed to encode token"))?;

            return Ok(HttpResponse::Ok().json(token));
        }
    }

    Ok(HttpResponse::Unauthorized().finish())
}

pub async fn get_user_profile(
    client: web::Data<Arc<Mutex<Client>>>,
    email: web::Path<String>,
) -> Result<impl Responder, Error> {
    let user_collection = client.lock().await.database("devdosedb").collection::<Document>("users");

    if let Some(user_doc) = user_collection
        .find_one(doc! {"email": email.clone()}, None)
        .await
        .map_err(|_| ErrorInternalServerError("Failed to find user"))?
    {
        let user: User = mongodb::bson::from_document(user_doc)
            .map_err(|_| ErrorInternalServerError("Failed to deserialize user"))?;

        return Ok(HttpResponse::Ok().json(user));
    }

    Ok(HttpResponse::NotFound().body("User not found"))
}

pub async fn update_user_profile(
    client: web::Data<Arc<Mutex<Client>>>,
    email: web::Path<String>,
    updated_user: web::Json<User>,
) -> Result<impl Responder, Error> {
    let user_collection = client.lock().await.database("devdosedb").collection::<Document>("users");

    let filter = doc! {"email": email.clone()};
    let update = doc! {
        "$set": {
            "username": &updated_user.username,
            "email": &updated_user.email,
            "password_hash": &updated_user.password_hash,
        }
    };

    user_collection
        .update_one(filter, update, None)
        .await
        .map_err(|_| ErrorInternalServerError("Failed to update user profile"))?;

    Ok(HttpResponse::Ok().body("Profile updated successfully"))
}
