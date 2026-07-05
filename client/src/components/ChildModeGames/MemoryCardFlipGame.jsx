
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import './MemoryCardFlipGame.css';

const CARD_ITEMS = [
  { id: 'apple', emoji: '🍎', name: 'Apple' },
  { id: 'banana', emoji: '🍌', name: 'Banana' },
  { id: 'car', emoji: '🚗', name: 'Car' },
  { id: 'dog', emoji: '🐶', name: 'Dog' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant' },
  { id: 'flower', emoji: '🌸', name: 'Flower' },
  { id: 'guitar', emoji: '🎸', name: 'Guitar' },
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream' },
  { id: 'jellyfish', emoji: '🪼', name: 'Jellyfish' },
  { id: 'kite', emoji: '🪁', name: 'Kite' },
  { id: 'lion', emoji: '🦁', name: 'Lion' }
];

const DIFFICULTY_CONFIG = {
  Easy: { pairs: 3, showTime: 3000, gridCols: 3 },
  Medium: { pairs: 4, showTime: 2000, gridCols: 4 },
  Hard: { pairs: 6, showTime: 1500, gridCols: 4 }
};

const MemoryCardFlipGame = ({ onComplete, onClose, totalPoints = 30 }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;
  
  const [difficulty] = useState('Easy');

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [canFlip, setCanFlip] = useState(false);
  const [initialPreview, setInitialPreview] = useState(true);

  const MAX_ROUNDS = 3;
  const config = DIFFICULTY_CONFIG[difficulty];
  const pointsPerMatch = totalPoints / (config.pairs * MAX_ROUNDS);

  
  const initializeCards = useCallback(() => {
    const selectedItems = CARD_ITEMS.slice(0, config.pairs);
    const cardPairs = selectedItems.flatMap((item, index) => [
      { id: `${item.id}-1`, itemId: item.id, emoji: item.emoji, name: item.name },
      { id: `${item.id}-2`, itemId: item.id, emoji: item.emoji, name: item.name }
    ]);

    
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setInitialPreview(true);
    setCanFlip(false);

    
    setTimeout(() => {
      setInitialPreview(false);
      setCanFlip(true);
    }, config.showTime);
  }, [config.pairs, config.showTime]);

  useEffect(() => {
    initializeCards();
  }, [initializeCards, difficulty]);

  const handleCardClick = (index) => {
    if (!canFlip || initialPreview) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].itemId)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setCanFlip(false);

      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.itemId === secondCard.itemId) {
        
        setMatchedPairs(prev => [...prev, firstCard.itemId]);
        setScore(prev => prev + pointsPerMatch);
        setFlippedIndices([]);
        setCanFlip(true);

        
        if (matchedPairs.length + 1 === config.pairs) {
          setTimeout(() => {
            if (round + 1 >= MAX_ROUNDS) {
              onComplete(score + pointsPerMatch, { moves });
            } else {
              setRound(prev => prev + 1);
              initializeCards();
            }
          }, 1000);
        }
      } else {
        
        setTimeout(() => {
          setFlippedIndices([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-card-overlay">
      <div className="memory-card-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="game-header">
          <h2>🧠 {t['Memory Card Flip'] || 'Memory Card Flip'}</h2>
          <div className="game-info">
            <span>{t['Round'] || 'Round'} {round + 1}/{MAX_ROUNDS}</span>
            <span>{t['Moves'] || 'Moves'}: {moves}</span>
            <span>⭐ {Math.floor(score)}</span>
          </div>
        </div>

        {initialPreview && (
          <div className="preview-message">
            {t['👀 Memorize the cards!'] || '👀 Memorize the cards!'}
          </div>
        )}

        <div 
          className="cards-grid"
          style={{ gridTemplateColumns: `repeat(${config.gridCols}, 1fr)` }}
        >
          {cards.map((card, index) => {
            const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(card.itemId);
            const isMatched = matchedPairs.includes(card.itemId);
            const showCard = isFlipped || initialPreview;

            return (
              <div
                key={card.id}
                className={`card ${showCard ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="question-mark">❓</span>
                  </div>
                  <div className="card-back">
                    <span className="card-emoji">{card.emoji}</span>
                    <span className="card-name">{t[card.name] || card.name}</span>
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

export default MemoryCardFlipGame;
