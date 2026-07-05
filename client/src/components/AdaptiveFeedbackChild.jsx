import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import './AdaptiveFeedbackChild.css';





const AdaptiveFeedback = ({ 
  feedback, 
  feedbackType, 
  showFeedback, 
  difficulty, 
  stats 
}) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  if (!showFeedback) return null;

  const getFeedbackClass = () => {
    switch (feedbackType) {
      case 'success':
        return 'feedback-success';
      case 'encouragement':
        return 'feedback-encouragement';
      case 'difficulty-change':
        return 'feedback-difficulty-change';
      default:
        return 'feedback-default';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return '#667eea';
    }
  };

  return (
    <div className="adaptive-feedback-container">
      
      <div className="difficulty-indicator">
        <span className="difficulty-label">{t['Difficulty'] || 'Difficulty'}:</span>
        <span 
          className="difficulty-badge" 
          style={{ backgroundColor: getDifficultyColor() }}
        >
          {t[difficulty] || difficulty}
        </span>
      </div>

      
      {showFeedback && (
        <div className={`feedback-message ${getFeedbackClass()}`}>
          <span className="feedback-text">{t[feedback] || feedback}</span>
        </div>
      )}

      
      {stats && (
        <div className="performance-stats">
          <span className="stat">✓ {stats.consecutiveCorrect} {t['correct'] || 'correct'}</span>
          <span className="stat">✗ {stats.consecutiveIncorrect} {t['incorrect'] || 'incorrect'}</span>
          <span className="stat">📊 {stats.achieved}% {t['achieved'] || 'achieved'}</span>
        </div>
      )}
    </div>
  );
};

export default AdaptiveFeedback;
