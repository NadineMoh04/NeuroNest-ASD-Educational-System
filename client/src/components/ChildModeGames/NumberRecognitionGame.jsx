
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './NumberRecognitionGame.css';

const NumberRecognitionGame = ({ onComplete, onClose, totalPoints = 20 }) => {
    const { isArabic } = useLanguage();
    const t = isArabic ? translations.ar : translations.en;

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

    const [targetNumber, setTargetNumber] = useState(1);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);

    const MAX_ROUNDS = 5;

    const generateOptions = useCallback((target, diff) => {
        let max = 3;
        if (diff === 'Medium') max = 5;
        if (diff === 'Hard') max = 10;

        let nums = [target];
        while (nums.length < 3) {
            let r = Math.floor(Math.random() * max) + 1;
            if (!nums.includes(r)) nums.push(r);
        }
        return nums.sort(() => Math.random() - 0.5);
    }, []);

    const startRound = useCallback(() => {
        setWrongAttempts(0);
        let max = 3;
        if (difficulty === 'Medium') max = 5;
        if (difficulty === 'Hard') max = 10;

        const target = Math.floor(Math.random() * max) + 1;
        setTargetNumber(target);
        setOptions(generateOptions(target, difficulty));
    }, [difficulty, generateOptions]);

    useEffect(() => {
        startRound();
    }, [startRound]);

    const handleOptionClick = (num) => {
        const isCorrect = num === targetNumber;
        recordAnswer(isCorrect, `number_${num}`);

        if (isCorrect) {
            setScore(prev => prev + (totalPoints / MAX_ROUNDS));
            setTimeout(() => {
                if (round + 1 >= MAX_ROUNDS) {
                    onComplete(score + (totalPoints / MAX_ROUNDS), {
                        achieved: getAccuracy(),
                        difficulty,
                        totalAttempts: round + 1
                    });
                } else {
                    setRound(prev => prev + 1);
                    startRound();
                }
            }, 1000);
        } else {
            setWrongAttempts(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    if (difficulty === 'Easy') {
                        startRound();
                    } else {
                        setDifficulty('Easy');
                    }
                    return 0;
                }
                return newCount;
            });
        }
    };

    const renderVisuals = (num) => {
        
        return Array(num).fill('🍎').join(' ');
    };

    return (
        <div className="number-game-overlay">
            <div className="number-game-container">
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="game-header-simple">
                    <span>{t['Difficulty'] || 'Difficulty'}: {t[difficulty] || difficulty}</span>
                    <span>{t['Stars'] || 'Stars'}: {Math.floor(score)}</span>
                </div>

                <AdaptiveFeedbackChild
                    difficulty={difficulty}
                    feedback={adaptiveFeedback}
                    feedbackType={feedbackType}
                    showFeedback={showFeedback}
                    stats={stats}
                />

                <div className="number-instruction">
                    {t['Find number'] || 'Find number'} <span className="target-number">{targetNumber}</span>
                </div>

                {difficulty === 'Hard' && (
                    <div className="visual-hint">
                        {renderVisuals(targetNumber)}
                    </div>
                )}

                <div className="number-grid">
                    {options.map((num, idx) => (
                        <button
                            key={idx}
                            className="number-card"
                            onClick={() => handleOptionClick(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumberRecognitionGame;
