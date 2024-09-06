import React, { useEffect, useState } from "react";
import ArticleCard from "../components/ArticleCard";
import { fetchArticles } from "../services/api";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(6); // Display 6 articles per page by default
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        setAllArticlesLoaded(data.length <= articlesPerPage); // Check if all articles are loaded initially
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    if (indexOfLastArticle >= articles.length) {
      setAllArticlesLoaded(true); // Hide the Show More button when all articles are loaded
    }
  };

  return (
    <div
      style={{
        color: "#e0e0e0",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section */}
      <Container
        style={{
          background:
            'linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url("/path-to-your-hero-image.jpg") no-repeat center center',
          backgroundSize: "cover",
          padding: "7rem 0",
          textAlign: "center",
          position: "relative",
          color: "#e0e0e0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        className="hero-section"
      >
        <div style={{ position: "relative", zIndex: "2" }}>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
            }}
          >
            Discover the Future of Tech
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: "2rem",
              textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
            }}
          >
            Your gateway to the latest advancements and trends in technology.
          </p>
          <Button
            variant="primary"
            size="lg"
            href="#articles"
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1.25rem",
              marginRight: "1rem",
              borderRadius: "50px",
              background: "linear-gradient(45deg, #00bcd4, #ff4081)",
              border: "none",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            Explore Now
          </Button>
          <Button
            variant="outline-light"
            size="lg"
            href="#contact"
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1.25rem",
              borderRadius: "50px",
              border: "2px solid #e0e0e0",
              color: "#e0e0e0",
              background: "transparent",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            Get in Touch
          </Button>
        </div>
      </Container>

      {/* Featured Section */}
      <Container style={{ marginTop: "6rem" }}>
        <h2
          className="text-center mb-4"
          style={{ color: "#e0e0e0", fontSize: "2.5rem", fontWeight: "bold" }}
        >
          Featured Articles
        </h2>
        <Row>
          {currentArticles.slice(0, 3).map((article) => (
            <Col key={article.id} md={4} className="mb-4">
              <div
                style={{
                  border: "none",
                  borderRadius: "15px",
                  padding: "16px",
                  backgroundColor: "#1c1c1c",
                  color: "#e0e0e0",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                className="article-card"
              >
                <ArticleCard article={article} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Articles Section */}
      <Container id="articles" className="mt-5">
        {loading && (
          <Container className="text-center mt-5">
            <Spinner
              animation="border"
              role="status"
              style={{ color: "#00bcd4" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Container>
        )}

        {error && (
          <Container className="text-center mt-5">
            <Alert variant="danger">{error}</Alert>
          </Container>
        )}

        {!loading && !error && (
          <Row>
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <Col key={article.id} md={4} className="mb-4">
                  <div
                    style={{
                      border: "none",
                      borderRadius: "15px",
                      padding: "16px",
                      backgroundColor: "#1c1c1c",
                      color: "#e0e0e0",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                    className="article-card"
                  >
                    <ArticleCard article={article} />
                  </div>
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center" style={{ color: "#e0e0e0" }}>
                  No articles available.
                </p>
              </Col>
            )}
          </Row>
        )}

        {/* Show More Button */}
        {!loading && !error && !allArticlesLoaded && (
          <div className="text-center mt-4">
            <Button
              variant="primary"
              onClick={handleShowMore}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1.25rem",
                borderRadius: "50px",
                background: "linear-gradient(45deg, #00bcd4, #ff4081)",
                border: "none",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                color: "#fff",
              }}
            >
              Show More
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
