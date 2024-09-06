import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function ArticleCard({ article }) {
  return (
    <Card
      className="shadow-sm mb-4"
      style={{
        backgroundColor: '#1c1c1c',
        borderRadius: '15px',
        color: '#e0e0e0',
        transition: 'transform 0.3s, box-shadow 0.3s',
        overflow: 'hidden',
      }}
    >
      {article.image && (
        <Card.Img
          variant="top"
          src={article.image}
          alt={article.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}

      <Card.Body>
        <Card.Title
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#fff',
          }}
        >
          {article.title}
        </Card.Title>
        <Card.Text
          style={{
            fontSize: '1rem',
            color: '#ccc',
            minHeight: '80px',
            maxHeight: '80px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {article.summary || 'No summary available.'}
        </Card.Text>

        <Link to={`/article/${article.id}`}>
          <Button
            variant="outline-light"
            style={{
              borderRadius: '50px',
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              border: '2px solid #00bcd4',
              color: '#00bcd4',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Read More
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ArticleCard;
