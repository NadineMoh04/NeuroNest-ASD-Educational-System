import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('parent');

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

      if (formData.email === 'admin@neuronest.com' || formData.email.endsWith('@admin.neuronest.com')) {

        const response = await axios.post('http://localhost:5000/api/admin/login', formData);
        console.log('Admin login successful:', response.data);


        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));


        navigate('/admin/dashboard');
      } else {

        const response = await parentAPI.login(formData);
        console.log('Login successful:', response);
        navigate('/parentdashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
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
          {t.backToHome}
        </button>

        <div className="login-content">
          <h1 className="login-title">{t.welcomeBack}</h1>
          <p className="login-subtitle">{t.loginSubtitle}</p>


          <div className="user-type-indicator">
            {formData.email === 'admin@neuronest.com' || formData.email.endsWith('@admin.neuronest.com') ? (
              <span className="admin-badge">{t.adminBadge}</span>
            ) : (
              <span className="user-badge">{t.userBadge}</span>
            )}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">{t.emailAddress}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t.emailPlaceholder}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.passwordLabel}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t.passwordPlaceholder}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-login-submit" disabled={loading}>
              {loading ? t.loggingInButton : t.loginButton}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;

