import React, { useRef, useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button, Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser  } from '../redux/authSlice';
import { fetchFoodItems } from '../redux/foodSlice'; 
import { placeOrder } from '../redux/orderSlice';
import { Link } from 'react-router-dom';
import pic1 from '../images/pic1.jpg';
import pic2 from '../images/pic2.jpg';
import pic3 from '../images/pic3.jpg';
import menu1 from '../images/ButterChicken.webp';
import menu2 from '../images/paneer-tikka.jpg';
import menu3 from '../images/Chicken-Biryani.jpg';
import menu4 from '../images/Masala-Dosa.avif';
import menu5 from '../images/Veg-pulao.jpg';
import menu6 from '../images/Chocolate-Donut.jpg';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';

const foodImages = {
  "Butter Chicken": menu1,
  "Paneer Tikka": menu2,
  "Chicken Biryani": menu3,
  "Masala Dosa": menu4,
  "Veg Pulao": menu5,
  "Chocolate Donut": menu6,
};

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user state from Redux
  const { items, loading, error } = useSelector((state) => state.food); // Get food items from Redux
  const [orderDetails, setOrderDetails] = useState({});
  


  useEffect(() => {
    dispatch(fetchFoodItems()); // Fetch food items on component mount
  }, [dispatch]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      dispatch(logoutUser ());
    }
  };

  const aboutUsRef = useRef(null);
  const foodMenuRef = useRef(null);

  const scrollToAboutUs = () => {
    if (aboutUsRef.current) {
      aboutUsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFoodMenu = () => {
    if (foodMenuRef.current) {
      foodMenuRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

const handleQuantityChange = (itemId, delta) => {
  setOrderDetails(prev => ({
    ...prev,
    [itemId]: {
      ...prev[itemId],
      quantity: Math.max(1, (prev[itemId]?.quantity || 1) + delta), // Ensure quantity is at least 1
      tableNumber: prev[itemId]?.tableNumber || '', // Keep tableNumber defined
    },
  }));
};

const handleTableNumberChange = (itemId, value) => {
  setOrderDetails(prev => ({
    ...prev,
    [itemId]: {
      ...prev[itemId],
      tableNumber: value || '', // Ensure tableNumber is always a string
    },
  }));
};

const handlePlaceOrder = (item) => {
  const details = orderDetails[item.id] || {};
  const quantity = details.quantity || 1;
  const tableNumber = details.tableNumber;

  if (!user || !tableNumber) {
    alert('Please select a table number.');
    return;
  }

  const confirmMsg = `Are you sure you want to place the order?\n\nItem: ${item.name}\nQuantity: ${quantity}\nTable Number: ${tableNumber}`;
  const confirmed = window.confirm(confirmMsg);
  if (!confirmed) return;

  const orderItems = [{
    foodId: item.id,
    name: item.name,
    quantity,
    price: item.price,
  }];

  dispatch(placeOrder({
    userId: user.uid || user.id,
    userName: user.name || user.displayName || "Unknown",
    tableNumber,
    items: orderItems,
  }))
  .unwrap()
  .then(() => {
    alert('Order placed successfully!');
    setOrderDetails(prev => ({ ...prev, [item.id]: { quantity: 1, tableNumber: '' } }));
  })
  .catch((err) => {
    alert('Failed to place order: ' + err);
  });
};




  

  return (
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
              {!user ? (
                <>
                 <Nav.Link as={Link} to="/signup" className="text-danger fw-semibold me-3">Sign Up</Nav.Link>
<Nav.Link as={Link} to="/login" className="text-danger fw-semibold me-3">Login</Nav.Link>
                  <Nav.Link className="text-danger fw-semibold me-3" onClick={scrollToAboutUs}>About Us</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link className="text-danger fw-semibold me-3" onClick={scrollToFoodMenu}>Order</Nav.Link>
                  <NavDropdown 
                    title={<span className="text-danger fw-semibold">My Profile</span>} 
                    id="profile-dropdown" 
                    style={{ zIndex: 1050 }}
                  >
                    <NavDropdown.Item as={Link} to="/profile" className="text-danger">My Orders</NavDropdown.Item>
    
                  </NavDropdown>
                  <Nav.Link className="text-danger fw-semibold me-3" onClick={scrollToAboutUs}>About Us</Nav.Link>
                  <Button variant="outline-danger" className="ms-3 fw-semibold" onClick={handleLogout}>Logout</Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Carousel interval={3000} pause={false} fade controls={false}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={pic1}
            alt="First slide"
            style={{ height: 'calc(100vh - 80px)', objectFit: 'cover', marginTop: '-1px' }}
          />
          <Carousel.Caption
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              bottom: 'unset',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '1.5rem',
              borderRadius: '12px',
            }}
          >
            <h1 className="display-4 fw-bold text-light">Delicious Food Delivered Fast</h1>
            <p className="lead text-light">Experience quick and tasty meals with OrderEase.</p>
            <Button variant="danger" size="lg" className="mt-3" onClick={scrollToFoodMenu}>Order Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={pic2}
            alt="Second slide"
            style={{ height: 'calc(100vh - 80px)', objectFit: 'cover', marginTop: '-1px' }}
          />
          <Carousel.Caption
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              bottom: 'unset',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.13)',
              padding: '1.5rem',
              borderRadius: '12px',
            }}
          >
            <h1 className="display-4 fw-bold text-light">Your Favourite Dishes, Anytime</h1>
            <p className="lead text-light">Craving something special? We've got it covered.</p>
            <Button variant="danger" size="lg" className="mt-3" onClick={scrollToFoodMenu}>Order Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={pic3}
            alt="Third slide"
            style={{ height: 'calc(100vh - 80px)', objectFit: 'cover', marginTop: '-1px' }}
          />
          <Carousel.Caption
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              bottom: 'unset',
              textAlign: 'center',
              padding: '1.5rem',
              borderRadius: '12px',
            }}
          >
            <h1 className="display-4 fw-bold text-light">Fast. Fresh. Fabulous.</h1>
            <p className="lead text-light">Join thousands who love OrderEase every day.</p>
            <Button variant="danger" size="lg" className="mt-3" onClick={scrollToFoodMenu}>Order Now</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

     <div style={{ backgroundColor: 'black', padding: '4rem 2rem' }} ref={foodMenuRef}>
  <h2 className="text-center text-danger mb-5 display-5 fw-bold">Food Menu</h2>
  <Container>
    {!user ? (
      <div className="alert alert-warning text-center">
        <h5 className="text-danger">To order please Login or SignUp</h5>
        <div className="mt-3">
          <a href="/login" className="btn btn-danger me-2">Login</a>
          <a href="/register" className="btn btn-danger">Sign Up</a>
        </div>
      </div>
    ) : (
      <>
        {loading && <p className="text-white text-center">Loading food items...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

  <div className="row justify-content-center g-4">
  {items.filter(item => item.isAvailable).map((item) => {
    const details = orderDetails[item.id] || { quantity: 1, tableNumber: '' }; // Default values

    return (
      <div className="col-md-4 d-flex justify-content-center" key={item.id}>
        <div className="card text-white bg-dark" style={{ width: '18rem' }}>
          <img 
            src={foodImages[item.name] || ''} 
            className="card-img-top" 
            alt={item.name} 
            style={{ height: '140px' }}
          />
          <div className="card-body text-center">
            <h5 className="card-title">{item.name} – ₹{item.price}</h5>
            <p className="card-text">{item.description}</p>
            <div className="d-flex justify-content-center align-items-center mb-2">
              <button 
                className="btn btn-light me-2" 
                onClick={() => handleQuantityChange(item.id, -1)}
              >
                -
              </button>
              <span className="text-white">{details.quantity}</span>
              <button 
                className="btn btn-light ms-2" 
                onClick={() => handleQuantityChange(item.id, 1)}
              >
                +
              </button>
            </div>
            <input 
              type="number" 
              value={details.tableNumber || ''} 
              onChange={(e) => handleTableNumberChange(item.id, e.target.value)} 
              className="form-control mb-2" 
              placeholder="Table Number" 
            />
            <button 
              className="btn btn-danger text-white mt-1"
              onClick={() => handlePlaceOrder(item)}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>




      </>
    )}
  </Container>
</div>



<div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
       backgroundColor:'black'
    }}>
      <div style={{ flex: "1" }}  ref={aboutUsRef}>
        <AboutUs />
      </div>
      <ContactUs />
    </div>
    </>
  );
}

export default Home;



