import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import './FindTheToyGame.css';

const FindTheToyGame = ({ totalPoints = 30, onComplete, onClose }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [targetToy, setTargetToy] = useState(null);
  const [parentView, setParentView] = useState(false);
  const [found, setFound] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [displayToys, setDisplayToys] = useState([]);
  const [cardRevealed, setCardRevealed] = useState(false);

  const toys = [
    { id: 1, emoji: '🧸', name: 'Teddy Bear' },
    { id: 2, emoji: '🚗', name: 'Car' },
    { id: 3, emoji: '🎨', name: 'Paint Set' },
    { id: 4, emoji: '📚', name: 'Book' },
    { id: 5, emoji: '🎸', name: 'Guitar' },
    { id: 6, emoji: '⚽', name: 'Soccer Ball' },
    { id: 7, emoji: '🚂', name: 'Train' },
    { id: 8, emoji: '🎯', name: 'Target Game' },
    { id: 9, emoji: '🦕', name: 'Dinosaur' },
    { id: 10, emoji: '🎪', name: 'Circus Tent' },
    { id: 11, emoji: '🚀', name: 'Rocket' },
    { id: 12, emoji: '🎠', name: 'Carousel' },
    { id: 13, emoji: '🧩', name: 'Puzzle' },
    { id: 14, emoji: '🎲', name: 'Dice Game' },
    { id: 15, emoji: '🪁', name: 'Kite' }
  ];

  const startGame = () => {
    setGameStarted(true);
    startNewRound();
  };

  const startNewRound = () => {
    const randomToy = toys[Math.floor(Math.random() * toys.length)];
    setTargetToy(randomToy);
    setFound(false);
    setShowIncorrect(false);
    setParentView(true);
    setCardRevealed(false);
    
    
    const otherToys = toys.filter(t => t.id !== randomToy.id);
    const shuffledOthers = otherToys.sort(() => Math.random() - 0.5).slice(0, 5);
    const allDisplayToys = [randomToy, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setDisplayToys(allDisplayToys);
  };

  const handleParentReady = () => {
    setParentView(false);
  };

  const handleToyClick = (toy) => {
    if (found) return;

    if (toy.id === targetToy.id) {
      setFound(true);
      setShowIncorrect(false);
      const newScore = score + 10;
      setScore(newScore);
      setTimeout(() => {
        if (round < 5) {
          setRound(round + 1);
          startNewRound();
        } else {
          setGameComplete(true);
          const earnedPoints = Math.round(totalPoints * (newScore / 50));
          onComplete(earnedPoints, { score: newScore, rounds: 5 });
        }
      }, 2000);
    } else {
      
      setShowIncorrect(true);
      setTimeout(() => setShowIncorrect(false), 1500);
    }
  };

  if (gameComplete) {
    return (
      <div className="find-the-toy-game">
        <div className="game-complete">
          <h1>🎉 {t['Great Job!'] || 'Great Job!'}</h1>
          <div className="final-score">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-label">{t['points'] || 'points'}</span>
            </div>
          </div>
          <p>{(t['You found {count} out of 5 toys!'] || 'You found {count} out of 5 toys!').replace('{count}', score / 10)}</p>
          <button className="btn-close-game" onClick={onClose}>
            {t['Back to Games'] || 'Back to Games'}
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="find-the-toy-game">
        <div className="game-intro">
          <h1>🧸 {t['Find the Toy'] || 'Find the Toy'}</h1>
          <div className="game-rules">
            <h3>{t['How to Play:'] || 'How to Play:'}</h3>
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent:'] || 'Parent:'}</h4>
                <p>{t['You\'ll see which toy to find. Give hints to help your child!'] || 'You\'ll see which toy to find. Give hints to help your child!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child:'] || 'Child:'}</h4>
                <p>{t['Listen to hints and find the correct toy!'] || 'Listen to hints and find the correct toy!'}</p>
              </div>
            </div>
          </div>
          <button className="btn-start-game" onClick={startGame}>
            {t['Start Game'] || 'Start Game'} 🎮
          </button>
          <button className="btn-back" onClick={onClose}>
            {t['Back'] || 'Back'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="find-the-toy-game">
      <div className="game-header">
        <h2 style={{ color: '#333' }}>🧸 {t['Find the Toy'] || 'Find the Toy'}</h2>
        <div className="game-stats">
          <span className="stat">{t['Round'] || 'Round'}: {round}/5</span>
          <span className="stat">{t['Score'] || 'Score'}: {score}</span>
        </div>
      </div>

      {parentView ? (
        <div className="parent-view">
          {!cardRevealed ? (
            <div className="hidden-card" onClick={() => setCardRevealed(true)}>
              <span style={{ fontSize: '5rem' }}>🎁</span>
              <h3>{t['Click to Reveal Target Toy'] || 'Click to Reveal Target Toy'}</h3>
              <p>{t['Tap the card to see what to find!'] || 'Tap the card to see what to find!'}</p>
            </div>
          ) : (
            <div className="revealed-action">
              <div className="secret-info">
                <h3>🤫 {t['Parent Only - Don\'t Show Child!'] || 'Parent Only - Don\'t Show Child!'}</h3>
                <div className="target-toy">
                  <span className="toy-emoji">{targetToy?.emoji}</span>
                  <p>{t['Find:'] || 'Find:'} <strong>{t[targetToy?.name] || targetToy?.name}</strong></p>
                </div>
                <p className="hint-text">{t['Give hints like: "It\'s soft" or "It has wheels"'] || 'Give hints like: "It\'s soft" or "It has wheels"'}</p>
                <button className="btn-ready" onClick={handleParentReady}>
                  {t['I\'m Ready - Show Child 👍'] || 'I\'m Ready - Show Child 👍'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="child-view">
          <div className="instruction">
            <h3>{t['Find the toy! Listen to hints from your parent'] || 'Find the toy! Listen to hints from your parent'} 🎯</h3>
          </div>
          <div className="toys-grid">
            {displayToys.map((toy) => (
              <button
                key={toy.id}
                className={`toy-button ${found && toy.id === targetToy.id ? 'found' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                onClick={() => handleToyClick(toy)}
              >
                <span className="toy-emoji">{toy.emoji}</span>
                <span className="toy-name">{t[toy.name] || toy.name}</span>
              </button>
            ))}
          </div>
          {found && (
            <div className="success-message">
              <h2>{t['✅ Correct! Great job!'] || '✅ Correct! Great job!'}</h2>
            </div>
          )}
          {showIncorrect && (
            <div className="incorrect-message">
              <h2>{t['❌ Try again! Listen to the hints'] || '❌ Try again! Listen to the hints'}</h2>
            </div>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>
        ✕ {t['Exit'] || 'Exit'}
      </button>
    </div>
  );
};

export default FindTheToyGame;
