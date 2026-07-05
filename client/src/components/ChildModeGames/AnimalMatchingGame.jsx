
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './AnimalMatchingGame.css';

const ANIMALS = [
  { id: 'dog', emoji: '🐶', name: 'Dog', sound: 'Woof!' },
  { id: 'cat', emoji: '🐱', name: 'Cat', sound: 'Meow!' },
  { id: 'cow', emoji: '🐮', name: 'Cow', sound: 'Moo!' },
  { id: 'duck', emoji: '🦆', name: 'Duck', sound: 'Quack!' },
  { id: 'pig', emoji: '🐷', name: 'Pig', sound: 'Oink!' },
  { id: 'horse', emoji: '🐴', name: 'Horse', sound: 'Neigh!' },
  { id: 'sheep', emoji: '🐑', name: 'Sheep', sound: 'Baa!' },
  { id: 'chicken', emoji: '🐔', name: 'Chicken', sound: 'Cluck!' },
  { id: 'frog', emoji: '🐸', name: 'Frog', sound: 'Ribbit!' },
  { id: 'lion', emoji: '🦁', name: 'Lion', sound: 'Roar!' }
];

const DIFFICULTY_CONFIG = {
  Easy: { pairs: 3, showNames: true, timeLimit: null },
  Medium: { pairs: 4, showNames: false, timeLimit: null },
  Hard: { pairs: 6, showNames: false, timeLimit: 60 }
};

const AnimalMatchingGame = ({ onComplete, onClose, totalPoints = 30 }) => {
  const { isArabic, t } = useLanguage();
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

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  const MAX_ROUNDS = 3;
  const config = DIFFICULTY_CONFIG[difficulty];
  const pointsPerMatch = totalPoints / (config.pairs * MAX_ROUNDS);

  
  const initializeCards = useCallback(() => {
    const selectedAnimals = ANIMALS.slice(0, config.pairs);
    const cardPairs = selectedAnimals.flatMap(animal => [
      { id: `${animal.id}-1`, animalId: animal.id, emoji: animal.emoji, isFlipped: false },
      { id: `${animal.id}-2`, animalId: animal.id, emoji: animal.emoji, isFlipped: false }
    ]);

    
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setCanFlip(true);
    
    if (config.timeLimit) {
      setTimeLeft(config.timeLimit);
    } else {
      setTimeLeft(null);
    }
  }, [config.pairs, config.timeLimit]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards, difficulty]);

  
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCardClick = (card) => {
    if (!canFlip || card.isFlipped || matchedPairs.includes(card.animalId)) return;

    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    
    setCards(prev => prev.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setCanFlip(false);
      
      const [first, second] = newFlipped;
      
      if (first.animalId === second.animalId) {
        
        recordAnswer(true, `animal_${first.animalId}`);
        
        setMatchedPairs(prev => [...prev, first.animalId]);
        setScore(prev => prev + pointsPerMatch);
        setFlippedCards([]);
        setCanFlip(true);

        
        if (matchedPairs.length + 1 === config.pairs) {
          setTimeout(() => {
            if (round + 1 >= MAX_ROUNDS) {
              onComplete(score + pointsPerMatch, {
                achieved: getAccuracy(),
                difficulty,
                totalAttempts: matchedPairs.length + 1
              });
            } else {
              setRound(prev => prev + 1);
              initializeCards();
            }
          }, 1000);
        }
      } else {
        
        recordAnswer(false, 'animal_matching');
        
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === first.id || c.id === second.id) 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  const getAnimalName = (animalId) => {
    const animal = ANIMALS.find(a => a.id === animalId);
    return animal ? t(animal.name) : '';
  };

  return (
    <div className="animal-matching-overlay">
      <div className="animal-matching-container">
        <button className="close-btn" onClick={onClose} aria-label={t('Close Game')}>×</button>

        <div className="game-header">
          <h2>🐾 {t('Animal Matching')}</h2>
          <div className="game-info">
            <span>{t('Round')} {round + 1}/{MAX_ROUNDS}</span>
            <span>⭐ {Math.floor(score)}</span>
            {timeLeft !== null && <span className="timer">⏱️ {timeLeft}s</span>}
          </div>
        </div>

        <AdaptiveFeedbackChild
          difficulty={difficulty}
          feedback={feedback}
          feedbackType={feedbackType}
          showFeedback={showFeedback}
          stats={stats}
        />

        <div className="cards-grid" style={{ 
          gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)` 
        }}>
          {cards.map((card) => {
            const isMatched = matchedPairs.includes(card.animalId);
            const isFlipped = card.isFlipped;
            
            return (
              <div
                key={card.id}
                className={`card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="card-back-icon">❓</span>
                  </div>
                  <div className="card-back">
                    <span className="animal-emoji">{card.emoji}</span>
                    {config.showNames && (
                      <span className="animal-name">{getAnimalName(card.animalId)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimalMatchingGame;
