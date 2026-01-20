import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/authSlice';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { error, successMessage } = useSelector((state) => state.auth);

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(signupUser({ name, email, password }));
  };

  return (
    <div
      style={{
        backgroundColor: 'black',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
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
        <h2 className="mb-4 text-center fw-bold" style={{ color: 'red' }}>
          Signup
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: 'white' }}>
              Name
            </label>
            <input
              type="text"
              className="form-control border border-2 border-secondary rounded-3 shadow-sm bg-dark text-white"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ color: 'white' }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control border border-2 border-secondary rounded-3 shadow-sm bg-dark text-white"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold" style={{ color: 'white' }}>
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control border border-2 border-secondary rounded-3 shadow-sm pe-5 bg-dark text-white"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="position-absolute translate-middle-y end-0 me-3 text-muted"
              style={{ top: 'calc(50% + 15px)', cursor: 'pointer' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlash color="white" /> : <Eye color="white" />}
            </span>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold shadow"
            style={{
              backgroundColor: 'red',
              borderColor: 'red',
              color: 'white',
            }}
          >
            Signup
          </button>
        </form>

        <div className="mt-3 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: 'red' }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;






