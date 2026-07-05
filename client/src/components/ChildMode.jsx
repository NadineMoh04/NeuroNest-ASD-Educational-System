import React, { useState, useEffect } from 'react';
import { parentAPI } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import ColorMatchingGame from './ChildModeGames/ColorMatchingGame';
import ShapeSortingGame from './ChildModeGames/ShapeSortingGame';
import NumberRecognitionGame from './ChildModeGames/NumberRecognitionGame';
import SimpleMathGame from './ChildModeGames/SimpleMathGame';
import AnimalMatchingGame from './ChildModeGames/AnimalMatchingGame';
import LetterTracingGame from './ChildModeGames/LetterTracingGame';
import MemoryCardFlipGame from './ChildModeGames/MemoryCardFlipGame';
import SoundRecognitionGame from './ChildModeGames/SoundRecognitionGame';
import PatternCompletionGame from './ChildModeGames/PatternCompletionGame';
import CountingObjectsGame from './ChildModeGames/CountingObjectsGame';
import CategorizationGame from './ChildModeGames/CategorizationGame';
import './HomePage.css';
import './ChildMode.css';

const ChildMode = () => {
    const { isArabic, t } = useLanguage();
    const { childId } = useParams();
    const [child, setChild] = useState(null); 
    const [activities, setActivities] = useState([ 
        { id: 1, title: 'Color Matching Game', points: 10, completed: false },
        { id: 2, title: 'Shape Sorting', points: 15, completed: false },
        { id: 3, title: 'Number Recognition', points: 20, completed: false },
        { id: 4, title: 'Simple Math', points: 25, completed: false },
        { id: 5, title: 'Animal Matching', points: 30, completed: false },
        { id: 6, title: 'Letter Tracing', points: 30, completed: false },
        { id: 7, title: 'Memory Card Flip', points: 30, completed: false },
        { id: 8, title: 'Sound Recognition', points: 30, completed: false },
        { id: 9, title: 'Pattern Completion', points: 30, completed: false },
        { id: 10, title: 'Counting Objects', points: 30, completed: false },
        { id: 11, title: 'Categorization Game', points: 35, completed: false }
    ]);
    const [selectedMood, setSelectedMood] = useState(''); 
    const [showMoodSelector, setShowMoodSelector] = useState(false); 
    const [activeActivity, setActiveActivity] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchChildData = async () => {
            try {
                const response = await parentAPI.getChildById(childId);
                setChild(response.child);
                
                
                const savedProgress = localStorage.getItem(`childMode_${childId}`);
                if (savedProgress) {
                    const progress = JSON.parse(savedProgress);
                    
                    if (progress.activities && progress.activities.length > 0) {
                        setActivities(prevActivities => 
                            prevActivities.map(activity => {
                                const completedActivity = progress.activities.find(a => a.id === activity.id);
                                if (completedActivity) {
                                    return { ...activity, completed: true };
                                }
                                return activity;
                            })
                        );
                    }
                }
            } catch (error) {
                console.error('Error fetching child data:', error);
            }
        };

        fetchChildData();
    }, [childId]);

    const handlePlayActivity = (activity) => {
        if (activity.title === 'Color Matching Game' ||
            activity.title === 'Shape Sorting' ||
            activity.title === 'Number Recognition' ||
            activity.title === 'Simple Math' ||
            activity.title === 'Animal Matching' ||
            activity.title === 'Letter Tracing' ||
            activity.title === 'Memory Card Flip' ||
            activity.title === 'Sound Recognition' ||
            activity.title === 'Pattern Completion' ||
            activity.title === 'Counting Objects' ||
            activity.title === 'Categorization Game') {
            setActiveActivity(activity);
        } else {
            
            handleActivityComplete(activity.id);
        }
    };

    const handleGameComplete = (points, stats = null) => {
        if (activeActivity) {
            
            
            const extraData = stats ? {
                achieved: Math.round(stats.achieved * 100) + '%',
                attempts: stats.totalAttempts
            } : {};

            
            handleActivityComplete(activeActivity.id, activeActivity.points, extraData);
        }
        setActiveActivity(null);
    };

    const updateChildModeProgress = (pointsEarned) => {
        
        const existingData = localStorage.getItem(`childMode_${childId}`);
        let progress = existingData ? JSON.parse(existingData) : {
            totalPoints: 0,
            activitiesCompleted: 0,
            gamesPlayed: 0,
            totalTimeSpent: 0,
            lastActive: null,
            activities: []
        };

        
        progress.totalPoints += pointsEarned;
        progress.activitiesCompleted += 1;
        progress.gamesPlayed += 1;
        progress.totalTimeSpent += 5; 
        progress.lastActive = new Date().toISOString();
        
        
        if (activeActivity) {
            progress.activities.push({
                id: activeActivity.id,
                title: activeActivity.title,
                points: pointsEarned,
                completedAt: new Date().toISOString()
            });
        }

        
        localStorage.setItem(`childMode_${childId}`, JSON.stringify(progress));
        console.log('Child Mode progress saved:', progress);
    };

    const handleActivityComplete = async (activityId, earnedPoints = 0, extraData = {}) => {
        const activity = activities.find(a => a.id === activityId);
        const points = earnedPoints !== undefined ? earnedPoints : activity.points;

        setActivities(activities.map(activity =>
            activity.id === activityId ? { ...activity, completed: true } : activity
        ));

        
        updateChildModeProgress(points);

        
        try {
            await parentAPI.updateChildProgress(childId, {
                activityType: 'game',
                pointsEarned: points,
                completed: true,
                skillsImproved: {
                    attention: 5,
                    communication: 3,
                    ...extraData 
                }
            });

            
            const response = await parentAPI.getChildById(childId);
            setChild(response.child);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleMoodSubmit = async () => {
        if (!selectedMood) return;

        try {
            await parentAPI.recordChildMood(childId, { mood: selectedMood });
            setShowMoodSelector(false);
            setSelectedMood('');
        } catch (error) {
            console.error('Error recording mood:', error);
        }
    };

    const handleExitChildMode = () => {
        
        navigate('/parentdashboard');
    };

    if (!child) {
        return <div className="loading">{t('Loading child mode...')}</div>;
    }

    
    const moodOptions = [
        { value: 'happy', label: t('😊 Happy'), color: '#4CAF50' },
        { value: 'neutral', label: t('😐 Neutral'), color: '#FFC107' },
        { value: 'sad', label: t('😢 Sad'), color: '#2196F3' },
        { value: 'angry', label: t('😠 Angry'), color: '#F44336' }
    ];

    const rewards = [
        { id: 'star', name: t('Star Sticker'), icon: '⭐', cost: 50 },
        { id: 'unicorn', name: t('Unicorn Badge'), icon: '🦄', cost: 100 },
        { id: 'trophy', name: t('Trophy'), icon: '🏆', cost: 200 }
    ];

    return (
        <div className="child-mode">
            {activeActivity?.title === 'Color Matching Game' && (
                <ColorMatchingGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Shape Sorting' && (
                <ShapeSortingGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Number Recognition' && (
                <NumberRecognitionGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Simple Math' && (
                <SimpleMathGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Animal Matching' && (
                <AnimalMatchingGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Letter Tracing' && (
                <LetterTracingGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Memory Card Flip' && (
                <MemoryCardFlipGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Sound Recognition' && (
                <SoundRecognitionGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Pattern Completion' && (
                <PatternCompletionGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Counting Objects' && (
                <CountingObjectsGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}
            {activeActivity?.title === 'Categorization Game' && (
                <CategorizationGame
                    totalPoints={activeActivity.points}
                    onComplete={handleGameComplete}
                    onClose={() => setActiveActivity(null)}
                />
            )}

            <header className="child-mode-header">
                <h1>{t('Hello')}, {child.name}!</h1>
                <div className="child-progress">
                    <span>{t('Points')}: {child.progress?.totalPoints || 0}</span>
                    <span>{t('Streak')}: {child.progress?.streakDays || 0} {t('days')}</span>
                </div>
                <button onClick={handleExitChildMode} className="exit-child-mode-btn">
                    {t('Exit Child Mode')}
                </button>
            </header>

            <main className="child-mode-main">
                <section className="daily-activities">
                    <h2>{t("Today's Activities")}</h2>
                    <p>{t('Complete up to 3 activities for fun rewards!')}</p>

                    <div className="activities-grid">
                        {activities.map(activity => (
                            <div
                                key={activity.id}
                                className={`activity-card ${activity.completed ? 'completed' : ''}`}
                            >
                                <h3>{t(activity.title)}</h3>
                                <p>{t('Points')}: {activity.points}</p>
                                {!activity.completed ? (
                                    <button
                                        onClick={() => handlePlayActivity(activity)}
                                        className="btn btn-primary"
                                    >
                                        {t('Play')}
                                    </button>
                                ) : (
                                    <div className="completed-badge">{t('✓ Completed!')}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mood-checkin">
                    <h2>{t('How are you feeling?')}</h2>
                    <div className="mood-selector-container">
                        {!showMoodSelector ? (
                            <button
                                onClick={() => setShowMoodSelector(true)}
                                className="btn btn-secondary"
                            >
                                {t('Check In')}
                            </button>
                        ) : (
                            <div className="mood-selector">
                                <h3>{t('Tap how you feel:')}</h3>
                                <div className="mood-options">
                                    {moodOptions.map(option => (
                                        <button
                                            key={option.value}
                                            className={`mood-option ${selectedMood === option.value ? 'selected' : ''}`}
                                            style={{ backgroundColor: selectedMood === option.value ? option.color : '#f0f0f0' }}
                                            onClick={() => setSelectedMood(option.value)}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="mood-actions">
                                    <button
                                        onClick={handleMoodSubmit}
                                        className="btn btn-primary"
                                        disabled={!selectedMood}
                                    >
                                        {t('Save Feeling')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowMoodSelector(false);
                                            setSelectedMood('');
                                        }}
                                        className="btn btn-cancel"
                                    >
                                        {t('Cancel')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="reward-store">
                    <h2>{t('Reward Store')}</h2>
                    <p>{t('Earn points to unlock fun rewards!')}</p>

                    <div className="rewards-grid">
                        {rewards.map(reward => {
                            const isUnlocked = (child.progress?.totalPoints || 0) >= reward.cost;
                            return (
                                <div key={reward.id} className={`reward-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                    <div className="reward-icon">{reward.icon}</div>
                                    <p>{reward.name}</p>
                                    <span className="cost">
                                        {isUnlocked ? t('Unlocked!') : `${reward.cost} ${t('pts')}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ChildMode;
