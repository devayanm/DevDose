use mongodb::{Client, options::ClientOptions};
use std::env;

pub async fn establish_connection() -> mongodb::error::Result<Client> {
    dotenv::dotenv().ok();
    let db_uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");

    let mut client_options = ClientOptions::parse(&db_uri).await?;
    client_options.app_name = Some("devdosedb".to_string());

    let client = Client::with_options(client_options)?;

    println!("Successfully connected to MongoDB!");

    Ok(client)
}
