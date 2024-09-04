use crate::services::auth::{get_user_profile, login_user, register_user, update_user_profile};
use crate::services::content_aggregation::fetch_articles_from_source;
use crate::handlers::{get_articles, post_article};
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
            .route("", web::post().to(post_article)),
    );
}

async fn aggregate_content(client: web::Data<Arc<Mutex<Client>>>) -> impl actix_web::Responder {
    let sources = vec![
        "https://news.ycombinator.com/rss",
        "https://www.techmeme.com/feed.xml",
        "https://dev.to/feed",
        "https://www.reddit.com/r/programming/.rss",
        "https://www.infoq.com/feed/",
        "https://css-tricks.com/feed/",
        "https://medium.com/feed/tag/programming",
        "https://www.smashingmagazine.com/feed/",
        "https://dzone.com/mz/dzone-rss.xml",
        "https://feeds.feedburner.com/GoogleWebmasterCentral",
        "https://martinfowler.com/feed.atom",
        "https://www.raywenderlich.com/feed.xml",
        "https://www.joelonsoftware.com/feed/",
        "https://cprss.s3.amazonaws.com/stackoverflow.xml",
        "https://www.reddit.com/r/webdev/.rss",
        "https://www.reddit.com/r/javascript/.rss",
        "https://www.reddit.com/r/rust/.rss",
        "https://feeds.feedburner.com/tedtalks_video",
        "https://www.reddit.com/r/machinelearning/.rss",
        "https://www.reddit.com/r/docker/.rss",
        "https://www.reddit.com/r/devops/.rss",
        "https://feeds.feedburner.com/official_golang_blog",
        "https://www.reddit.com/r/aws/.rss",
        "https://www.reddit.com/r/reactjs/.rss",
        "https://blog.rust-lang.org/feed.xml",
        "https://www.reddit.com/r/learnprogramming/.rss",
        "https://www.reddit.com/r/dataengineering/.rss",
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
