use crate::handlers::{get_articles, get_article_by_id, post_article};
use crate::services::auth::{get_user_profile, login_user, register_user, update_user_profile};
use crate::services::content_aggregation::fetch_articles_from_source;
use crate::services::search::search_articles;
use crate::services::social::{add_comment, like_article, unlike_article};
use actix_web::web;
use mongodb::Client;
use std::sync::Arc;
use tokio::sync::Mutex;

pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/register", web::post().to(register_user))
            .route("/login", web::post().to(login_user))
            .route("/profile/{email}", web::get().to(get_user_profile))
            .route("/profile/{email}", web::put().to(update_user_profile)),
    );
}

pub fn content_aggregation_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/content").route("/aggregate", web::post().to(aggregate_content)));
}

pub fn article_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/articles")
            .route("", web::get().to(get_articles))
            .route("", web::post().to(post_article))
            .route("/{id}", web::get().to(get_article_by_id)),
    );
}

async fn aggregate_content(client: web::Data<Arc<Mutex<Client>>>) -> impl actix_web::Responder {
    let sources = vec![
        "https://techcrunch.com/feed/",
        "https://www.wired.com/feed/rss",
        "https://www.theverge.com/rss/index.xml",
        "https://arstechnica.com/feed/",
        "https://www.zdnet.com/news/rss.xml",
        "https://www.cnet.com/rss/news/",
        "https://venturebeat.com/feed/",
        "https://www.businessinsider.com/rss",
        "https://www.digitaltrends.com/rss/",
        "https://gizmodo.com/rss",
    ];

    for source in sources {
        if let Err(e) = fetch_articles_from_source(client.clone(), source).await {
            eprintln!("Failed to fetch articles from {}: {:?}", source, e);
        }
    }

    actix_web::HttpResponse::Ok().body("Content Aggregated")
}

pub fn social_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/social")
            .route("/comment", web::post().to(add_comment))
            .route("/like", web::post().to(like_article))
            .route("/unlike", web::post().to(unlike_article)),
    );
}

pub fn search_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/search").route("/articles", web::post().to(search_articles)));
}
