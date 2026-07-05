import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import '../CooperativeGames.css';

const SoundAndGuessGame = ({ totalPoints = 30, onComplete, onClose }) => {
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

  const sounds = [
    { emoji: '🐶', name: 'Dog', sound: 'Woof! Woof!', color: '#ff6b6b' },
    { emoji: '🐱', name: 'Cat', sound: 'Meow!', color: '#4ecdc4' },
    { emoji: '🐮', name: 'Cow', sound: 'Moo!', color: '#95e1d3' },
    { emoji: '🦆', name: 'Duck', sound: 'Quack! Quack!', color: '#6c5ce7' },
    { emoji: '🐓', name: 'Rooster', sound: 'Cock-a-doodle-doo!', color: '#fd79a8' },
    { emoji: '🐑', name: 'Sheep', sound: 'Baa!', color: '#00b894' },
    { emoji: '🐷', name: 'Pig', sound: 'Oink! Oink!', color: '#e17055' },
    { emoji: '🦁', name: 'Lion', sound: 'Roar!', color: '#fdcb6e' },
    { emoji: '🐴', name: 'Horse', sound: 'Neigh!', color: '#a29bfe' },
    { emoji: '🦉', name: 'Owl', sound: 'Hoo! Hoo!', color: '#74b9ff' },
    { emoji: '🐝', name: 'Bee', sound: 'Buzz! Buzz!', color: '#ffeaa7' },
    { emoji: '🦈', name: 'Shark', sound: 'Dun! Dun!', color: '#636e72' },
    { emoji: '🐘', name: 'Elephant', sound: 'Toot! Toot!', color: '#b2bec3' },
    { emoji: '🦜', name: 'Parrot', sound: 'Squawk!', color: '#00cec9' },
    { emoji: '🐺', name: 'Wolf', sound: 'Awooo!', color: '#dfe6e9' }
  ];

  const [currentSound, setCurrentSound] = useState(null);

  const startGame = () => {
    setGameStarted(true);
    nextRound();
  };

  const nextRound = () => {
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    setCurrentSound(sound);
    setShowingToParent(true);
    setShowIncorrect(false);
    setCardRevealed(false);
  };

  const handleGuess = (sound) => {
    if (sound.name === currentSound.name) {
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
      setTimeout(() => setShowIncorrect(false), 1500);
    }
  };

  if (gameComplete) {
    return (
      <div className="cooperative-game">
        <div className="game-complete">
          <h1>🎵 {t['Excellent Listening!'] || 'Excellent Listening!'}</h1>
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
          <h1>🔊 {t['Sound & Guess'] || 'Sound & Guess'}</h1>
          <div className="game-rules">
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent:'] || 'Parent:'}</h4>
                <p>{t['You\'ll hear a sound. Imitate it for your child!'] || 'You\'ll hear a sound. Imitate it for your child!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child:'] || 'Child:'}</h4>
                <p>{t['Listen to the sound your parent makes and guess what it is!'] || 'Listen to the sound your parent makes and guess what it is!'}</p>
              </div>
            </div>
          </div>
          <button className="btn-start-game" onClick={startGame}>{t['Start Game'] || 'Start Game'} 🎮</button>
          <button className="btn-back" onClick={onClose}>{t['Back'] || 'Back'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cooperative-game">
      <div className="game-header">
        <h2 style={{ color: '#333' }}>🔊 {t['Sound & Guess'] || 'Sound & Guess'}</h2>
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
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🔊</span>
              <h3 style={{ color: 'white', margin: '0' }}>
                {t['Click to Reveal Sound'] || 'Click to Reveal Sound'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontSize: '1rem' }}>
                {t['See which sound to make'] || 'See which sound to make'}
              </p>
            </div>
          ) : (
            <div className="revealed-action">
              <div className="sound-display" style={{ background: currentSound?.color, padding: '30px', borderRadius: '16px', margin: '20px 0' }}>
                <span className="big-emoji" style={{ fontSize: '5rem' }}>{currentSound?.emoji}</span>
                <h3 style={{ color: 'white', margin: '10px 0' }}>
                  {t['Imitate:'] || 'Imitate:'} <strong>{t[currentSound?.name] || currentSound?.name}</strong>
                </h3>
                <p className="sound-text" style={{ color: 'rgba(255,255,255,0.95)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {t['Say:'] || 'Say:'} "{t[currentSound?.sound] || currentSound?.sound}"
                </p>
              </div>
              <button className="btn-ready" onClick={() => setShowingToParent(false)}>
                {t['I Made the Sound! Let Child Guess 👍'] || 'I Made the Sound! Let Child Guess 👍'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="child-view">
          <h3>{t['What sound did your parent make?'] || 'What sound did your parent make?'} 🎵</h3>
          <div className="sounds-grid">
            {sounds.map((sound) => (
              <button key={sound.name} className={`sound-button ${showIncorrect ? 'incorrect' : ''}`} onClick={() => handleGuess(sound)}>
                <span className="emoji">{sound.emoji}</span>
                <span>{t[sound.name] || sound.name}</span>
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
              <h2>{t['❌ Try again! Listen carefully'] || '❌ Try again! Listen carefully'}</h2>
            </div>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>✕</button>
    </div>
  );
};

export default SoundAndGuessGame;
