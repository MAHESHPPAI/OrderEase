import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByUser , selectUserOrdersMemoized } from "../redux/orderSlice";
import { Table, Container, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PlacedOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading, error } = useSelector((state) => state.orders || { loading: false, error: null });
  const userOrders = useSelector(selectUserOrdersMemoized);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrdersByUser (user.uid || user.id));
    }
  }, [dispatch, user]);

  const getOrderDate = (createdAt) => {
    if (typeof createdAt !== "string") return null;
    const date = new Date(createdAt);
    return isNaN(date.getTime()) ? null : date;
  };

  if (!user) {
    return <p className="text-danger text-center mt-4">Please login to view your orders.</p>;
  }

  const sortedOrders = [...userOrders].sort((a, b) => {
    const dateA = getOrderDate(a.createdAt);
    const dateB = getOrderDate(b.createdAt);
    return dateB - dateA;
  });

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-4 py-3"
        style={{ backgroundColor: "black", borderBottom: "2px solid red" }}
      >
        <Container fluid>
          <Navbar.Brand className="fw-bold text-danger fs-2">OrderEase</Navbar.Brand>
          <div className="ms-auto">
            <Button
              variant="outline-danger"
              className="fw-semibold"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Orders Section */}
      <Container className="mt-5">
        <h2 className="text-center text-danger mb-4">Order Summary</h2>

        {loading && <p className="text-white text-center">Loading orders...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && sortedOrders.length === 0 && (
          <p className="text-white text-center">No orders found.</p>
        )}

        {sortedOrders.map((order) => {
          const orderedAt = getOrderDate(order.createdAt);
          const preparationTime = Math.floor(Math.random() * (15 - 10 + 1)) + 10;

          return (
            <div
              key={order.id}
              style={{
                backgroundColor: "black", // Match the background color
                border: "2px solid white", // White border
                borderRadius: "8px", // Optional: rounded corners
                padding: "20px", // Padding inside the box
                marginBottom: "20px", // Space between boxes
              }}
            >
              <Table
                striped
                bordered
                hover
                responsive
                variant="dark"
                className="mb-0" // Remove bottom margin from table
              >
                <thead>
                  <tr>
                    <th className="text-danger fw-bold">Item</th>
                    <th className="text-danger fw-bold">Quantity</th>
                    <th className="text-danger fw-bold">Total Price</th>
                    <th className="text-danger fw-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items &&
                    order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-white">{item.name}</td>
                        <td className="text-white">{item.quantity}</td>
                        <td className="text-white">₹{item.quantity * item.price}</td>
                        <td className="text-white">{order.status || "Pending"}</td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan="4" className="text-start">
                      <strong className="text-danger">Order ID:</strong> <span className="text-white">{order.id}</span> <br />
                      <strong className="text-danger">Table Number:</strong> <span className="text-white">{order.tableNumber}</span> <br />
                      <strong className="text-danger">Ordered At:</strong>{" "}
                      <span className="text-white">
                        {orderedAt
                          ? orderedAt.toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "medium",
                            })
                          : "Unknown"}
                      </span>{" "}
                      <br />
                      <strong className="text-danger">Estimated Preparation Time:</strong> <span className="text-white">{preparationTime} minutes</span> <br />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}

        
      </Container>

{/* Footer */}
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

export default PlacedOrders;






