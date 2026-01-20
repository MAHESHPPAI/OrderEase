import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, successMessage, user } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((userData) => {
        if (userData.role === 'user') {
          navigate('/');
        } else if (userData.role === 'owner') {
          navigate('/admin');
        } else {
          alert('You do not have access to this application.');
        }
      })
      .catch(() => {});
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
          Login
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {!user && (
          <form onSubmit={handleLogin}>
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
                autoComplete="username"
              />
            </div>
            <div className="mb-3 position-relative">
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
                autoComplete="current-password"
              />
              <span
                className="position-absolute translate-middle-y end-0 me-3 text-muted"
                style={{ cursor: 'pointer', top: 'calc(50% + 15px)' }}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlash color="white" /> : <Eye color="white" />}
              </span>
            </div>

            <div className="mb-3 text-end">
              <Link to="/forgot-password" className="text-decoration-none fw-semibold" style={{ color: 'red' }}>
                Forgot Password?
              </Link>
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
              Login
            </button>
          </form>
        )}

        <div className="mt-3 text-center">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-decoration-none fw-semibold" style={{ color: 'red' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;



