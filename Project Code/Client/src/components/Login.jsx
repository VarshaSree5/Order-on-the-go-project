import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:6001/login', {
        email,
        password
      });

      if (response.data.success) {
        localStorage.setItem('userId', response.data.userId);
        setLoading(false);
        navigate('/profile');
      } else {
        // Use the exact message from backend
        setError(response.data.message || 'Login failed.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);

      // Show server error or network issue
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      <p style={{ marginTop: '1rem' }}>
        Not registered?{' '}
        <span
          onClick={() => setIsLogin(false)}
          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
        >
          Register
        </span>
      </p>
    </form>
  );
};

export default Login;
