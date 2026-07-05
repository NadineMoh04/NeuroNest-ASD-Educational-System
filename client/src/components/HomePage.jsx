import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { isArabic, toggleLanguage } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  return (
    <div className="homepage">
      <nav className="homepage-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="logo-mark">NEST</div>
          <div className="logo-text neuronest-text">
            <span className="letter letter-n1">N</span>
            <span className="letter letter-e1">E</span>
            <span className="letter letter-u">U</span>
            <span className="letter letter-r">R</span>
            <span className="letter letter-o1">O</span>
            <span className="letter letter-n2">N</span>
            <span className="letter letter-e2">E</span>
            <span className="letter letter-s">S</span>
            <span className="letter letter-t">T</span>
          </div>
        </div>
        <div className="nav-actions">
          
          <div
            className="lang-segmented-toggle"
            onClick={toggleLanguage}
            title={isArabic ? "Switch to English" : "تغيير للغة العربية"}
          >
            <div className={`slider-pill ${isArabic ? 'arabic' : ''}`}></div>
            <span className={`toggle-tab en ${!isArabic ? 'active' : ''}`}>EN</span>
            <span className={`toggle-tab ar ${isArabic ? 'active' : ''}`}>AR</span>
          </div>

          <button className="nav-link" onClick={() => navigate('/')}>
            {t.home}
          </button>
          <button className="nav-link" onClick={() => navigate('/test')}>
            {t.test}
          </button>
          <button className="nav-link" onClick={() => navigate('/about')}>
            {t.about}
          </button>
          <button className="btn btn-login nav-login" onClick={() => navigate('/login')}>
            {t.login}
          </button>
        </div>
      </nav>

      <main className="homepage-main">
        <div className="hero-section">
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-subtitle">{t.heroSubtitle}</p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/test')}
            >
              {t.getStarted}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/about')}
            >
              {t.learnMore}
            </button>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">{t.qualityContent}</h3>
            <p className="feature-description">{t.qualityContentDesc}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">{t.trackProgress}</h3>
            <p className="feature-description">{t.trackProgressDesc}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">{t.achieveGoals}</h3>
            <p className="feature-description">{t.achieveGoalsDesc}</p>
          </div>
        </div>

        <div className="cta-section">
          <h2 className="cta-title">{t.readyToBegin}</h2>
          <p className="cta-text">{t.ctaText}</p>
          <button
            className="btn btn-cta"
            onClick={() => navigate('/test')}
          >
            {t.startAssessment}
          </button>
        </div>
      </main>

      <footer className="homepage-footer">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
};

export default HomePage;

