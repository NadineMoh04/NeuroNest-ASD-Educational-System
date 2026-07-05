import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', formData);
      console.log('Admin login successful:', response.data);
      
      
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button
          className="btn btn-back"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>

        <div className="login-content">
          <h1 className="login-title">Admin Portal 🔐</h1>
          <p className="login-subtitle">Secure administrator access</p>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter admin email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-login-submit" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login as Admin'}
            </button>
          </form>

          <div className="login-footer">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Parent/Teacher Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;