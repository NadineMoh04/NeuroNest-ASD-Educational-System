import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import '../CooperativeGames.css';

const BuildTogetherGame = ({ totalPoints = 30, onComplete, onClose }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showingToParent, setShowingToParent] = useState(true);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const patterns = [
    { name: 'Red Tower', pieces: ['🔴', '🔴', '🔴'], color: '#ff6b6b' },
    { name: 'Blue Stack', pieces: ['🔵', '🔵', '🔵'], color: '#4ecdc4' },
    { name: 'Mixed Rainbow', pieces: ['🔴', '🟡', '🔵'], color: '#95e1d3' },
    { name: 'Green Row', pieces: ['🟢', '🟢', '🟢'], color: '#6c5ce7' },
    { name: 'Color Mix', pieces: ['🟣', '🟠', '🟢'], color: '#fd79a8' },
    { name: 'Purple Line', pieces: ['🟣', '🟣', '🟣'], color: '#a29bfe' },
    { name: 'Orange Stack', pieces: ['🟠', '🟠', '🟠'], color: '#fdcb6e' },
    { name: 'Yellow Tower', pieces: ['🟡', '🟡', '🟡'], color: '#ffeaa7' },
    { name: 'Rainbow Mix', pieces: ['🔴', '🟢', '🔵'], color: '#55efc4' },
    { name: 'Warm Colors', pieces: ['🔴', '🟠', '🟡'], color: '#fab1a0' },
    { name: 'Cool Colors', pieces: ['🔵', '🟢', '🟣'], color: '#81ecec' },
    { name: 'Pink Pattern', pieces: ['🩷', '🩷', '🩷'], color: '#ff7675' }
  ];

  const [currentPattern, setCurrentPattern] = useState(null);
  const [placedPieces, setPlacedPieces] = useState([]);

  const startGame = () => {
    setGameStarted(true);
    nextRound();
  };

  const nextRound = () => {
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    setCurrentPattern(pattern);
    setPlacedPieces([]);
    setShowingToParent(true);
    setShowIncorrect(false);
    setCardRevealed(false);
  };

  const placePiece = (piece) => {
    const newPieces = [...placedPieces, piece];
    setPlacedPieces(newPieces);

    if (newPieces.length === currentPattern.pieces.length) {
      const correct = JSON.stringify(newPieces) === JSON.stringify(currentPattern.pieces);
      if (correct) {
        const newScore = score + 10;
        setScore(newScore);
        setShowIncorrect(false);
        setShowCorrect(true);

        
        setTimeout(() => {
          setShowCorrect(false);
          if (round < 5) {
            setRound(round + 1);
            nextRound();
          } else {
            setGameComplete(true);
            const earnedPoints = Math.round(totalPoints * (newScore / 50));
            onComplete(earnedPoints, { score: newScore, rounds: 5 });
          }
        }, 2000);
      } else {
        
        setShowIncorrect(true);
        setTimeout(() => {
          setShowIncorrect(false);
          setPlacedPieces([]);  
        }, 1500);
      }
    }
  };

  if (gameComplete) {
    return (
      <div className="cooperative-game">
        <div className="game-complete">
          <h1>🏗️ {t['Great Building!'] || 'Great Building!'}</h1>
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-label">{t['points'] || 'points'}</span>
          </div>
          <button className="btn-close-game" onClick={onClose}>{t['Back to Games'] || 'Back to Games'}</button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="cooperative-game">
        <div className="game-intro">
          <h1>🧩 {t['Build Together'] || 'Build Together'}</h1>
          <div className="game-rules">
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent:'] || 'Parent:'}</h4>
                <p>{t['You\'ll see the pattern. Describe where each piece goes!'] || 'You\'ll see the pattern. Describe where each piece goes!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child:'] || 'Child:'}</h4>
                <p>{t['Listen and place the pieces in the right order!'] || 'Listen and place the pieces in the right order!'}</p>
              </div>
            </div>
          </div>
          <button className="btn-start-game" onClick={startGame}>{t['Start Game'] || 'Start Game'} 🎮</button>
          <button className="btn-back" onClick={onClose}>{t['Back'] || 'Back'}</button>
        </div>
      </div>
    );
  }

  const allPieces = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];

  return (
    <div className="cooperative-game">
      <div className="game-header">
        <h2 style={{ color: '#333' }}>🧩 {t['Build Together'] || 'Build Together'}</h2>
        <div className="game-stats">
          <span className="stat">{t['Round'] || 'Round'}: {round}/5</span>
          <span className="stat">{t['Score'] || 'Score'}: {score}</span>
        </div>
      </div>

      {showingToParent ? (
        <div className="parent-view">
          <h3>🤫 {t['Parent Only - Don\'t Show Child!'] || 'Parent Only - Don\'t Show Child!'}</h3>
          
          {!cardRevealed ? (
            <div 
              className="hidden-card" 
              onClick={() => setCardRevealed(true)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '60px 40px',
                borderRadius: '20px',
                margin: '20px auto',
                maxWidth: '400px',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.3s ease'
              }}
            >
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🧩</span>
              <h3 style={{ color: 'white', margin: '0' }}>
                {t['Click to Reveal Pattern'] || 'Click to Reveal Pattern'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontSize: '1rem' }}>
                {t['See which pattern to build'] || 'See which pattern to build'}
              </p>
            </div>
          ) : (
            <div className="revealed-action">
              <div className="pattern-display" style={{ background: currentPattern?.color, padding: '30px', borderRadius: '16px', margin: '20px 0' }}>
                <h4 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '15px' }}>{t[currentPattern?.name] || currentPattern?.name}</h4>
                <div className="pieces-row">
                  {currentPattern?.pieces.map((piece, i) => (
                    <span key={i} className="big-emoji" style={{ fontSize: '4rem' }}>{piece}</span>
                  ))}
                </div>
              </div>
              <button className="btn-ready" onClick={() => setShowingToParent(false)}>
                {t['I\'m Ready to Guide! Show Child 👍'] || 'I\'m Ready to Guide! Show Child 👍'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="child-view">
          <h3>{t['Build the pattern! Listen to your parent\'s instructions'] || 'Build the pattern! Listen to your parent\'s instructions'} 🎯</h3>
          <div className="current-build">
            <h4>{t['Your Build'] || 'Your Build'}:</h4>
            <div className="pieces-row">
              {placedPieces.map((piece, i) => (
                <span key={i} className="big-emoji">{piece}</span>
              ))}
              {Array(3 - placedPieces.length).fill(null).map((_, i) => (
                <span key={`empty-${i}`} className="empty-slot">❓</span>
              ))}
            </div>
          </div>
          <div className="pieces-grid">
            {allPieces.map((piece) => (
              <button key={piece} className={`piece-button ${showIncorrect ? 'incorrect' : ''}`} onClick={() => placePiece(piece)}>
                <span className="big-emoji">{piece}</span>
              </button>
            ))}
          </div>
          {showCorrect && (
            <div className="success-message">
              <h2>{t['✅ Correct! Great job!'] || '✅ Correct! Great job!'}</h2>
            </div>
          )}
          {showIncorrect && (
            <div className="incorrect-message">
              <h2>{t['❌ Not quite! Listen to the hints'] || '❌ Not quite! Listen to the hints'}</h2>
            </div>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>✕</button>
    </div>
  );
};

export default BuildTogetherGame;
