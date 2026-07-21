
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './ColorMatchingGame.css';


const COLORS = [
    { name: 'Red', hex: '#FFB3B3', object: '🍎', objectName: 'Apple' },
    { name: 'Blue', hex: '#BAE1FF', object: '🚙', objectName: 'Car' },
    { name: 'Green', hex: '#BFFCC6', object: '🌿', objectName: 'Leaf' },
    { name: 'Yellow', hex: '#FFFFBA', object: '⭐', objectName: 'Star' },
    { name: 'Purple', hex: '#E6E6FA', object: '🍇', objectName: 'Grapes' },
    { name: 'Orange', hex: '#FFDFBA', object: '🍊', objectName: 'Orange' }
];

const DIFFICULTY_CONFIG = {
    Easy: { numOptions: 2, showLabel: true, showObject: false },
    Medium: { numOptions: 3, showLabel: true, showObject: true },
    Hard: { numOptions: 4, showLabel: false, showObject: true }
};

const ColorMatchingGame = ({ onComplete, onClose, totalPoints = 10 }) => {
    const { isArabic, t } = useLanguage();
    const {
        difficulty,
        feedback: adaptiveFeedback,
        feedbackType,
        showFeedback,
        stats,
        recordAnswer,
        getAccuracy,
        setDifficulty
    } = useChildModeAdaptive({
        initialDifficulty: 'Easy',
        consecutiveThreshold: 5
    });

    const [score, setScore] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);

    const [targetItem, setTargetItem] = useState(null);
    const [options, setOptions] = useState([]);
    const [showCelebration, setShowCelebration] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);

    const MAX_ROUNDS = 5; 
    const config = DIFFICULTY_CONFIG[difficulty];

    const startNewRound = useCallback(() => {
        setWrongAttempts(0);
        const target = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTargetItem(target);

        
        let newOptions = [target];
        while (newOptions.length < config.numOptions) {
            const random = COLORS[Math.floor(Math.random() * COLORS.length)];
            if (!newOptions.find(o => o.name === random.name)) {
                newOptions.push(random);
            }
        }
        
        setOptions(newOptions.sort(() => Math.random() - 0.5));
    }, [config.numOptions]);

    
    useEffect(() => {
        startNewRound();
    }, [startNewRound]);

    const handleOptionClick = (item) => {
        if (showCelebration) return;

        const isCorrect = item.name === targetItem.name;
        recordAnswer(isCorrect, `color_${item.name}`);

        if (isCorrect) {
            
            setShowCelebration(true);
            setScore(prev => prev + (totalPoints / MAX_ROUNDS));

            
            setTimeout(() => {
                setShowCelebration(false);
                if (roundsPlayed + 1 >= MAX_ROUNDS) {
                    
                    onComplete(score + (totalPoints / MAX_ROUNDS), {
                        achieved: getAccuracy(),
                        difficulty,
                        totalAttempts: roundsPlayed + 1
                    });
                } else {
                    setRoundsPlayed(prev => prev + 1);
                    startNewRound();
                }
            }, 1500); 
        } else {
            setWrongAttempts(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    if (difficulty === 'Easy') {
                        startNewRound();
                    } else {
                        setDifficulty('Easy');
                    }
                    return 0;
                }
                return newCount;
            });
        }
    };

    return (
        <div className="game-overlay">
            <div className="game-container">
                <button className="close-game-btn" onClick={onClose} aria-label={t('Close Game')}>×</button>

                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${((roundsPlayed) / MAX_ROUNDS) * 100}%` }}
                    />
                </div>

                <div className="game-header">
                    <div className="level-badge">{t('Difficulty')}: {t(difficulty)}</div>
                    <div className="score-display">{t('Stars')}: {score / 10} ⭐</div>
                </div>

                <AdaptiveFeedbackChild
                    difficulty={difficulty}
                    feedback={adaptiveFeedback}
                    feedbackType={feedbackType}
                    showFeedback={showFeedback}
                    stats={stats}
                />

                {!showCelebration ? (
                    <>
                        <div className="game-instruction">
                            {config.showLabel ? (
                                isArabic ? (
                                    <>
                                        {t('Find the')} {t('Box')} <span className="target-text" style={{ color: '#555', borderBottom: `4px solid ${targetItem?.hex}` }}>
                                            {t(targetItem?.name)}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Find the <span className="target-text" style={{ color: '#555', borderBottom: `4px solid ${targetItem?.hex}` }}>
                                            {targetItem?.name}
                                        </span> Box
                                    </>
                                )
                            ) : (
                                <>
                                    {t('Find')}: <span className="target-text" style={{ color: '#555' }}>
                                        {targetItem?.object}
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="options-grid">
                            {options.map((item, index) => (
                                <button
                                    key={index}
                                    className={`option-btn`}
                                    style={{
                                        backgroundColor: config.showObject ? '#FFF' : item.hex,
                                        border: config.showObject ? `4px solid ${item.hex}` : 'none'
                                    }}
                                    onClick={() => handleOptionClick(item)}
                                >
                                    {config.showObject && <span className="option-emoji">{item.object}</span>}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="celebration-view">
                        <div className="giant-star">🌟</div>
                        <h2>{t('Great Job!')}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorMatchingGame;
