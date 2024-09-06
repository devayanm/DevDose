import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { Form, Button, Alert, Spinner, Container, Card } from 'react-bootstrap';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({ username, email, password });
      console.log('Registration successful:', response);
      setSuccess(true);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }}>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Registration successful!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                borderRadius: '50px',
                padding: '0.75rem 1.25rem',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: '50px',
                padding: '0.75rem 1.25rem',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: '50px',
                padding: '0.75rem 1.25rem',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100"
            disabled={loading}
            style={{
              borderRadius: '50px',
              padding: '0.75rem',
              fontSize: '1rem',
              background: 'linear-gradient(45deg, #00bcd4, #ff4081)',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              'Register'
            )}
          </Button>
        </Form>

        <hr className="my-4" />

        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center justify-content-center"
            style={{
              borderRadius: '50px',
              padding: '0.75rem',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            }}
          >
            <FaGoogle className="me-2" />
            Sign up with Google
          </Button>
          <Button
            variant="outline-dark"
            className="d-flex align-items-center justify-content-center"
            style={{
              borderRadius: '50px',
              padding: '0.75rem',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            }}
          >
            <FaGithub className="me-2" />
            Sign up with GitHub
          </Button>
        </div>
      </Card.Body>
    </Container>
  );
}

export default RegisterForm;
