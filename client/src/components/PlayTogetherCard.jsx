import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import './PlayTogetherCard.css';

const PlayTogetherCard = ({ childId, childName, stats = {}, fullWidth = false }) => {
    const navigate = useNavigate();
    const { isArabic, t } = useLanguage();

    const {
        gamesPlayedTogether = 0,
        totalTimeSpent = 0,
        familyPoints = 0,
        teamStars = 0,
        lastPlayed = null
    } = stats;

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}${t('m')}`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}${t('h')} ${mins}${t('m')}`;
    };

    const formatLastPlayed = (dateString) => {
        if (!dateString) return t('Start playing together!');
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return t('Played today! 🎉');
        if (diffDays === 2) return t('Played yesterday');
        if (diffDays <= 7) return `${t('Last played')} ${diffDays} ${t('days ago')}`;
        return `${t('Last played')} ${date.toLocaleDateString()}`;
    };

    const handlePlayTogether = () => {
        navigate(`/playtogether/${childId}`);
    };

    
    const getProgressLevel = () => {
        if (gamesPlayedTogether === 0) return { level: t('Beginner'), color: '#95a5a6', percent: 0 };
        if (gamesPlayedTogether < 5) return { level: t('Getting Started'), color: '#3498db', percent: 20 };
        if (gamesPlayedTogether < 10) return { level: t('Active Players'), color: '#2ecc71', percent: 40 };
        if (gamesPlayedTogether < 20) return { level: t('Team Players'), color: '#f39c12', percent: 60 };
        if (gamesPlayedTogether < 50) return { level: t('Super Team'), color: '#e74c3c', percent: 80 };
        return { level: t('Champions'), color: '#9b59b6', percent: 100 };
    };

    const progress = getProgressLevel();

    return (
        <div className={`play-together-card ${fullWidth ? 'full-width' : ''}`}>
            
            <div className="card-header">
                <div className="header-icon">👨‍👩‍👧</div>
                <div className="header-content">
                    <h2>{t('Play Together Mode')}</h2>
                    <p className="card-subtitle">{t('Play and learn together with')} {childName}</p>
                </div>
            </div>

            
            <div className="quick-stats">
                <div className="quick-stat">
                    <span className="stat-emoji">🎮</span>
                    <div className="stat-info">
                        <span className="stat-number">{gamesPlayedTogether}</span>
                        <span className="stat-label">{t('Games Together')}</span>
                    </div>
                </div>
                <div className="quick-stat">
                    <span className="stat-emoji">⏱️</span>
                    <div className="stat-info">
                        <span className="stat-number">{formatTime(totalTimeSpent)}</span>
                        <span className="stat-label">{t('Time Spent')}</span>
                    </div>
                </div>
            </div>

            
            <div className="progress-section">
                <div className="progress-header">
                    <span className="progress-level" style={{ color: progress.color }}>
                        {progress.level}
                    </span>
                    <span className="progress-percent">{progress.percent}%</span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ 
                            width: `${progress.percent}%`,
                            background: `linear-gradient(90deg, ${progress.color}, ${progress.color}dd)`
                        }}
                    />
                </div>
            </div>

            
            <div className="rewards-preview">
                <div className="reward-item">
                    <span className="reward-emoji">⭐</span>
                    <div className="reward-info">
                        <span className="reward-value">{teamStars}</span>
                        <span className="reward-label">{t('Team Stars')}</span>
                    </div>
                </div>
                <div className="reward-item">
                    <span className="reward-emoji">👨‍👩‍👧</span>
                    <div className="reward-info">
                        <span className="reward-value">{familyPoints}</span>
                        <span className="reward-label">{t('Family Points')}</span>
                    </div>
                </div>
            </div>

            
            <div className="play-checklist">
                <div className="checklist-item">
                    <span className="check-icon">✔</span>
                    <span className="check-text">{gamesPlayedTogether} {t('Games completed')}</span>
                </div>
                <div className="checklist-item">
                    <span className="check-icon">⏳</span>
                    <span className="check-text">{formatTime(totalTimeSpent)} {t('Time spent together')}</span>
                </div>
                <div className="checklist-item">
                    <span className="check-icon">🎯</span>
                    <span className="check-text">{formatLastPlayed(lastPlayed)}</span>
                </div>
            </div>

            
            <button className="play-together-btn" onClick={handlePlayTogether}>
                <span className="btn-icon">👨‍👩‍👧</span>
                <span className="btn-text">{t('Play Together')}</span>
                <span className="btn-arrow">→</span>
            </button>

            
            <p className="motivational-text">
                {gamesPlayedTogether === 0 
                    ? t("✨ Start your first adventure together!")
                    : gamesPlayedTogether < 5
                    ? t("🌟 Great start! Keep playing together!")
                    : gamesPlayedTogether < 10
                    ? t("🎉 You're becoming a great team!")
                    : t("🏆 Amazing teamwork! Keep it up!")}
            </p>
        </div>
    );
};

export default PlayTogetherCard;

