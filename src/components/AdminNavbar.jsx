import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';




function AdminNavbar(){
      const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

   const handleLogout = () => {
    // Show confirmation prompt
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logoutUser ());
    }
  };

    return(
    <>
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
    </>
    )
}
export default AdminNavbar