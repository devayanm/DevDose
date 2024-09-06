import React from "react";
import UserProfile from "../components/UserProfile";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaSignOutAlt } from "react-icons/fa";

function ProfilePage() {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        padding: "2rem",
        // background: "linear-gradient(135deg, #e0f7fa, #b9fbc0)",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <Card
            className="shadow-lg border-0 rounded"
            style={{
              padding: "2rem",
              borderRadius: "20px",
              backgroundColor: "#ffffff",
            }}
          >
            <Card.Body>
              <div className="text-center mb-4">
                {/* Placeholder for user avatar or profile picture */}
                <img
                  src="https://via.placeholder.com/100"
                  alt="User Avatar"
                  className="rounded-circle mb-2"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h1 className="text-primary mb-3">Username</h1>
              </div>
              <UserProfile />
              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="primary"
                  className="d-flex align-items-center"
                  style={{ borderRadius: "50px" }}
                >
                  <FaEdit className="me-2" /> Edit Profile
                </Button>
                <Button
                  variant="danger"
                  className="d-flex align-items-center"
                  style={{ borderRadius: "50px" }}
                >
                  <FaSignOutAlt className="me-2" /> Log Out
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
