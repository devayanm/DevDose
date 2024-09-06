import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { searchArticles } from "../services/api"; // Ensure this is correctly imported
import "bootstrap/dist/css/bootstrap.min.css";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await searchArticles(query);
      setResults(response.articles || []);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <h1 className="text-center mb-4">Search Articles</h1>
          <Form className="d-flex mb-4">
            <Form.Control
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for articles..."
              style={{
                borderRadius: "50px",
                padding: "0.75rem 1.25rem",
                boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={loading}
              style={{
                borderRadius: "50px",
                marginLeft: "10px",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                background: "linear-gradient(45deg, #00bcd4, #ff4081)",
                border: "none",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Search"}
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}
          <div className="search-results">
            {results.length ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {results.map((article) => (
                  <Col key={article.id}>
                    <Card
                      style={{
                        borderRadius: "15px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Card.Body>
                        <Card.Title>{article.title}</Card.Title>
                        <Card.Text>{article.summary}</Card.Text>
                        <Button
                          variant="link"
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-center mt-4">No results found.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;
