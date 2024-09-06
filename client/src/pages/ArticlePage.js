import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch the article from the backend API using the id
        const response = await fetch(`/api/articles/${id}`);
        const data = await response.json();

        if (response.ok) {
          setArticle(data);
        } else {
          throw new Error("Article not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: "#00bcd4" }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ color: "#e0e0e0" }}>
      {/* Article Image */}
      {article.image && (
        <Image
          src={article.image}
          alt={article.title}
          fluid
          style={{
            maxHeight: "500px",
            width: "100%",
            objectFit: "cover",
            borderRadius: "15px",
            marginBottom: "1.5rem",
          }}
        />
      )}

      {/* Article Title */}
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          color: "#fff",
        }}
      >
        {article.title}
      </h1>

      {/* Article Metadata */}
      <div style={{ marginBottom: "2rem", color: "#b0b0b0", fontSize: "1rem" }}>
        <span>By {article.author || "Unknown Author"}</span>
        <span style={{ marginLeft: "1rem" }}>
          {new Date(article.publishedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Article Content */}
      <p
        style={{
          fontSize: "1.25rem",
          lineHeight: "1.8",
          color: "#d0d0d0",
          textAlign: "justify",
        }}
      >
        {article.content}
      </p>
    </Container>
  );
}

export default ArticlePage;
