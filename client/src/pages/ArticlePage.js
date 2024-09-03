import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Fetch the article from the backend API using the id
    // setArticle(data);
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}

export default ArticlePage;
