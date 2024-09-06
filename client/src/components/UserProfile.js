import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../services/api";
import { Container, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function UserProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await fetchUserProfile();
        dispatch({ type: "SET_USER", payload: userData });
        setFormData({
          username: userData.username,
          email: userData.email,
        });
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      await updateUserProfile(formData);
      dispatch({ type: "SET_USER", payload: formData });
      setEditMode(false);
    } catch (error) {
      setError("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">Please log in to see your profile.</div>
    );
  }

  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h2 className="text-center mb-4">Profile</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {editMode ? (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              style={{ borderRadius: "50px", padding: "0.75rem" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              style={{ borderRadius: "50px", padding: "0.75rem" }}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button
              variant="primary"
              onClick={handleSave}
              className="me-2"
              style={{ borderRadius: "50px" }}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => setEditMode(false)}
              style={{ borderRadius: "50px" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <div className="mb-3">
            <strong>Username:</strong> {user.username}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {user.email}
          </div>
          <Button
            variant="primary"
            onClick={() => setEditMode(true)}
            style={{ borderRadius: "50px" }}
          >
            Edit Profile
          </Button>
        </>
      )}
    </Container>
  );
}

export default UserProfile;
