use serde::{Deserialize, Serialize};
use mongodb::bson::DateTime;

#[derive(Debug, Serialize, Deserialize)]
pub struct UserInteraction {
    pub user_id: String,
    pub article_id: String,
    pub action: String,
    pub timestamp: DateTime,
}
