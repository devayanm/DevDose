import React from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <Link to={`/article/${article.id}`}>Read more</Link>
    </div>
  );
}

export default ArticleCard;
