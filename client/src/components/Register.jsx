import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { parentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    kidname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state?.authorized) {
      
      
      navigate('/test');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError(isArabic ? 'كلمتا المرور غير متطابقتين!' : 'Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError(isArabic ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      
      
      const registrationData = {
        ...registerData,
        kidname: formData.kidname
      };
      
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      
      navigate('/child-info');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || (isArabic ? 'فشل التسجيل. يرجى المحاولة مرة أخرى.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <button
          className="btn btn-back"
          onClick={() => navigate('/')}
        >
          {t.backToHome}
        </button>

        <div className="register-content">
          <h1 className="register-title">{t.joinCommunity}</h1>
          <p className="register-subtitle">{t.registerSubtitle}</p>

          <form className="register-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">{t.fullName}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t.fullNamePlaceholder}
                disabled={loading}
              />
            </div>

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
                placeholder={t.createPasswordPlaceholder}
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t.confirmPasswordLabel}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder={t.confirmPasswordPlaceholder}
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="kidname">{t.childName}</label>
              <input
                type="text"
                id="kidname"
                name="kidname"
                value={formData.kidname}
                onChange={handleChange}
                required
                placeholder={t.childNamePlaceholder}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-register-submit" disabled={loading}>
              {loading ? t.registeringButton : t.registerButton}
            </button>
          </form>
          <div className="register-footer">
            <p>{t.alreadyHaveAccount}</p>
            <button
              className="btn btn-login-link"
              onClick={() => navigate('/login')}
            >
              {t.loginHere}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

