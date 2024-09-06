import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#282c34",
        color: "#fff",
        padding: "2rem 0",
        position: "inherit",
        bottom: 0,
        width: "100%",
        boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.2)",
        marginTop: '100px',
      }}
    >
      <Container>
        <Row className="text-center">
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              DevDose is your go-to source for the latest in tech news and
              developer trends.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" style={{ color: "#fff" }}>
                  Home
                </a>
              </li>
              <li>
                <a href="/about" style={{ color: "#fff" }}>
                  About
                </a>
              </li>
              <li>
                <a href="/contact" style={{ color: "#fff" }}>
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" style={{ color: "#fff" }}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center">
              <Button
                variant="link"
                href="https://facebook.com"
                target="_blank"
                style={{ color: "#fff", fontSize: "1.5rem" }}
              >
                <FaFacebookF />
              </Button>
              <Button
                variant="link"
                href="https://twitter.com"
                target="_blank"
                style={{ color: "#fff", fontSize: "1.5rem", margin: "0 10px" }}
              >
                <FaTwitter />
              </Button>
              <Button
                variant="link"
                href="https://linkedin.com"
                target="_blank"
                style={{ color: "#fff", fontSize: "1.5rem" }}
              >
                <FaLinkedinIn />
              </Button>
              <Button
                variant="link"
                href="https://github.com"
                target="_blank"
                style={{
                  color: "#fff",
                  fontSize: "1.5rem",
                  marginLeft: "10px",
                }}
              >
                <FaGithub />
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="text-center mt-3">
          <Col>
            <p>
              &copy; {new Date().getFullYear()} DevDose. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
