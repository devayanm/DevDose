import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';
import { registerUser } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (registerData) => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await registerUser(registerData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login'); // Redirect to login page or another page as needed
        }, 1000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
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
            <h2 className="text-center mb-4" style={{ color: '#333' }}>Register</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Registration successful! Redirecting...</Alert>}

            <RegisterForm onSubmit={handleRegister} />

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

export default RegisterPage;
