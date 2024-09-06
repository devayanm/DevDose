use crate::handlers::Article;
use actix_web::web;
use chrono::Utc;
use mongodb::Client;
use reqwest::header::USER_AGENT;
use rss::Channel;
use scraper::{Html, Selector};
use std::sync::Arc;
use tokio::sync::Mutex;
use xml::reader::{EventReader, XmlEvent};

pub async fn fetch_articles_from_source(
    client: web::Data<Arc<Mutex<Client>>>,
    source_url: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let res = reqwest::Client::new()
        .get(source_url)
        .header(USER_AGENT, "Mozilla/5.0")
        .send()
        .await?;
    let body = res.text().await?;

    if source_url.ends_with(".xml") || source_url.ends_with(".rss") {
        match Channel::read_from(body.as_bytes()) {
            Ok(channel) => {
                for item in channel.items() {
                    let title = item.title().unwrap_or("No Title Found").to_string();
                    let url = item.link().unwrap_or("#").to_string();
                    let description = item
                        .description()
                        .unwrap_or("No Description Found")
                        .to_string();
                    let published_at = item
                        .pub_date()
                        .unwrap_or(&Utc::now().to_string())
                        .to_string();

                    let article = Article {
                        id: None,
                        title,
                        url,
                        description,
                        source: source_url.to_string(),
                        published_at,
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
            }
            Err(err) => {
                eprintln!("Failed to parse RSS feed from {}: {:?}", source_url, err);
            }
        }
    } else if source_url.ends_with(".atom") || source_url.contains("atom") {
        let parser = EventReader::from_str(&body);
        let mut inside_entry = false;
        let mut current_element = String::new();
        let mut title = "No Title Found".to_string();
        let mut url = "#".to_string();
        let mut description = "No Description Found".to_string();
        let mut published_at = Utc::now().to_string();

        for e in parser {
            match e {
                Ok(XmlEvent::StartElement { name, .. }) => {
                    current_element = name.local_name.clone();
                    if name.local_name == "entry" {
                        inside_entry = true;
                        title = "No Title Found".to_string();
                        url = "#".to_string();
                        description = "No Description Found".to_string();
                        published_at = Utc::now().to_string();
                    }
                }
                Ok(XmlEvent::Characters(data)) => {
                    if inside_entry {
                        match current_element.as_str() {
                            "title" => title = data,
                            "link" => url = data,
                            "summary" | "content" => description = data,
                            "updated" => published_at = data,
                            _ => {}
                        }
                    }
                }
                Ok(XmlEvent::EndElement { name }) => {
                    if name.local_name == "entry" {
                        let article = Article {
                            id: None,
                            title: title.clone(),
                            url: url.clone(),
                            description: description.clone(),
                            source: source_url.to_string(),
                            published_at: published_at.clone(),
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

                        inside_entry = false;
                    }
                }
                Err(err) => {
                    eprintln!("Failed to parse Atom feed from {}: {:?}", source_url, err);
                }
                _ => {}
            }
        }
    } else {
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
    }

    Ok(())
}
