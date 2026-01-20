import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset link sent! Check your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ backgroundColor: 'black', minHeight: '100vh', padding: '20px' }}
    >
      <div
        className="card p-4 shadow-lg border border-3"
        style={{
          maxWidth: '500px',
          width: '100%',
          backgroundColor: 'black',
          borderColor: 'red',
          color: 'white',
        }}
      >
        <h2 className="mb-4 text-center fw-bold" style={{ color: 'red' }}>Forgot Password</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: 'white' }}>Email address</label>
            <input
              type="email"
              className="form-control border border-2 border-secondary rounded-3 shadow-sm bg-dark text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold shadow mb-3"
            style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}
          >
            Send Reset Link
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="btn w-100 fw-bold shadow"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid red',
                color: 'red',
              }}
            >
              Back to Login Page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

