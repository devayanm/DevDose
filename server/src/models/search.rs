use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchQuery {
    pub keyword: Option<String>,
    pub tags: Option<Vec<String>>,
    pub category: Option<String>,
}
