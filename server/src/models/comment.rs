use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct Comment {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub article_id: ObjectId,
    pub user_id: ObjectId,
    pub content: String,
    pub created_at: String,
}

impl Comment {
    pub fn new(article_id: ObjectId, user_id: ObjectId, content: String) -> Self {
        Comment {
            id: None,
            article_id,
            user_id,
            content,
            created_at: Utc::now().to_string(),
        }
    }
}
