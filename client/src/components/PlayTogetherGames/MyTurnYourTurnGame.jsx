import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import '../CooperativeGames.css';

const MyTurnYourTurnGame = ({ totalPoints = 30, onComplete, onClose }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isParentTurn, setIsParentTurn] = useState(true);
  const [completedActions, setCompletedActions] = useState(0);
  const [showingToParent, setShowingToParent] = useState(true);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const actions = [
    { emoji: '👏', name: 'Clap Hands', turn: 'parent' },
    { emoji: '🎵', name: 'Sing a Note', turn: 'child' },
    { emoji: '🕺', name: 'Dance Move', turn: 'parent' },
    { emoji: '🙈', name: 'Cover Eyes', turn: 'child' },
    { emoji: '👋', name: 'Wave Hello', turn: 'parent' },
    { emoji: '🦘', name: 'Jump Up', turn: 'child' },
    { emoji: '🎺', name: 'Pretend Trumpet', turn: 'parent' },
    { emoji: '🐸', name: 'Frog Jump', turn: 'child' },
    { emoji: '👍', name: 'Thumbs Up', turn: 'parent' },
    { emoji: '🎸', name: 'Air Guitar', turn: 'child' },
    { emoji: '🤸', name: 'Spin Around', turn: 'parent' },
    { emoji: '🐘', name: 'Elephant Trunk', turn: 'child' },
    { emoji: '🙌', name: 'High Five!', turn: 'parent' },
    { emoji: '🐧', name: 'Waddle Walk', turn: 'child' },
    { emoji: '🎤', name: 'Microphone Sing', turn: 'parent' }
  ];

  const [currentAction, setCurrentAction] = useState(null);

  const startGame = () => {
    setGameStarted(true);
    nextAction();
  };

  const nextAction = () => {
    const actionIndex = (completedActions) % actions.length;
    setCurrentAction(actions[actionIndex]);
    setIsParentTurn(actions[actionIndex].turn === 'parent');
    setShowingToParent(true);
    setActionConfirmed(false);
    setCardRevealed(false);
  };

  const handleParentReady = () => {
    setShowingToParent(false);
    setActionConfirmed(true);
  };

  const completeTurn = () => {
    setCompletedActions(completedActions + 1);
    const newScore = score + 5;
    setScore(newScore);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      if (completedActions + 1 < 10) {
        nextAction();
      } else {
        setGameComplete(true);
        const earnedPoints = Math.round(totalPoints * (newScore / 50));
        onComplete(earnedPoints, { score: newScore, actions: 10 });
      }
    }, 2000);
  };

  if (gameComplete) {
    return (
      <div className="cooperative-game">
        <div className="game-complete">
          <h1>🔄 {t['Amazing Teamwork!'] || 'Amazing Teamwork!'}</h1>
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
          <h1>🔄 {t['My Turn – Your Turn'] || 'My Turn – Your Turn'}</h1>
          <div className="game-rules">
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent:'] || 'Parent:'}</h4>
                <p>{t['Take turns patiently. Say "My turn" and "Your turn" clearly!'] || 'Take turns patiently. Say "My turn" and "Your turn" clearly!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child:'] || 'Child:'}</h4>
                <p>{t['Wait for your turn, then do the action!'] || 'Wait for your turn, then do the action!'}</p>
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
        <h2>🔄 {t['My Turn – Your Turn'] || 'My Turn – Your Turn'}</h2>
        <div className="game-stats">
          <span className="stat">{t['Action'] || 'Action'}: {completedActions + 1}/10</span>
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
              <span style={{ fontSize: '5rem', display: 'block', marginBottom: '20px' }}>🎴</span>
              <h3 style={{ color: 'white', margin: '0' }}>
                {isParentTurn 
                  ? (t['Your Turn - Click to Reveal'] || 'Your Turn - Click to Reveal') 
                  : (t['Child\'s Turn - Click to Reveal'] || 'Child\'s Turn - Click to Reveal')}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontSize: '1rem' }}>
                {t['Click to see the action'] || 'Click to see the action'}
              </p>
            </div>
          ) : (
            <div className="revealed-action">
              <div className="action-display" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '16px', margin: '20px 0' }}>
                <span className="big-emoji" style={{ fontSize: '4rem' }}>{currentAction?.emoji}</span>
                <h3 style={{ color: 'white', margin: '10px 0' }}>
                  {isParentTurn 
                    ? (t['Parent\'s Turn!'] || 'Parent\'s Turn!') 
                    : (t['Child\'s Turn!'] || 'Child\'s Turn!')}
                  <strong>{t[currentAction?.name] || currentAction?.name}</strong>
                </h3>
                <p style={{ color: 'white', fontSize: '1.1rem' }}>
                  {isParentTurn 
                    ? (t['Do this action, then click ready to show child'] || 'Do this action, then click ready to show child') 
                    : (t['Guide your child to do this action'] || 'Guide your child to do this action')}
                </p>
              </div>
              <button className="btn-ready" onClick={handleParentReady}>
                {t['I\'m Ready - Show Child 👍'] || 'I\'m Ready - Show Child 👍'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={`turn-indicator ${isParentTurn ? 'parent-turn' : 'child-turn'}`}>
          {showSuccess ? (
            <div className="success-message" style={{ border: 'none', background: 'transparent', margin: 0, padding: 0 }}>
              <span className="big-emoji">🌟</span>
              <h2>{t['Great Job! ⭐'] || 'Great Job! ⭐'}</h2>
            </div>
          ) : (
            <>
              <h3>
                {isParentTurn ? (t['Parent\'s Turn!'] || 'Parent\'s Turn!') : (t['Child\'s Turn!'] || 'Child\'s Turn!')}
              </h3>
              <div className="action-display">
                <span className="big-emoji">{currentAction?.emoji}</span>
                <p><strong>{t[currentAction?.name] || currentAction?.name}</strong></p>
              </div>
              <button className="btn-ready" onClick={completeTurn}>
                {isParentTurn 
                  ? (t['Done 👍'] || 'Done 👍') 
                  : (t['Done 👍'] || 'Done 👍')}
              </button>
            </>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>✕</button>
    </div>
  );
};

export default MyTurnYourTurnGame;
