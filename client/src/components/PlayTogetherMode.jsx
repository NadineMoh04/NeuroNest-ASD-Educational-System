import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext.jsx';
import AnimalMatchingGame from './ChildModeGames/AnimalMatchingGame';
import MemoryCardFlipGame from './ChildModeGames/MemoryCardFlipGame';
import CountingObjectsGame from './ChildModeGames/CountingObjectsGame';
import PatternCompletionGame from './ChildModeGames/PatternCompletionGame';
import LetterTracingGame from './ChildModeGames/LetterTracingGame';
import SoundRecognitionGame from './ChildModeGames/SoundRecognitionGame';
import CategorizationGameTogether from './PlayTogetherGames/CategorizationGameTogether';
import FindTheToyGame from './PlayTogetherGames/FindTheToyGame';
import GuessEmotionGame from './PlayTogetherGames/GuessEmotionGame';
import BuildTogetherGame from './PlayTogetherGames/BuildTogetherGame';
import MyTurnYourTurnGame from './PlayTogetherGames/MyTurnYourTurnGame';
import SoundAndGuessGame from './PlayTogetherGames/SoundAndGuessGame';
import StoryTogetherGame from './PlayTogetherGames/StoryTogetherGame';
import './PlayTogetherMode.css';

const getGameTitleKey = (gameIdOrTitle) => {
    if (!gameIdOrTitle) return '';
    
    const keys = {
        'animal-matching': 'Animal Matching',
        'memory-card': 'Memory Game',
        'counting-objects': 'Counting Objects',
        'pattern-completion': 'Pattern Game',
        'letter-tracing': 'Letter Tracing',
        'sound-recognition': 'Sound Recognition',
        'find-the-toy': 'Find the Toy',
        'guess-emotion': 'Guess the Emotion',
        'build-together': 'Build Together',
        'my-turn-your-turn': 'My Turn – Your Turn',
        'sound-and-guess': 'Sound & Guess',
        'story-together': 'Story Together',
        'categorization': 'Categorization Game'
    };
    if (keys[gameIdOrTitle]) {
        return keys[gameIdOrTitle];
    }

    const titleToKey = {
        'Animal Matching': 'Animal Matching',
        'Memory Game': 'Memory Game',
        'Counting Objects': 'Counting Objects',
        'Pattern Game': 'Pattern Game',
        'Letter Tracing': 'Letter Tracing',
        'Sound Recognition': 'Sound Recognition',
        'Find the Toy': 'Find the Toy',
        'Guess the Emotion': 'Guess the Emotion',
        'Build Together': 'Build Together',
        'My Turn – Your Turn': 'My Turn – Your Turn',
        'Sound & Guess': 'Sound & Guess',
        'Story Together': 'Story Together',
        'Categorization Game': 'Categorization Game',
        
        'مطابقة الحيوانات': 'Animal Matching',
        'لعبة الذاكرة': 'Memory Game',
        'عد الأشياء': 'Counting Objects',
        'لعبة الأنماط': 'Pattern Game',
        'تتبع الحروف': 'Letter Tracing',
        'التعرف على الأصوات': 'Sound Recognition',
        'ابحث عن اللعبة': 'Find the Toy',
        'خمن الشعور': 'Guess the Emotion',
        'ابنِ معاً': 'Build Together',
        'دوري - دورك': 'My Turn – Your Turn',
        'صوت وتخمين': 'Sound & Guess',
        'قصة معاً': 'Story Together',
        'لعبة التصنيف': 'Categorization Game',
        'التصنيف': 'Categorization Game'
    };
    return titleToKey[gameIdOrTitle] || gameIdOrTitle;
};

