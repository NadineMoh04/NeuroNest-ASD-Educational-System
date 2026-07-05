
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './CountingObjectsGame.css';

const COUNTING_ITEMS = [
  { emoji: '🍎', name: 'Apple' },
  { emoji: '🍌', name: 'Banana' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🚗', name: 'Car' },
  { emoji: '🌸', name: 'Flower' },
  { emoji: '⚽', name: 'Ball' },
  { emoji: '🍪', name: 'Cookie' },
  { emoji: '🎈', name: 'Balloon' }
];

const DIFFICULTY_CONFIG = {
  Easy: { 
    minCount: 1, 
    maxCount: 5, 
    showNumbers: true,
    itemSize: 'large'
  },
  Medium: { 
    minCount: 3, 
    maxCount: 10, 
    showNumbers: false,
    itemSize: 'medium'
  },
  Hard: { 
    minCount: 5, 
    maxCount: 15, 
    showNumbers: false,
    itemSize: 'small'
  }
};

const CountingObjectsGame = ({ onComplete, onClose, totalPoints = 30 }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const {
    difficulty,
    feedback,
    feedbackType,
    showFeedback,
    stats,
    recordAnswer,
    getAccuracy
  } = useChildModeAdaptive({
    initialDifficulty: 'Easy',
    consecutiveThreshold: 3
  });

  const [objects, setObjects] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const MAX_ROUNDS = 10;
  const config = DIFFICULTY_CONFIG[difficulty];
  const pointsPerRound = totalPoints / MAX_ROUNDS;

  
  const generateQuestion = useCallback(() => {
    
    const count = Math.floor(Math.random() * (config.maxCount - config.minCount + 1)) + config.minCount;
    setCorrectCount(count);

    
    const itemType = COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)];
    
    
    const objectsArray = Array(count).fill(itemType);
    setObjects(objectsArray);

    
    let answerOptions = [count];
    while (answerOptions.length < 4) {
      const random = Math.floor(Math.random() * (config.maxCount + 2)) + 1;
      if (!answerOptions.includes(random) && random > 0) {
        answerOptions.push(random);
      }
    }

    setOptions(answerOptions.sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
  }, [config]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion, difficulty]);

  const handleAnswer = (selectedNumber) => {
    if (selectedAnswer !== null) return; 
    
    setSelectedAnswer(selectedNumber);
    const isCorrect = selectedNumber === correctCount;
    
    
    recordAnswer(isCorrect, 'counting');

    if (isCorrect) {
      setScore(prev => prev + pointsPerRound);
    }

    setTimeout(() => {
      if (round + 1 >= MAX_ROUNDS) {
        onComplete(score + (isCorrect ? pointsPerRound : 0), {
          achieved: getAccuracy(),
          difficulty,
          totalAttempts: round + 1
        });
      } else {
        setRound(prev => prev + 1);
        generateQuestion();
      }
    }, 2000);
  };

  const getItemSize = () => {
    switch (config.itemSize) {
      case 'large': return 4;
      case 'medium': return 3;
      case 'small': return 2.5;
      default: return 3;
    }
  };

  return (
    <div className="counting-objects-overlay">
      <div className="counting-objects-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="game-header">
          <h2>🍎 {t['Counting Objects'] || 'Counting Objects'}</h2>
          <div className="game-info">
            <span>{t['Question'] || 'Question'} {round + 1}/{MAX_ROUNDS}</span>
            <span>⭐ {Math.floor(score)}</span>
          </div>
        </div>

        <AdaptiveFeedbackChild
          difficulty={difficulty}
          feedback={feedback}
          feedbackType={feedbackType}
          showFeedback={showFeedback}
          stats={stats}
        />

        <div className="counting-area">
          <div className="instruction">
            {t['How many'] || 'How many'} {t[objects[0]?.name] || objects[0]?.name || t['objects']} {t['do you see?'] || 'do you see?'}
          </div>

          <div className="objects-display">
            {objects.map((obj, index) => (
              <div
                key={index}
                className="counting-object"
                style={{ fontSize: `${getItemSize()}rem` }}
              >
                {obj.emoji}
              </div>
            ))}
          </div>

          {config.showNumbers && (
            <div className="number-hint">
              {t['Count them one by one! 👆'] || 'Count them one by one! 👆'}
            </div>
          )}
        </div>

        <div className="question-text">
          {t['Select the correct number:'] || 'Select the correct number:'}
        </div>

        <div className="options-grid">
          {options.map((number) => {
            const isSelected = selectedAnswer === number;
            const isCorrect = number === correctCount;
            const showResult = selectedAnswer !== null;

            return (
              <button
                key={number}
                className={`count-option ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''}`}
                onClick={() => handleAnswer(number)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-number">{number}</span>
                {showResult && isCorrect && <span className="result-icon">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="result-icon wrong">✗</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountingObjectsGame;
