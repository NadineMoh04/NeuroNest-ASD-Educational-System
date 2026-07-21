
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import './SimpleMathGame.css';

const OBJECTS = ['🍎', '🍌', '🚙', '⭐', '🐶', '⚽'];


const SimpleMathGame = ({ onComplete, onClose, totalPoints = 20 }) => {
    const { isArabic } = useLanguage();
    const t = isArabic ? translations.ar : translations.en;

    const [level, setLevel] = useState(1); 
    const [score, setScore] = useState(0); 
    const [roundsPlayed, setRoundsPlayed] = useState(0);

    
    const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0, op: '+', res: 0, obj: '🍎' });
    const [options, setOptions] = useState([]);
    const [pointsForRound, setPointsForRound] = useState(0);
    const [roundAttempts, setRoundAttempts] = useState(0);

    
    const [stats, setStats] = useState({ correct: 0, incorrect: 0, totalAttempts: 0 });

    
    const [feedback, setFeedback] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [isWrong, setIsWrong] = useState(false);

    const MAX_ROUNDS = 5;
    const POINTS_PER_ROUND = totalPoints / MAX_ROUNDS;

    const startNewRound = useCallback(() => {
        const isAddition = level === 1;
        const op = isAddition ? '+' : '-';
        const obj = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
        let num1, num2, res;

        if (isAddition) {
            num1 = Math.floor(Math.random() * 5) + 1;
            num2 = Math.floor(Math.random() * 5) + 1;
            res = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 5) + 3;
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            res = num1 - num2;
        }

        setCurrentProblem({ num1, num2, op, res, obj });
        setPointsForRound(POINTS_PER_ROUND); 
        setRoundAttempts(0);
        setFeedback('');
        setIsWrong(false);

        let newOptions = [res];
        while (newOptions.length < 3) {
            const random = Math.max(0, Math.min(10, res + Math.floor(Math.random() * 5) - 2));
            if (!newOptions.includes(random)) {
                newOptions.push(random);
            }
        }
        setOptions(newOptions.sort(() => Math.random() - 0.5));
    }, [level, POINTS_PER_ROUND]);

    useEffect(() => {
        startNewRound();
    }, [startNewRound]);

    const handleOptionClick = (selectedVal) => {
        setStats(prev => ({ ...prev, totalAttempts: prev.totalAttempts + 1 }));

        if (selectedVal === currentProblem.res) {
            
            setShowCelebration(true);
            setFeedback('Great Job! 🎉');

            
            const earned = pointsForRound;
            setScore(prev => prev + earned);
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));

            setTimeout(() => {
                setShowCelebration(false);
                if (roundsPlayed + 1 >= MAX_ROUNDS) {
                    if (level === 1) {
                        setLevel(2);
                        setRoundsPlayed(0);
                        startNewRound();
                    } else {
                        
                        onComplete(score + earned, {
                            achieved: (stats.correct + 1) / (stats.totalAttempts + 1), 
                            totalAttempts: stats.totalAttempts + 1
                        });
                    }
                } else {
                    setRoundsPlayed(prev => prev + 1);
                    startNewRound();
                }
            }, 1000); 
        } else {
            
            setIsWrong(true);
            setFeedback('Try Again 🧐');
            setPointsForRound(prev => Math.max(0, prev - 1)); 
            setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));

            const nextWrong = roundAttempts + 1;
            setRoundAttempts(nextWrong);

            if (nextWrong >= 3) {
                setLevel(1);
                setFeedback(t["Let's try an easier problem!"] || "Let's try an easier problem!");
                setTimeout(() => {
                    startNewRound();
                }, 1000);
            } else {
                setTimeout(() => {
                    setIsWrong(false);
                    setFeedback('');
                }, 1000);
            }
        }
    };

    
    const renderObjects = (count, objChar) => {
        return (
            <div className="operand-group">
                {Array.from({ length: count }).map((_, i) => (
                    <span key={i} className="math-object">{objChar}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="game-overlay">
            <div className="game-container">
                <button className="close-game-btn" onClick={onClose} aria-label={t['Close Game'] || 'Close Game'}>×</button>

                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(roundsPlayed / MAX_ROUNDS) * 100}%` }}
                    />
                </div>

                <div className="game-header">
                    <div className="level-badge">{level === 1 ? (t['Addition ➕'] || 'Addition ➕') : (t['Subtraction ➖'] || 'Subtraction ➖')}</div>
                    <div className="score-display">{(t['Stars'] || 'Stars')}: {Math.floor(score / (totalPoints / MAX_ROUNDS / 2))} ⭐</div>
                </div>

                {!showCelebration ? (
                    <>
                        <div className="math-problem">
                            {renderObjects(currentProblem.num1, currentProblem.obj)}
                            <span className="operator">{currentProblem.op}</span>
                            {renderObjects(currentProblem.num2, currentProblem.obj)}
                            <span className="operator">=</span>
                            <span className="question-mark">?</span>
                        </div>

                        <div className="options-grid">
                            {options.map((val, index) => (
                                <button
                                    key={index}
                                    className={`option-btn ${isWrong ? 'no-shake' : ''}`}
                                    onClick={() => handleOptionClick(val)}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>

                        {feedback && (
                            <div className={`feedback-message ${isWrong ? 'gentle-bounce' : ''}`}>
                                {t[feedback] || feedback}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="celebration-view">
                        <div className="giant-star">🌟</div>
                        <h2>{t['Outstanding!'] || 'Outstanding!'}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleMathGame;
