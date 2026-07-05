import React, { useState, useEffect } from 'react';
import { parentAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import PlayTogetherCard from './PlayTogetherCard';
import './ParentDashboard.css';

const ParentDashboard = () => {
    const [parent, setParent] = useState(null);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isArabic, t } = useLanguage();

    useEffect(() => {
        
        const token = localStorage.getItem('token');
        const parent = JSON.parse(localStorage.getItem('parent'));

        if (!token || !parent) {
            navigate('/login');
            return;
        }

        const fetchParentData = async () => {
            try {
                const profileResponse = await parentAPI.getProfile();
                setParent(profileResponse.parent);

                const childrenResponse = await parentAPI.getChildren();
                setChildren(childrenResponse.children);
            } catch (error) {
                console.error('Error fetching parent data:', error);
                
                if (error.response?.status === 401) {
                    parentAPI.logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, [navigate]);

    const handleLogout = () => {
        parentAPI.logout();
        navigate('/');
    };

    if (loading) {
        return <div className="loading">{t('Loading...')}</div>;
    }

    return (
        <div className="parent-dashboard">
            <header className="dashboard-header">
                <h1><span>Learning</span>Fun <span>{t('Parent')}</span></h1>
                <div className="header-actions">
                    <span className="welcome-text">{t('Welcome,')} {parent?.name}</span>
                    <button onClick={handleLogout} className="logout-btn">{t(' Logout')}</button>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>{t('Your Children')}</h2>
                        {children.length > 0 && (
                            <div className="section-header-buttons">
                                <button
                                    onClick={() => navigate(`/view-child/${children[0]._id}`)}
                                    className="btn-section-header"
                                >
                                    {t('👁️ View Profile')}
                                </button>
                                <button
                                    onClick={() => navigate(`/progress/${children[0]._id}`)}
                                    className="btn-section-header"
                                >
                                    {t('📊 View Progress Report')}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="children-grid">
                        {children.map((child) => {
                            
                            const savedStats = localStorage.getItem(`playTogether_${child._id}`);
                            const playTogetherStats = savedStats ? JSON.parse(savedStats) : null;

                            
                            const rawPrediction = child.asdPrediction;
                            const hasStoredPrediction = rawPrediction !== undefined && rawPrediction !== null && rawPrediction > 0;
                            const asdPrediction = hasStoredPrediction ? rawPrediction : ((child.qchatScore || 0) * 10);

                            
                            
                            let riskLevel = 'Low';
                            if (asdPrediction > 70) {
                                riskLevel = 'High';
                            } else if (asdPrediction > 30) {
                                riskLevel = 'Medium';
                            }

                            
                            const showOnlyPlayTogether = riskLevel === 'Medium' || riskLevel === 'High';
                            console.log(`Child: ${child.name}, asdPrediction: ${asdPrediction}%, riskLevel: ${riskLevel}, showOnlyPlayTogether: ${showOnlyPlayTogether}`);

                            return (
                                <div key={child._id} className="child-card-wrapper">
                                    {!showOnlyPlayTogether && (
                                        <div className="child-card" style={{ position: 'relative' }}>
                                            <div>
                                                <div className="child-card-header">
                                                    <div className="child-avatar">
                                                        {child.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="child-info">
                                                        <h3>{child.name}</h3>
                                                        <span className="child-level">{t(child.learningLevel || 'beginner')}</span>
                                                        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                                                            {t('Age')}: {child.age || 'N/A'} {t('years')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="stats-grid">
                                                    <div className="stat-item">
                                                        <span className="stat-value">{child.progress?.totalPoints || 0}</span>
                                                        <span className="stat-label">{t('🏆 Points')}</span>
                                                    </div>
                                                    <div className="stat-item">
                                                        <span className="stat-value">{child.progress?.streakDays || 0}</span>
                                                        <span className="stat-label">{t('🔥 Streak')}</span>
                                                    </div>
                                                    <div className="stat-item">
                                                        <span className="stat-value">{child.progress?.completedActivities || 0}</span>
                                                        <span className="stat-label">{t('✅ Activities')}</span>
                                                    </div>
                                                    <div className="stat-item">
                                                        <span className="stat-value">{child.age || '—'}</span>
                                                        <span className="stat-label">{t('🎂 Age')}</span>
                                                    </div>
                                                    <div className="stat-item mood-stat">
                                                        <span className="stat-value">
                                                            {child.moodTracking && child.moodTracking.length > 0
                                                                ? (() => {
                                                                    const lastMood = child.moodTracking[child.moodTracking.length - 1];
                                                                    const isToday = new Date(lastMood.date).toDateString() === new Date().toDateString();
                                                                    if (!isToday) return '—';

                                                                    const moodMap = {
                                                                        'happy': '😊',
                                                                        'neutral': '😐',
                                                                        'sad': '😢',
                                                                        'angry': '😠'
                                                                    };
                                                                    return moodMap[lastMood.mood] || '—';
                                                                })()
                                                                : '—'}
                                                        </span>
                                                        <span className="stat-label">{t('💭 Mood')}</span>
                                                    </div>
                                                    <div className="stat-item">
                                                        <span className="stat-value" style={{ fontSize: '1.2rem' }}>
                                                            {child.sex === 'male' ? '👦' : child.sex === 'female' ? '👧' : '👤'}
                                                        </span>
                                                        <span className="stat-label">{t('Gender')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            <div className="child-actions">
                                                <button
                                                    onClick={() => navigate(`/child-mode/${child._id}`)}
                                                    className="btn-enter-mode"
                                                >
                                                    {t('🎮 Enter Child Mode')}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    
                                    <PlayTogetherCard
                                        childId={child._id}
                                        childName={child.name}
                                        stats={playTogetherStats || {}}
                                        fullWidth={showOnlyPlayTogether}
                                    />
                                </div>
                            );
                        })}

                        {children.length === 0 && (
                            <div className="empty-state">
                                <p>{t('No children found. Please contact support if this is unexpected.')}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ParentDashboard;