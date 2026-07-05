import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import '../CooperativeGames.css';

const GuessEmotionGame = ({ totalPoints = 30, onComplete, onClose }) => {
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

  const emotions = [
    { emoji: '😊', name: 'Happy', color: '#4CAF50', hint: 'When you get a treat!' },
    { emoji: '😢', name: 'Sad', color: '#2196F3', hint: 'When your toy breaks' },
    { emoji: '😠', name: 'Angry', color: '#F44336', hint: 'When someone takes your stuff' },
    { emoji: '😨', name: 'Scared', color: '#9C27B0', hint: 'During thunderstorms' },
    { emoji: '😲', name: 'Surprised', color: '#FF9800', hint: 'Birthday party surprise!' },
    { emoji: '😴', name: 'Tired', color: '#795548', hint: 'After playing all day' },
    { emoji: '🥰', name: 'Love', color: '#E91E63', hint: 'Hugging mommy' },
    { emoji: '😎', name: 'Cool', color: '#00BCD4', hint: 'Wearing sunglasses' },
    { emoji: '🤔', name: 'Thinking', color: '#607D8B', hint: 'Solving a puzzle' },
    { emoji: '😋', name: 'Yummy', color: '#8BC34A', hint: 'Eating ice cream' },
    { emoji: '🤗', name: 'Hugging', color: '#FF5722', hint: 'Big warm hugs' },
    { emoji: '😤', name: 'Frustrated', color: '#CDDC39', hint: 'Cannot open a jar' }
  ];

  const [currentEmotion, setCurrentEmotion] = useState(null);

  const startGame = () => {
    setGameStarted(true);
    nextRound();
  };

  const nextRound = () => {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(emotion);
    setShowingToParent(true);
    setCardRevealed(false);
  };

  const handleGuess = (emotion) => {
    if (emotion.name === currentEmotion.name) {
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
          <h1>🎉 {t['Amazing!'] || 'Amazing!'}</h1>
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
          <h1>😊 {t['Guess the Emotion'] || 'Guess the Emotion'}</h1>
          <div className="game-rules">
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent:'] || 'Parent:'}</h4>
                <p>{t['Make the facial expression shown. Be dramatic!'] || 'Make the facial expression shown. Be dramatic!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child:'] || 'Child:'}</h4>
                <p>{t['Watch your parent\'s face and guess the emotion!'] || 'Watch your parent\'s face and guess the emotion!'}</p>
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
        <h2 style={{ color: '#333' }}>😊 {t['Guess the Emotion'] || 'Guess the Emotion'}</h2>
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
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🎭</span>
              <h3 style={{ color: 'white', margin: '0' }}>
                {t['Click to Reveal Emotion'] || 'Click to Reveal Emotion'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontSize: '1rem' }}>
                {t['See which face to make'] || 'See which face to make'}
              </p>
            </div>
          ) : (
            <div className="revealed-action">
              <div className="emotion-display" style={{ background: currentEmotion?.color, padding: '30px', borderRadius: '16px', margin: '20px 0' }}>
                <span className="big-emoji" style={{ fontSize: '5rem' }}>{currentEmotion?.emoji}</span>
                <h3 style={{ color: 'white', margin: '10px 0' }}>
                  {t['Make this face:'] || 'Make this face:'} <strong>{t[currentEmotion?.name] || currentEmotion?.name}</strong>
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                  {t['Hint:'] || 'Hint:'} {t[currentEmotion?.hint] || currentEmotion?.hint}
                </p>
              </div>
              <button className="btn-ready" onClick={() => setShowingToParent(false)}>
                {t['I\'m Making the Face! Show Child 👍'] || 'I\'m Making the Face! Show Child 👍'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="child-view">
          <h3>{t['What emotion is your parent making?'] || 'What emotion is your parent making?'}</h3>
          <div className="emotions-grid">
            {emotions.map((emotion) => (
              <button key={emotion.name} className={`emotion-button ${showIncorrect ? 'incorrect' : ''}`} onClick={() => handleGuess(emotion)}>
                <span className="emoji">{emotion.emoji}</span>
                <span>{t[emotion.name] || emotion.name}</span>
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
              <h2>{t['❌ Try again! Watch carefully'] || '❌ Try again! Watch carefully'}</h2>
            </div>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>✕</button>
    </div>
  );
};

export default GuessEmotionGame;
