import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  Table,
  Container,
  Navbar,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { db } from "../firebaseConfig";
import AdminNavbar from "./AdminNavbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderManagement = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [waiters, setWaiters] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState("");
  const [assigned, setAssigned] = useState({}); // Tracks assigned orders

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "owner") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const orderSnapshot = await getDocs(ordersCollection);
        const ordersList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = ordersList.filter(
          (order) => order.status === "placed"
        );
        setPendingOrders(filtered);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "owner") {
      fetchAllOrders();
    }
  }, [user]);

  const fetchWaiters = async () => {
    try {
      const waiterSnapshot = await getDocs(collection(db, "waiters"));
      const waiterList = waiterSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWaiters(waiterList);
    } catch (error) {
      console.error("Error fetching waiters: ", error);
    }
  };

  const getOrderDate = (createdAt) => {
    if (typeof createdAt !== "string") return null;
    const date = new Date(createdAt);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleAssignWaiter = async () => {
    try {
      const waiter = waiters.find(w => w.id === selectedWaiter);
      const waiterRef = doc(db, "waiters", selectedWaiter);

      await updateDoc(waiterRef, {
        assignedOrders: arrayUnion(doc(db, "orders", selectedOrderId)),
      });

      setAssigned((prev) => ({
        ...prev,
        [selectedOrderId]: {
          id: selectedWaiter,
          name: waiter?.name || "Unknown",
        },
      }));

      setShowModal(false);
      setSelectedWaiter("");
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error assigning waiter:", error);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "delivered", // Change status to "delivered"
      });
      alert(`Order ${orderId} has been marked as delivered.`);
      // Re-fetch orders to update the UI
      fetchAllOrders();
    } catch (error) {
      console.error("Error delivering order:", error);
    }
  };

  const openAssignModal = async (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
    await fetchWaiters();
  };

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
      <AdminNavbar />
      <Container className="mt-5">
        <h2 className="text-center text-danger mb-1" style={{ marginBottom: "20px" }}>
          Pending Orders
        </h2>

        {loading && <p className="text-white text-center">Loading pending orders...</p>}
        {!loading && pendingOrders.length === 0 && (
          <p className="text-white text-center">No pending orders found.</p>
        )}

        {pendingOrders.map((order) => {
          const orderedAt = getOrderDate(order.createdAt);
          return (
            <div
              key={order.id}
              style={{
                backgroundColor: "black",
                border: "2px solid white",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <Table striped bordered hover responsive variant="dark" className="mb-0">
                <thead>
                  <tr>
                    <th className="text-danger fw-bold">Item</th>
                    <th className="text-danger fw-bold">Quantity</th>
                    <th className="text-danger fw-bold">Total Price</th>
                    <th className="text-danger fw-bold">Status</th>
                    <th className="text-danger fw-bold">Assigned Waiter</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items &&
                    order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-white">{item.name}</td>
                        <td className="text-white">{item.quantity}</td>
                        <td className="text-white">₹{item.quantity * item.price}</td>
                        <td className="text-white">{order.status}</td>
                        <td className="text-white">
                          {assigned[order.id]?.name || "Not Assigned"}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan="4" className="text-start">
                      <strong className="text-danger">Order ID:</strong>{" "}
                      <span className="text-white">{order.id}</span> <br />
                      <strong className="text-danger">User  ID:</strong>{" "}
                      <span className="text-white">{order.userId || "N/A"}</span> <br />
                      <strong className="text-danger">Table Number:</strong>{" "}
                      <span className="text-white">{order.tableNumber}</span> <br />
                      <strong className="text-danger">Ordered At:</strong>{" "}
                      <span className="text-white">
                        {orderedAt
                          ? orderedAt.toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "medium",
                            })
                          : "Unknown"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-center">
                      <Button
                        variant="outline-warning"
                        onClick={() => openAssignModal(order.id)}
                        disabled={!!assigned[order.id]}
                      >
                        {assigned[order.id] ? "Waiter Assigned" : "Assign Waiter"}
                      </Button>
                    </td>
                    <td colSpan="2" className="text-center">
                      <Button
                        variant="success"
                        onClick={() => handleDeliverOrder(order.id)}
                        disabled={!assigned[order.id] || order.status === "delivered"}
                      >
                        Deliver Order
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select a Waiter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Select
            value={selectedWaiter}
            onChange={(e) => setSelectedWaiter(e.target.value)}
          >
            <option value="">-- Select Waiter --</option>
            {waiters.map((waiter) => (
              <option key={waiter.id} value={waiter.id}>
                {waiter.name}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleAssignWaiter}
            disabled={!selectedWaiter}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar
        expand="lg"
        className="px-4 py-3 mt-5"
        style={{ backgroundColor: "black", borderTop: "2px solid red" }}
      >
        <Container fluid></Container>
      </Navbar>
    </div>
  );
};

export default OrderManagement;

