import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const ContactUs = () => {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "2rem 1rem", // reduced padding
        margin: "0.1rem 0rem", // reduced margin
      }}
    >
      <Container>
        <Row className="text-center mb-4">
          <Col>
            <h2 className="text-danger display-6 fw-bold">Contact Us</h2>
          </Col>
        </Row>
        <Row className="text-center">
          <Col md={4} className="mb-3">
            <strong>Contact Us</strong>
          </Col>
          <Col md={4} className="mb-3">
            <p className="mb-1">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:order.ease.app@gmail.com"
                className="text-danger text-decoration-none"
              >
                order.ease.app@gmail.com
              </a>
            </p>
            <p className="mb-0">
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
          </Col>
          <Col md={4}>
            <p className="mb-1">
              <strong>Visit Us:</strong>
            </p>
            <p className="mb-0">123 Restaurant Street, Cityville, State, 12345</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
