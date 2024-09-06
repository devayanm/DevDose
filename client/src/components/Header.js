import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Navbar 
      bg="dark" 
      variant="dark" 
      expand="lg" 
      sticky="top" 
      style={{ 
        padding: "0.5rem 1rem", 
        borderBottom: "2px solid #007bff" 
      }}
    >
      <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        DevDose
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/" style={{ margin: "0 1rem", fontSize: "1.1rem" }}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/search" style={{ margin: "0 1rem", fontSize: "1.1rem" }}>
            Search
          </Nav.Link>
          {user ? (
            <>
              <Nav.Link as={Link} to="/profile" style={{ margin: "0 1rem", fontSize: "1.1rem" }}>
                Profile
              </Nav.Link>
              <NavDropdown 
                title="Account" 
                id="basic-nav-dropdown" 
                align="end" 
                style={{ margin: "0 1rem", fontSize: "1.1rem" }}
              >
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" style={{ margin: "0 1rem", fontSize: "1.1rem" }}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" style={{ margin: "0 1rem", fontSize: "1.1rem" }}>
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
