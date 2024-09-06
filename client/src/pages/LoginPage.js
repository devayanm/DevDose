import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { loginUser } from '../services/api';
import LoginForm from '../components/LoginForm';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (loginData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginUser(loginData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile'); 
        }, 1000);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        // background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Container style={{ maxWidth: '600px' }}>
        <Card style={{ padding: '2rem', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)' }}>
          <Card.Body>
            <h2 className="text-center mb-4" style={{ color: '#333' }}>Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Login successful! Redirecting...</Alert>}

            <LoginForm onSubmit={handleLogin} />

            {loading && (
              <div className="text-center mt-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;
