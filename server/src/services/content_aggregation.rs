use actix_web::web;
use chrono::Utc;
use mongodb::Client;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::handlers::Article;

pub async fn fetch_articles_from_source(
    client: web::Data<Arc<Mutex<Client>>>,
    source_url: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let res = reqwest::get(source_url).await?;
    let body = res.text().await?;
    let document = Html::parse_document(&body);

    let selector = Selector::parse("article").unwrap();

    for element in document.select(&selector) {
        let title = element
            .select(&Selector::parse("h2").unwrap())
            .next()
            .map(|el| el.text().collect::<Vec<_>>().join(" "))
            .unwrap_or_else(|| "No Title Found".to_string());

        let url = element
            .select(&Selector::parse("a").unwrap())
            .next()
            .and_then(|el| el.value().attr("href"))
            .unwrap_or("#")
            .to_string();

        let description = element
            .select(&Selector::parse("p").unwrap())
            .next()
            .map(|el| el.text().collect::<Vec<_>>().join(" "))
            .unwrap_or_else(|| "No Description Found".to_string());

        let article = Article {
            id: None,
            title,
            url,
            description,
            source: source_url.to_string(),
            published_at: Utc::now().to_string(),
        };

        let collection = client
            .lock()
            .await
            .database("devdosedb")
            .collection("articles");
        match collection.insert_one(article, None).await {
            Ok(_) => println!("Article inserted successfully"),
            Err(err) => eprintln!("Error inserting article: {}", err),
        }
    }

    Ok(())
}
