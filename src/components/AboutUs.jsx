import React from 'react';
import { Container } from 'react-bootstrap';

const AboutUs = () => {
  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '4rem 4rem',
        margin: '0rem 0rem',
      }}
    >
      <h2 className="text-center text-danger mb-4 display-6 fw-bold">About Us</h2>
      <Container>
        <p className="text-center mb-2" style={{ fontSize: '1.5rem' }}>
          We are a restaurant that serves delicious and authentic food in a warm atmosphere.
        </p>
        <p className="text-center mb-2" style={{ fontSize: '1.5rem' }}>
          Our menu features a variety of dishes—from classic appetizers to creative desserts.
        </p>
        <p className="text-center mb-2" style={{ fontSize: '1.5rem' }}>
          We are committed to giving you the best dining experience with attentive staff.
        </p>
        <p className="text-center mb-2" style={{ fontSize: '1.5rem' }}>
          Our chefs take pride in preparing each dish with care and attention to detail.
        </p>
        <p className="text-center mb-0" style={{ fontSize: '1.5rem' }}>
          Come experience our food, service, and cozy vibe. Whether it’s a casual outing or a special occasion, we aim to make every visit memorable.
        </p>
      </Container>
    </div>
  );
};

export default AboutUs;

