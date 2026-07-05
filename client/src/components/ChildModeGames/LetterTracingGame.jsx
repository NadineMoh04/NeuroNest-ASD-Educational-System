
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './LetterTracingGame.css';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const DIFFICULTY_CONFIG = {
    Easy: {
        letters: LETTERS.slice(0, 10),
        showGuide: true,
        strokeWidth: 20,
        allowMistakes: true,
        accuracyThreshold: 30 
    },
    Medium: {
        letters: LETTERS.slice(0, 20),
        showGuide: true,
        strokeWidth: 15,
        allowMistakes: true,
        accuracyThreshold: 40
    },
    Hard: {
        letters: LETTERS,
        showGuide: false,
        strokeWidth: 10,
        allowMistakes: false,
        accuracyThreshold: 50
    }
};

const LetterTracingGame = ({ onComplete, onClose, totalPoints = 30 }) => {
    const { isArabic } = useLanguage();
    const t = isArabic ? translations.ar : translations.en;

    const {
        difficulty,
        feedback: adaptiveFeedback,
        feedbackType,
        showFeedback,
        stats,
        recordAnswer,
        getAccuracy
    } = useChildModeAdaptive({
        initialDifficulty: 'Easy',
        consecutiveThreshold: 3
    });

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLetter, setCurrentLetter] = useState('');
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [tracingComplete, setTracingComplete] = useState(false);
    const [letterAttempts, setLetterAttempts] = useState(0);
    const [drawingStarted, setDrawingStarted] = useState(false);
    const [showingResult, setShowResult] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const MAX_ROUNDS = 5;
    const config = DIFFICULTY_CONFIG[difficulty];
    const pointsPerLetter = totalPoints / MAX_ROUNDS;

    const canvasSize = 300;
    const letterSize = 200;

    
    const selectNewLetter = useCallback(() => {
        const randomLetter = config.letters[Math.floor(Math.random() * config.letters.length)];
        setCurrentLetter(randomLetter);
        setTracingComplete(false);
        setLetterAttempts(0);
        clearCanvas();
    }, [config.letters]);

    useEffect(() => {
        selectNewLetter();
    }, [selectNewLetter, difficulty]);

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvasSize, canvasSize);
        }
    };

    const getCanvasCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        if (!drawingStarted) {
            setDrawingStarted(true);
        }
        const { x, y } = getCanvasCoordinates(e);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;

        const { x, y } = getCanvasCoordinates(e);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = config.strokeWidth;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#667eea';
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        
    };

    
    const checkLetterAccuracy = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        
        const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
        const pixels = imageData.data;
        let coloredPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] > 0) { 
                coloredPixels++;
            }
        }

        
        const totalCanvasPixels = canvasSize * canvasSize;
        const letterArea = totalCanvasPixels * 0.15; 
        const coveragePercent = (coloredPixels / letterArea) * 100;

        
        const isAccurate = coveragePercent >= config.accuracyThreshold;
        
        return {
            isAccurate,
            coveragePercent: Math.min(coveragePercent, 100),
            coloredPixels
        };
    };

    const handleTracingComplete = () => {
        if (tracingComplete || showingResult) return;

        
        if (!drawingStarted) {
            setResultMessage('✏️ Please trace the letter first!');
            setShowResult(true);
            setTimeout(() => setShowResult(false), 2000);
            return;
        }

        
        const accuracy = checkLetterAccuracy();
        const isLetterCorrect = accuracy.isAccurate;
        
        
        recordAnswer(isLetterCorrect, `letter_${currentLetter}`);
        
        setIsCorrect(isLetterCorrect);
        setTracingComplete(true);
        setShowResult(true);

        if (isLetterCorrect) {
            setScore(prev => prev + pointsPerLetter);
            setResultMessage('⭐ Great job! Letter traced perfectly!');
        } else {
            setResultMessage('💙 Good try! Let\'s practice more!');
        }

        
        setTimeout(() => {
            setShowResult(false);
            
            if (round + 1 >= MAX_ROUNDS) {
                
                onComplete(score + (isLetterCorrect ? pointsPerLetter : 0), {
                    achieved: getAccuracy(),
                    difficulty,
                    totalAttempts: round + 1
                });
            } else {
                setRound(prev => prev + 1);
                selectNewLetter();
                setDrawingStarted(false);
            }
        }, 3000);
    };

    const handleRetry = () => {
        setLetterAttempts(prev => prev + 1);
        clearCanvas();
    };

    return (
        <div className="letter-tracing-overlay">
            <div className="letter-tracing-container">
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="game-header">
                    <h2>✏️ {t['Letter Tracing'] || 'Letter Tracing'}</h2>
                    <div className="game-info">
                        <span>{t['Difficulty'] || 'Difficulty'}: {t[difficulty] || difficulty}</span>
                        <span>{t['Letter'] || 'Letter'} {round + 1}/{MAX_ROUNDS}</span>
                        <span>⭐ {Math.floor(score)}</span>
                    </div>
                </div>

                <AdaptiveFeedbackChild
                    difficulty={difficulty}
                    feedback={adaptiveFeedback}
                    feedbackType={feedbackType}
                    showFeedback={showFeedback}
                    stats={stats}
                />

                <div className="tracing-area">
                    <div className="letter-display">
                        <h3>{t['Trace the letter:'] || 'Trace the letter:'}</h3>
                        <div className="current-letter">{currentLetter}</div>
                    </div>

                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        className="tracing-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />

                    {config.showGuide && (
                        <div className="letter-guide">
                            <svg width={canvasSize} height={canvasSize} className="guide-overlay">
                                <text
                                    x={canvasSize / 2}
                                    y={canvasSize / 2}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={letterSize}
                                    fontFamily="Arial"
                                    fill="rgba(255, 255, 255, 0.3)"
                                    stroke="rgba(255, 255, 255, 0.5)"
                                    strokeWidth="2"
                                >
                                    {currentLetter}
                                </text>
                            </svg>
                        </div>
                    )}
                </div>

                
                {showingResult && (
                    <div className={`result-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {t[resultMessage] || resultMessage}
                    </div>
                )}

                <div className="tracing-controls">
                    <button className="control-btn clear" onClick={clearCanvas}>
                        🗑️ {t['Clear'] || 'Clear'}
                    </button>
                    <button className="control-btn retry" onClick={handleRetry}>
                        🔄 {t['Try Again'] || 'Try Again'}
                    </button>
                    <button className="control-btn complete" onClick={handleTracingComplete}>
                        ✅ {t['Done'] || 'Done'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LetterTracingGame;
