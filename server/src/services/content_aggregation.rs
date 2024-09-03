use crate::models::article::Article;
use mongodb::Client;
use reqwest;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::Mutex;
use actix_web::web;
use chrono::Utc;

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
            .unwrap()
            .text()
            .collect::<Vec<_>>()
            .join(" ");

        let url = element
            .select(&Selector::parse("a").unwrap())
            .next()
            .unwrap()
            .value()
            .attr("href")
            .unwrap()
            .to_string();

        let description = element
            .select(&Selector::parse("p").unwrap())
            .next()
            .unwrap()
            .text()
            .collect::<Vec<_>>()
            .join(" ");

        let article = Article {
            id: None,
            title: title.clone(),
            url: url.clone(),
            description: description.clone(),
            source: source_url.to_string(),
            published_at: Utc::now().to_string(),
        };

        let collection = client.lock().await.database("devdose").collection("articles");
        collection.insert_one(article, None).await?;
    }

    Ok(())
}