const PlayTogetherMode = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const { isArabic, t } = useLanguage();
    const [child, setChild] = useState(null);
    const [parent, setParent] = useState(null);
    const [activeGame, setActiveGame] = useState(null);
    const [playSession, setPlaySession] = useState(null);

    
    const [togetherStats, setTogetherStats] = useState({
        gamesPlayedTogether: 0,
        totalTimeSpent: 0, 
        familyPoints: 0,
        teamStars: 0,
        gamesHistory: [],
        lastPlayed: null,
        teamworkBadges: []
    });

    
    const cooperativeGames = [
        {
            id: 'animal-matching',
            title: t('Animal Matching'),
            icon: '🐶',
            description: t('Match animal pairs together'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🌟', '🏆'],
            parentAction: t('Help find matching pairs'),
            childAction: t('Flip cards and remember'),
            cooperativeTip: t('Take turns flipping cards!')
        },
        {
            id: 'memory-card',
            title: t('Memory Game'),
            icon: '🧠',
            description: t('Find matching cards as a team'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🎖️', '⭐'],
            parentAction: t('Help remember card positions'),
            childAction: t('Match the pairs'),
            cooperativeTip: t('Work together to remember!')
        },
        {
            id: 'counting-objects',
            title: t('Counting Objects'),
            icon: '🍎',
            description: t('Count and learn numbers together'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🔢', '✨'],
            parentAction: t('Ask "How many do you see?"'),
            childAction: t('Count the objects'),
            cooperativeTip: t('Count out loud together!')
        },
        {
            id: 'pattern-completion',
            title: t('Pattern Game'),
            icon: '🔷',
            description: t('Complete patterns as a team'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🎨', '💎'],
            parentAction: t('Ask "What comes next?"'),
            childAction: t('Find the missing piece'),
            cooperativeTip: t('Discuss the pattern together!')
        },
        {
            id: 'letter-tracing',
            title: t('Letter Tracing'),
            icon: '✏️',
            description: t('Trace letters together'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['📝', '⭐'],
            parentAction: t('Guide their hand and encourage'),
            childAction: t('Trace the letter'),
            cooperativeTip: t('Help them follow the shape!')
        },
        {
            id: 'sound-recognition',
            title: t('Sound Recognition'),
            icon: '🔊',
            description: t('Identify sounds together'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🎵', '🎶'],
            parentAction: t('Listen together and discuss'),
            childAction: t('Choose the correct sound'),
            cooperativeTip: t('Make the sounds together!')
        },
        {
            id: 'find-the-toy',
            title: t('Find the Toy'),
            icon: '🧸',
            description: t('Parent guides child to find the target toy'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🎯', '🌟'],
            parentAction: t('See the target and give hints'),
            childAction: t('Search and find the toy'),
            cooperativeTip: t('Give clear directions like "left" or "right"!')
        },
        {
            id: 'guess-emotion',
            title: t('Guess the Emotion'),
            icon: '😊',
            description: t('Parent makes face, child guesses emotion'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['😊', '🎭'],
            parentAction: t('Make facial expressions'),
            childAction: t('Guess the emotion'),
            cooperativeTip: t('Use exaggerated expressions to help!')
        },
        {
            id: 'build-together',
            title: t('Build Together'),
            icon: '🧩',
            description: t('Parent sees full picture, guides child to build'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🏗️', '⭐'],
            parentAction: t('Describe where pieces go'),
            childAction: t('Place the puzzle pieces'),
            cooperativeTip: t('Be specific: "Put the red piece on top"!')
        },
        {
            id: 'my-turn-your-turn',
            title: t('My Turn – Your Turn'),
            icon: '🔄',
            description: t('Take turns to complete actions together'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🔄', '🤝'],
            parentAction: t('Wait for your turn patiently'),
            childAction: t('Complete your turn'),
            cooperativeTip: t('Say "My turn" and "Your turn" clearly!')
        },
        {
            id: 'sound-and-guess',
            title: t('Sound & Guess'),
            icon: '🔊',
            description: t('Parent imitates sound, child guesses what it is'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['🎵', '🏆'],
            parentAction: t('Imitate the sound you hear'),
            childAction: t('Guess what made the sound'),
            cooperativeTip: t('Have fun making silly sounds!')
        },
        {
            id: 'story-together',
            title: t('Story Together'),
            icon: '📖',
            description: t('Parent creates events, child chooses emotions'),
            points: 30,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['📚', '✨'],
            parentAction: t('Create story events'),
            childAction: t('Choose emotions for characters'),
            cooperativeTip: t('Make it interactive and fun!')
        },
        {
            id: 'categorization',
            title: t('Categorization Game'),
            icon: '🗂️',
            description: t('Sort objects into categories together'),
            points: 35,
            familyPoints: 50,
            teamStars: 3,
            playedCount: 0,
            timeSpent: 0,
            lastPlayed: null,
            rewards: ['📦', '⭐'],
            parentAction: t('Help identify categories'),
            childAction: t('Drag objects to correct boxes'),
            cooperativeTip: t('Discuss why each object belongs in its category!')
        }
    ];

    const [games, setGames] = useState(cooperativeGames);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const childResponse = await parentAPI.getChildById(childId);
                setChild(childResponse.child);
                
                
                const savedStats = localStorage.getItem(`playTogether_${childId}`);
                if (savedStats) {
                    const stats = JSON.parse(savedStats);
                    setTogetherStats(stats);
                    
                    
                    setGames(prevGames => prevGames.map(game => {
                        const gameHistory = stats.gamesHistory.find(h => h.gameId === game.id);
                        if (gameHistory) {
                            return {
                                ...game,
                                playedCount: gameHistory.playedCount || 0,
                                timeSpent: gameHistory.timeSpent || 0,
                                lastPlayed: gameHistory.lastPlayed || null
                            };
                        }
                        return game;
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [childId]);

    const handlePlayGame = (game) => {
        
        const session = {
            gameId: game.id,
            gameTitle: game.title,
            startTime: Date.now(),
            parentParticipating: true
        };
        setPlaySession(session);
        setActiveGame(game);
    };

    const handleGameComplete = (score, stats) => {
        if (!playSession) return;

        const endTime = Date.now();
        const timeSpent = Math.round((endTime - playSession.startTime) / 60000); 
        
        
        const accuracy = stats?.accuracy || 0.5;
        const earnedFamilyPoints = Math.round(50 * accuracy);
        const earnedTeamStars = accuracy > 0.8 ? 3 : accuracy > 0.6 ? 2 : 1;
        
        
        setGames(prevGames => prevGames.map(game => {
            if (game.id === playSession.gameId) {
                return {
                    ...game,
                    playedCount: game.playedCount + 1,
                    timeSpent: game.timeSpent + timeSpent,
                    lastPlayed: new Date().toISOString()
                };
            }
            return game;
        }));

        
        const updatedStats = {
            ...togetherStats,
            gamesPlayedTogether: togetherStats.gamesPlayedTogether + 1,
            totalTimeSpent: togetherStats.totalTimeSpent + timeSpent,
            familyPoints: togetherStats.familyPoints + earnedFamilyPoints,
            teamStars: togetherStats.teamStars + earnedTeamStars,
            lastPlayed: new Date().toISOString(),
            gamesHistory: [
                ...togetherStats.gamesHistory,
                {
                    gameId: playSession.gameId,
                    gameTitle: getGameTitleKey(playSession.gameTitle),
                    playedCount: 1,
                    timeSpent: timeSpent,
                    lastPlayed: new Date().toISOString(),
                    score: score,
                    familyPoints: earnedFamilyPoints,
                    teamStars: earnedTeamStars
                }
            ],
            teamworkBadges: accuracy > 0.8 ? 
                [...togetherStats.teamworkBadges, {
                    id: Date.now(),
                    name: 'Teamwork Star',
                    icon: '🌟',
                    earnedAt: new Date().toISOString(),
                    game: getGameTitleKey(playSession.gameTitle)
                }] : togetherStats.teamworkBadges
        };

        setTogetherStats(updatedStats);
        
        
        localStorage.setItem(`playTogether_${childId}`, JSON.stringify(updatedStats));

        setActiveGame(null);
        setPlaySession(null);
    };

    const handleGameClose = () => {
        setActiveGame(null);
        setPlaySession(null);
    };

    const handleExitPlayTogether = () => {
        navigate('/parentdashboard');
    };

    const formatTime = (minutes) => {
        if (minutes < 60) return `${minutes}${t('m')}`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}${t('h')} ${mins}${t('m')}`;
    };

    const formatLastPlayed = (dateString) => {
        if (!dateString) return t('Never played');
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return t('Today');
        if (diffDays === 2) return t('Yesterday');
        if (diffDays <= 7) return `${diffDays} ${t('days ago')}`;
        return date.toLocaleDateString();
    };

    if (!child) {
        return <div className="loading">{t('Loading Play Together Mode...')}</div>;
    }

    
    if (activeGame) {
        const gameComponents = {
            'animal-matching': AnimalMatchingGame,
            'memory-card': MemoryCardFlipGame,
            'counting-objects': CountingObjectsGame,
            'pattern-completion': PatternCompletionGame,
            'letter-tracing': LetterTracingGame,
            'sound-recognition': SoundRecognitionGame,
            'find-the-toy': FindTheToyGame,
            'guess-emotion': GuessEmotionGame,
            'build-together': BuildTogetherGame,
            'my-turn-your-turn': MyTurnYourTurnGame,
            'sound-and-guess': SoundAndGuessGame,
            'story-together': StoryTogetherGame,
            'categorization': CategorizationGameTogether
        };

        const GameComponent = gameComponents[activeGame.id];
        
        if (GameComponent) {
            return (
                <GameComponent
                    totalPoints={activeGame.points}
                    onComplete={handleGameComplete}
                    onClose={handleGameClose}
                />
            );
        }
    }

    return (
        <div className="play-together-mode">
            
            <header className="play-together-header">
                <div className="header-content">
                    <div className="family-info">
                        <h1>👨‍👩‍👧 {t('Play Together Mode')}</h1>
                        <p className="family-subtitle">{t('Playing with')} {child.name}</p>
                    </div>
                    <div className="family-stats">
                        <div className="stat-badge">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">{togetherStats.teamStars}</span>
                            <span className="stat-label">{t('Team Stars')}</span>
                        </div>
                        <div className="stat-badge">
                            <span className="stat-icon">👨‍👩‍👧</span>
                            <span className="stat-value">{togetherStats.familyPoints}</span>
                            <span className="stat-label">{t('Family Points')}</span>
                        </div>
                        <div className="stat-badge">
                            <span className="stat-icon">🎮</span>
                            <span className="stat-value">{togetherStats.gamesPlayedTogether}</span>
                            <span className="stat-label">{t('Games Played')}</span>
                        </div>
                    </div>
                    <button onClick={handleExitPlayTogether} className="exit-btn">
                        {t('Exit')}
                    </button>
                </div>
            </header>

            <main className="play-together-main">
                
                <section className="progress-overview">
                    <div className="overview-card">
                        <div className="overview-header">
                            <h2>📊 {t('Your Play Together Progress')}</h2>
                        </div>
                        <div className="overview-stats">
                            <div className="overview-stat">
                                <div className="stat-circle">
                                    <svg width="80" height="80">
                                        <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                                        <circle 
                                            cx="40" 
                                            cy="40" 
                                            r="35" 
                                            stroke="#667eea" 
                                            strokeWidth="8" 
                                            fill="none"
                                            strokeDasharray={`${(togetherStats.gamesPlayedTogether / 20) * 220} 220`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="circle-text">{togetherStats.gamesPlayedTogether}</span>
                                </div>
                                <p>{t('Games Played')}</p>
                            </div>
                            <div className="overview-stat">
                                <div className="stat-circle">
                                    <svg width="80" height="80">
                                        <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                                        <circle 
                                            cx="40" 
                                            cy="40" 
                                            r="35" 
                                            stroke="#f5576c" 
                                            strokeWidth="8" 
                                            fill="none"
                                            strokeDasharray={`${Math.min((togetherStats.totalTimeSpent / 120) * 220, 220)} 220`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="circle-text">{formatTime(togetherStats.totalTimeSpent)}</span>
                                </div>
                                <p>{t('Time Together')}</p>
                            </div>
                            <div className="overview-stat">
                                <div className="stat-circle">
                                    <svg width="80" height="80">
                                        <circle cx="40" cy="40" r="35" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                                        <circle 
                                            cx="40" 
                                            cy="40" 
                                            r="35" 
                                            stroke="#4ecdc4" 
                                            strokeWidth="8" 
                                            fill="none"
                                            strokeDasharray={`${(togetherStats.teamworkBadges.length / 10) * 220} 220`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="circle-text">{togetherStats.teamworkBadges.length}</span>
                                </div>
                                <p>{t('Badges Earned')}</p>
                            </div>
                        </div>

                        
                        {togetherStats.gamesHistory.length > 0 && (
                            <div className="recent-activity">
                                <h3>🕐 {t('Last Played')}</h3>
                                <div className="activity-item">
                                    <span className="activity-icon">🎮</span>
                                    <div className="activity-details">
                                        <p className="activity-game">
                                            {t(getGameTitleKey(togetherStats.gamesHistory[togetherStats.gamesHistory.length - 1]?.gameTitle || togetherStats.gamesHistory[togetherStats.gamesHistory.length - 1]?.gameId))}
                                        </p>
                                        <p className="activity-time">
                                            {formatLastPlayed(togetherStats.lastPlayed)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                
                {togetherStats.teamworkBadges.length > 0 && (
                    <section className="teamwork-badges">
                        <h2>🏆 {t('Teamwork Badges')}</h2>
                        <div className="badges-grid">
                            {togetherStats.teamworkBadges.slice(-6).map((badge) => (
                                <div key={badge.id} className="badge-item">
                                    <div className="badge-icon">{badge.icon}</div>
                                    <p className="badge-name">{t(badge.name)}</p>
                                    <p className="badge-game">{t(getGameTitleKey(badge.game))}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                
                <section className="games-section">
                    <h2>🎮 {t('Cooperative Games')}</h2>
                    <p className="section-subtitle">{t('Play together and earn family rewards!')}</p>

                    <div className="games-grid">
                        {games.map(game => (
                            <div
                                key={game.id}
                                className={`game-card ${game.playedCount > 0 ? 'played' : ''}`}
                            >
                                <div className="game-header">
                                    <span className="game-icon">{game.icon}</span>
                                    {game.playedCount > 0 && (
                                        <span className="played-badge">✔ {t('Played')} {game.playedCount}x</span>
                                    )}
                                </div>

                                <h3 className="game-title">{game.title}</h3>
                                <p className="game-description">{game.description}</p>

                                
                                <div className="game-stats">
                                    <div className="game-stat">
                                        <span className="stat-icon">⏱️</span>
                                        <span className="stat-value">{formatTime(game.timeSpent)}</span>
                                    </div>
                                    <div className="game-stat">
                                        <span className="stat-icon">⭐</span>
                                        <span className="stat-value">{game.teamStars} {t('Stars')}</span>
                                    </div>
                                    <div className="game-stat">
                                        <span className="stat-icon">👨‍👩‍👧</span>
                                        <span className="stat-value">{game.familyPoints} {t('FP')}</span>
                                    </div>
                                </div>

                                
                                <div className="cooperative-info">
                                    <div className="action-item">
                                        <span className="action-label">👨‍👩‍👦 {t('Parent:')}</span>
                                        <span className="action-text">{game.parentAction}</span>
                                    </div>
                                    <div className="action-item">
                                        <span className="action-label">👶 {t('Child:')}</span>
                                        <span className="action-text">{game.childAction}</span>
                                    </div>
                                    <div className="cooperative-tip">
                                        💡 {game.cooperativeTip}
                                    </div>
                                </div>

                                
                                {game.playedCount > 0 && (
                                    <div className="game-progress">
                                        <div className="progress-label">
                                            <span>{t('Progress')}</span>
                                            <span>{Math.min(game.playedCount * 25, 100)}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: `${Math.min(game.playedCount * 25, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                
                                <div className="rewards-preview">
                                    <span className="rewards-label">{t('Rewards:')}</span>
                                    <div className="rewards-icons">
                                        {game.rewards.map((reward, idx) => (
                                            <span key={idx} className="reward-icon">{reward}</span>
                                        ))}
                                    </div>
                                </div>

                                
                                <button
                                    onClick={() => handlePlayGame(game)}
                                    className="play-btn"
                                >
                                    🎮 {game.playedCount > 0 ? t('Play Again Together') : t('Play Together')}
                                </button>
                                
                                {game.lastPlayed && (
                                    <p className="last-played">
                                        {t('Last played:')} {formatLastPlayed(game.lastPlayed)}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                
                <section className="cooperative-tips">
                    <h2>💡 {t('Tips for Playing Together')}</h2>
                    <div className="tips-grid">
                        <div className="tip-card">
                            <div className="tip-icon">🗣️</div>
                            <h3>{t('Communicate')}</h3>
                            <p>{t('Talk through the game together. Ask questions and encourage!')}</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-icon">🤝</div>
                            <h3>{t('Take Turns')}</h3>
                            <p>{t('Let your child lead sometimes. Guide them gently when needed.')}</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-icon">🎉</div>
                            <h3>{t('Celebrate Together')}</h3>
                            <p>{t('Celebrate wins as a team! Every achievement counts.')}</p>
                        </div>
                        <div className="tip-card">
                            <div className="tip-icon">⏰</div>
                            <h3>{t('Keep it Fun')}</h3>
                            <p>{t('Keep sessions short and positive. Quality time matters most!')}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PlayTogetherMode;
