import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import './AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  return (
    <div className="about-us">
      <div className="about-container">
        <button 
          className="btn btn-back"
          onClick={() => navigate('/')}
        >
          {t.backToHome}
        </button>

        <div className="about-content"> 
          <h1 className="about-title">{t.aboutTitle}</h1>

          <div className="about-section">
            <h2>{t.missionTitle}</h2>
            <p>{t.missionText}</p>
          </div>

          <div className="about-section">
            <h2>{t.offerTitle}</h2>
            <ul>
              <li>{t.offer1}</li>
              <li>{t.offer2}</li>
              <li>{t.offer3}</li>
              <li>{t.offer4}</li>
            </ul>
          </div>

          <div className="about-section">
            <h2>{t.valuesTitle}</h2>
            <p>{t.valuesText}</p>
          </div>

          <div className="about-section">
            <h2>{t.communityTitle}</h2>
            <p>{t.communityText}</p>
          </div>

          <div className="about-content-footer" style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/test')}
            >
              {t.getStarted}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

