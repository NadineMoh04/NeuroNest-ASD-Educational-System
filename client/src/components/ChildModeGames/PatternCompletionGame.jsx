
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './PatternCompletionGame.css';

const SHAPES = [
  { id: 'circle', emoji: '🔴', name: 'Circle', color: '#FF6B6B' },
  { id: 'square', emoji: '🟦', name: 'Square', color: '#4ECDC4' },
  { id: 'triangle', emoji: '🔺', name: 'Triangle', color: '#FFE66D' },
  { id: 'star', emoji: '⭐', name: 'Star', color: '#FFA07A' },
  { id: 'heart', emoji: '❤️', name: 'Heart', color: '#FF69B4' },
  { id: 'diamond', emoji: '💎', name: 'Diamond', color: '#95E1D3' }
];

const COLORS = [
  { id: 'red', name: 'Red', hex: '#FF6B6B' },
  { id: 'blue', name: 'Blue', hex: '#4ECDC4' },
  { id: 'yellow', name: 'Yellow', hex: '#FFE66D' },
  { id: 'green', name: 'Green', hex: '#95E1D3' },
  { id: 'purple', name: 'Purple', hex: '#C7CEEA' }
];

const DIFFICULTY_CONFIG = {
  Easy: { 
    patternLength: 4, 
    showPatternTime: 3000,
    options: 3,
    patternType: 'shape'
  },
  Medium: { 
    patternLength: 5, 
    showPatternTime: 2500,
    options: 4,
    patternType: 'color'
  },
  Hard: { 
    patternLength: 6, 
    showPatternTime: 2000,
    options: 5,
    patternType: 'mixed'
  }
};

const PatternCompletionGame = ({ onComplete, onClose, totalPoints = 30 }) => {
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

  const [pattern, setPattern] = useState([]);
  const [displayPattern, setDisplayPattern] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [showingPattern, setShowingPattern] = useState(true);
  const [userAnswer, setUserAnswer] = useState(null);

  const MAX_ROUNDS = 10;
  const config = DIFFICULTY_CONFIG[difficulty];
  const pointsPerRound = totalPoints / MAX_ROUNDS;

  
  const generatePattern = useCallback(() => {
    let items;
    if (config.patternType === 'shape') {
      items = SHAPES;
    } else if (config.patternType === 'color') {
      items = COLORS;
    } else {
      items = SHAPES;
    }

    
    const fullPattern = [];
    for (let i = 0; i < config.patternLength; i++) {
      fullPattern.push(items[Math.floor(Math.random() * items.length)]);
    }

    
    const answer = fullPattern[fullPattern.length - 1];
    const patternToShow = fullPattern.slice(0, -1);

    setPattern(fullPattern);
    setDisplayPattern(patternToShow);
    setCorrectAnswer(answer);

    
    let optionItems = [answer];
    while (optionItems.length < config.options) {
      const random = items[Math.floor(Math.random() * items.length)];
      if (!optionItems.find(o => o.id === random.id)) {
        optionItems.push(random);
      }
    }

    setOptions(optionItems.sort(() => Math.random() - 0.5));
    setShowingPattern(true);
    setUserAnswer(null);

    
    setTimeout(() => {
      setShowingPattern(false);
    }, config.showPatternTime);
  }, [config]);

  useEffect(() => {
    generatePattern();
  }, [generatePattern, difficulty]);

  const handleAnswer = (selectedItem) => {
    if (userAnswer) return; 
    
    setUserAnswer(selectedItem.id);
    const isCorrect = selectedItem.id === correctAnswer.id;
    
    
    recordAnswer(isCorrect, `pattern_${config.patternType}`);

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
        generatePattern();
      }
    }, 2000);
  };

  const renderItem = (item, index, isQuestionMark = false) => {
    if (isQuestionMark || !item) {
      return (
        <div key={`question-${index}`} className="pattern-item question">
          <span className="question-mark">❓</span>
        </div>
      );
    }

    return (
      <div
        key={`${item.id}-${index}`}
        className="pattern-item"
        style={{ backgroundColor: item.color || item.hex || '#667eea' }}
      >
        {item.emoji && <span className="item-emoji">{item.emoji}</span>}
        <span className="item-name">{t[item.name] || item.name}</span>
      </div>
    );
  };

  return (
    <div className="pattern-completion-overlay">
      <div className="pattern-completion-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="game-header">
          <h2>🔷 {t['Pattern Completion'] || 'Pattern Completion'}</h2>
          <div className="game-info">
            <span>{t['Round'] || 'Round'} {round + 1}/{MAX_ROUNDS}</span>
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

        <div className="pattern-display">
          <div className="instruction">
            {showingPattern ? (t['Watch the pattern!'] || 'Watch the pattern!') : (t['What comes next?'] || 'What comes next?')}
          </div>

          <div className="pattern-sequence">
            {displayPattern.map((item, index) => renderItem(item, index))}
            {showingPattern && renderItem(correctAnswer, displayPattern.length)}
            {!showingPattern && renderItem(null, displayPattern.length, true)}
          </div>
        </div>

        {!showingPattern && (
          <>
            <div className="question-text">
              {t['Choose the missing piece:'] || 'Choose the missing piece:'}
            </div>

            <div className="options-grid">
              {options.map((option) => {
                const isSelected = userAnswer === option.id;
                const isCorrect = option.id === correctAnswer.id;
                const showResult = userAnswer !== null;

                return (
                  <button
                    key={option.id}
                    className={`pattern-option ${isSelected ? 'selected' : ''} ${showResult && isCorrect ? 'correct' : ''}`}
                    onClick={() => handleAnswer(option)}
                    disabled={userAnswer !== null}
                  >
                    {option.emoji && <span className="option-emoji">{option.emoji}</span>}
                    <span className="option-name">{t[option.name] || option.name}</span>
                    <div className="option-color" style={{ backgroundColor: option.color || option.hex }} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatternCompletionGame;
