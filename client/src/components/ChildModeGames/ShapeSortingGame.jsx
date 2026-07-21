
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './ShapeSortingGame.css';

const SHAPES = [
    { id: 'circle', name: 'Circle', cssClass: 'shape-circle', color: '#FFB3B3' },
    { id: 'square', name: 'Square', cssClass: 'shape-square', color: '#BAE1FF' },
    { id: 'triangle', name: 'Triangle', cssClass: 'shape-triangle', color: '#FFFFBA' },
    { id: 'star', name: 'Star', cssClass: 'shape-star', color: '#E6E6FA' } 
];

const ShapeSortingGame = ({ onComplete, onClose, totalPoints = 15 }) => {
    const { isArabic, t } = useLanguage();
    const [level, setLevel] = useState(1); 
    const [score, setScore] = useState(0);
    const [currentShape, setCurrentShape] = useState(null);
    const [bins, setBins] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [round, setRound] = useState(0);
    const [animateSuccess, setAnimateSuccess] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState(0);

    const MAX_ROUNDS = 5;

    const setupLevel = useCallback(() => {
        setWrongAttempts(0);
        let availableShapes = [];
        if (level === 1) availableShapes = [SHAPES[0], SHAPES[1]]; 
        else if (level === 2) availableShapes = [SHAPES[0], SHAPES[1], SHAPES[2]]; 
        else availableShapes = SHAPES.slice(0, 4); 

        
        const target = availableShapes[Math.floor(Math.random() * availableShapes.length)];

        
        if (level === 3) {
            
        }

        setCurrentShape(target);

        
        
        setBins([...availableShapes].sort(() => Math.random() - 0.5));

        setFeedback('');
        setAnimateSuccess(false);
    }, [level]);

    useEffect(() => {
        setupLevel();
    }, [setupLevel]);

    const handleBinClick = (binShape) => {
        if (animateSuccess) return;

        if (binShape.id === currentShape.id) {
            
            const pointsPerRound = totalPoints / MAX_ROUNDS;
            setScore(prev => prev + pointsPerRound);
            setFeedback(t('Well done!'));
            setAnimateSuccess(true);

            setTimeout(() => {
                if (round + 1 >= MAX_ROUNDS) {
                    if (level < 3) {
                        setLevel(prev => prev + 1);
                        setRound(0);
                        setupLevel();
                    } else {
                        onComplete(score + (totalPoints / MAX_ROUNDS));
                    }
                } else {
                    setRound(prev => prev + 1);
                    setupLevel();
                }
            }, 1500);
        } else {
            setFeedback(t('Try again'));
            setTimeout(() => setFeedback(''), 1500);

            setWrongAttempts(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    setLevel(1);
                    setFeedback(t("Let's try an easier shape!"));
                    setTimeout(() => {
                        setupLevel();
                    }, 1000);
                    return 0;
                }
                return newCount;
            });
        }
    };

    return (
        <div className="shape-game-overlay">
            <div className="shape-game-container">
                <button className="close-btn" onClick={onClose} aria-label={t('Close Game')}>×</button>

                <div className="game-status">
                    <span>{t('Level')} {level}</span>
                    <span>⭐ {Math.floor(score)}</span>
                </div>

                <h2 className="instruction">
                    {isArabic ? (
                        <>
                            ضع <span className="highlight-text">{t(currentShape?.name)}</span> في المكان الصحيح!
                        </>
                    ) : (
                        <>
                            Put the <span className="highlight-text">{currentShape?.name}</span> in the correct spot!
                        </>
                    )}
                </h2>

                
                <div className={`draggable-shape-area ${animateSuccess ? 'fade-out' : ''}`}>
                    {currentShape && (
                        <div
                            className={`shape-item large ${currentShape.cssClass}`}
                            style={{ backgroundColor: currentShape.color }}
                        />
                    )}
                </div>

                
                <div className="bins-container">
                    {bins.map((bin) => (
                        <button
                            key={bin.id}
                            className="bin-drop-zone"
                            onClick={() => handleBinClick(bin)}
                            aria-label={`Sort into ${bin.name}`}
                        >
                            <div className={`bin-outline ${bin.cssClass}`}></div>
                        </button>
                    ))}
                </div>

                <div className="feedback-area">
                    {feedback}
                </div>
            </div>
        </div>
    );
};

export default ShapeSortingGame;
