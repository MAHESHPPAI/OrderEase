import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';
import { db } from '../firebaseConfig'; // Import your Firestore configuration
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { useSelector } from 'react-redux'; // Import useSelector for accessing Redux state
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { FaEdit } from 'react-icons/fa'; // Import edit icon from react-icons

const WaiterManagement = () => {
  const [waiter, setWaiter] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    salary: '',
    experience: '',
    joinedDate: '',
  });

  const [waiters, setWaiters] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State to track if editing
  const [currentWaiterId, setCurrentWaiterId] = useState(null); // State to track the current waiter being edited
  const user = useSelector((state) => state.auth.user); // Get the user from Redux store
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Check if the user is logged in and has the role of 'owner'
  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login'); // Redirect to login if not authorized
    }
  }, [user, navigate]);

  // Fetch waiters from Firestore when the component mounts
  useEffect(() => {
    const fetchWaiters = async () => {
      const waitersCollection = collection(db, 'waiters');
      const waitersSnapshot = await getDocs(waitersCollection);
      const waitersList = waitersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWaiters(waitersList);
    };

    fetchWaiters();
  }, []);

  const handleChange = (e) => {
    setWaiter({ ...waiter, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Add the new waiter to Firestore
      const docRef = await addDoc(collection(db, 'waiters'), {
        ...waiter,
        createdAt: new Date(), // Add createdAt timestamp
      });

      // Update local state with the new waiter
      setWaiters([...waiters, { id: docRef.id, ...waiter }]);
      // Reset the form
      setWaiter({
        name: '',
        email: '',
        phoneNumber: '',
        salary: '',
        experience: '',
        joinedDate: '',
      });
    } catch (error) {
      console.error("Error adding waiter: ", error);
    }
  };

  const handleEdit = (waiter) => {
    setWaiter(waiter); // Set the current waiter details to the form
    setIsEditing(true); // Set editing state to true
    setCurrentWaiterId(waiter.id); // Set the current waiter ID
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Update the waiter in Firestore
      const waiterRef = doc(db, 'waiters', currentWaiterId);
      await updateDoc(waiterRef, {
        ...waiter,
      });

      // Update local state
      setWaiters(waiters.map(w => (w.id === currentWaiterId ? { ...w, ...waiter } : w)));
      // Reset the form and editing state
      setWaiter({
        name: '',
        email: '',
        phoneNumber: '',
        salary: '',
        experience: '',
        joinedDate: '',
      });
      setIsEditing(false);
      setCurrentWaiterId(null);
    } catch (error) {
      console.error("Error updating waiter: ", error);
    }
  };

  const handleDelete = async (id) => {
    // Show confirmation prompt
    const confirmDelete = window.confirm("Are you sure you want to delete this waiter?");
    if (confirmDelete) {
      try {
        // Delete the waiter from Firestore
        await deleteDoc(doc(db, 'waiters', id));
        // Update local state to remove the deleted waiter
        setWaiters(waiters.filter((w) => w.id !== id));
      } catch (error) {
        console.error("Error deleting waiter: ", error);
      }
    }
  };

  return (
    <>
      <AdminNavbar />
      <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
        <Container>
          <Row className="gx-4 gy-4">
            {/* Form Card */}
            <Col xs={12} md={6} lg={4}>
              <Card
                style={{
                  width: '100%',
                  border: '2px solid white',
                  borderRadius: '12px',
                  
                }}
                className="p-4 bg-dark text-white"
              >
                <Card.Title className="text-danger text-center">{isEditing ? 'Edit Waiter' : 'Add New Waiter'}</Card.Title>
                <Form onSubmit={isEditing ? handleSave : handleCreate}>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={waiter.name} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={waiter.email} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phoneNumber" value={waiter.phoneNumber} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control type="number" name="salary" value={waiter.salary} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Experience</Form.Label>
                    <Form.Control type="text" name="experience" value={waiter.experience} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Joined Date</Form.Label>
                    <Form.Control type="date" name="joinedDate" value={waiter.joinedDate} onChange={handleChange} required />
                  </Form.Group>

                  <Button type="submit" variant="danger" className="w-100">{isEditing ? 'Save' : 'Create'}</Button>
                  {isEditing && (
                    <Button variant="secondary" className="w-100 mt-2" onClick={() => { setIsEditing(false); setCurrentWaiterId(null); setWaiter({ name: '', email: '', phoneNumber: '', salary: '', experience: '', joinedDate: '' }); }}>Cancel</Button>
                  )}
                </Form>
              </Card>
            </Col>

            {/* Waiter Cards */}
            {waiters.map((w) => (
              <Col key={w.id} xs={12} md={6} lg={4}>
                <Card
                  style={{
                    width: '100%',
                    height: '100%', // Set height to 100% to match the form card
                    border: '2px solid white',
                    borderRadius: '12px',
                  }}
                  className="p-4 bg-dark text-white"
                >
                  <Card.Title className="text-warning">{w.name}</Card.Title>
                  <Card.Text><strong>Email:</strong> {w.email}</Card.Text>
                  <Card.Text><strong>Phone:</strong> {w.phoneNumber}</Card.Text>
                  <Card.Text><strong>Salary:</strong> ₹{w.salary}</Card.Text>
                  <Card.Text><strong>Experience:</strong> {w.experience}</Card.Text>
                  <Card.Text><strong>Joined Date:</strong> {new Date(w.joinedDate).toLocaleDateString()}</Card.Text>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button
    variant="outline-danger"
    onClick={() => handleDelete(w.id)}
    style={{ flex: 1 }}
  >
    Delete Waiter
  </Button>
  <Button
    variant="outline-warning"
    onClick={() => handleEdit(w)}
    style={{ flex: 1 }}
  >
    <FaEdit /> Edit
  </Button>
</div>

                </Card>
              </Col>
            ))}
          </Row>
        </Container>
    
        
      </div>
      
    </>
  );
};

export default WaiterManagement;




