import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser  } from '../redux/authSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    // Show confirmation prompt
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logoutUser ());
    }
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <Navbar 
        expand="lg" 
        style={{ 
          background: 'black', 
          backdropFilter: 'blur(10px)', 
          height: '80px', 
          zIndex: 1000 
        }} 
        className="navbar-light border-bottom"
      >
        <Container>
          <Navbar.Brand className="fw-bold text-danger fs-2">OrderEase</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/waiters" className="text-danger fw-semibold me-3">Waiters</Nav.Link>
                  <Nav.Link as={Link} to="/orders" className="text-danger fw-semibold me-3">Orders</Nav.Link>
                  <Nav.Link as={Link} to="/menu" className="text-danger fw-semibold me-3">Menu</Nav.Link>
                  <Button variant="outline-danger" className="ms-3 fw-semibold" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup" className="text-danger fw-semibold me-3">Sign Up</Nav.Link>
                  <Nav.Link as={Link} to="/login" className="text-danger fw-semibold me-3">Login</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Centered and enlarged welcome text */}
      <div 
        className="d-flex justify-content-center align-items-center text-center"
        style={{ height: 'calc(100vh - 80px)' }} // Adjust height to fill space below navbar
      >
        <h1
  className="fw-bold display-4 px-3"
  style={{
    color: '#ff0000',
    textShadow: `
      1px 1px 0 #000, 
      2px 2px 0 #000, 
      3px 3px 0 #000,
      4px 4px 5px rgba(0, 0, 0, 0.6)
    `,
    fontFamily: 'Arial Black, Gadget, sans-serif',
    letterSpacing: '1px'
  }}
>
  Welcome to Admin Dashboard of OrderEase Restaurant Management Web Application
</h1>

      </div>

      {/* Footer Navbar */}
      <Navbar 
        expand="lg" 
        style={{ 
          background: 'black', 
          height: '80px', 
          zIndex: 1000 
        }} 
        className="navbar-light border-top"
      >
        <Container>
          {/* No text or links in the footer */}
        </Container>
      </Navbar>
    </div>
  );
};

export default AdminDashboard;



