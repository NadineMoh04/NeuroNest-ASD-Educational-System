import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import '../CooperativeGames.css';

const StoryTogetherGame = ({ totalPoints = 30, onComplete, onClose }) => {
  const { isArabic } = useLanguage();
  const t = isArabic ? translations.ar : translations.en;

  const [score, setScore] = useState(0);
  const [scene, setScene] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showingToParent, setShowingToParent] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState('');

  const storyScenes = [
    {
      id: 1,
      title: 'Lost Toy',
      emoji: '🧸',
      scene: 'Oh no! The teddy bear is missing!',
      parentHint: 'Something unexpected happened! Ask your child what we should do next',
      childScenario: 'You can\'t find your favorite teddy bear. What should we do?',
      choices: [
        { emoji: '😢', text: 'Cry and ask for help', emotion: 'sad', action: 'seek-help', points: 7 },
        { emoji: '💬', text: 'Talk to parent about it', emotion: 'calm', action: 'communicate', points: 10 },
        { emoji: '🔍', text: 'Try to find it yourself', emotion: 'determined', action: 'problem-solve', points: 10 },
        { emoji: '🎮', text: 'Play with another toy instead', emotion: 'adapt', action: 'move-on', points: 5 }
      ],
      bestChoice: 'communicate',
      feedback: {
        best: '✅ Great choice! Talking to someone you trust is always helpful!',
        good: '👍 Good idea! Trying to solve problems is brave!',
        okay: '💡 That works too, but talking to someone might help more!'
      }
    },
    {
      id: 2,
      title: 'New Friend',
      emoji: '👋',
      scene: 'A new child wants to play with you!',
      parentHint: 'A new friend appeared! Ask your child how they want to respond',
      childScenario: 'A new child at the park wants to play with you. What should we do?',
      choices: [
        { emoji: '😊', text: 'Say yes and share toys', emotion: 'happy', action: 'share', points: 10 },
        { emoji: '😨', text: 'Hide and watch first', emotion: 'shy', action: 'observe', points: 7 },
        { emoji: '😠', text: 'Say no, they\'re a stranger', emotion: 'wary', action: 'reject', points: 5 },
        { emoji: '🤔', text: 'Ask parent if it\'s okay', emotion: 'careful', action: 'check-safety', points: 10 }
      ],
      bestChoice: 'share',
      feedback: {
        best: '✅ Wonderful! Sharing and being friendly makes new friends!',
        good: '👍 Being careful and asking first is very smart!',
        okay: '💡 It\'s okay to be shy, but being friendly can be fun too!'
      }
    },
    {
      id: 3,
      title: 'Rainy Day',
      emoji: '🌧️',
      scene: 'It starts raining during outdoor play!',
      parentHint: 'The weather changed! Ask your child what we should do now',
      childScenario: 'You\'re playing outside and it starts raining hard. What should we do?',
      choices: [
        { emoji: '😢', text: 'Cry and feel disappointed', emotion: 'sad', action: 'give-up', points: 5 },
        { emoji: '🏃', text: 'Run inside quickly', emotion: 'urgent', action: 'seek-shelter', points: 10 },
        { emoji: '😄', text: 'Play in the rain!', emotion: 'joyful', action: 'embrace-change', points: 8 },
        { emoji: '🤝', text: 'Help others get inside too', emotion: 'caring', action: 'help-others', points: 10 }
      ],
      bestChoice: 'seek-shelter',
      feedback: {
        best: '✅ Smart! Getting out of the rain keeps us healthy!',
        good: '👍 Helping others shows great kindness!',
        okay: '💡 Playing in rain can be fun, but staying dry is safer!'
      }
    },
    {
      id: 4,
      title: 'Broken Tower',
      emoji: '🏗️',
      scene: 'Your block tower just fell down!',
      parentHint: 'Something broke! Ask your child how to handle this situation',
      childScenario: 'You built a tall tower but it just fell down! What should we do?',
      choices: [
        { emoji: '😠', text: 'Get angry and quit', emotion: 'frustrated', action: 'quit', points: 5 },
        { emoji: '😢', text: 'Feel sad but try again', emotion: 'sad', action: 'retry', points: 8 },
        { emoji: '💪', text: 'Build it even better!', emotion: 'determined', action: 'improve', points: 10 },
        { emoji: '🤝', text: 'Ask for help to rebuild', emotion: 'hopeful', action: 'seek-help', points: 10 }
      ],
      bestChoice: 'improve',
      feedback: {
        best: '✅ Amazing attitude! Mistakes help us learn and improve!',
        good: '👍 Asking for help shows wisdom!',
        okay: '💡 It\'s okay to feel sad, but trying again is brave!'
      }
    },
    {
      id: 5,
      title: 'Sharing Moment',
      emoji: '🍎',
      scene: 'You have one apple, friend has none',
      parentHint: 'A sharing opportunity! Ask your child what they want to do',
      childScenario: 'You have one yummy apple but your friend doesn\'t have any. What should we do?',
      choices: [
        { emoji: '😊', text: 'Share the apple in half', emotion: 'generous', action: 'share', points: 10 },
        { emoji: '😕', text: 'Eat it all yourself', emotion: 'selfish', action: 'keep-all', points: 3 },
        { emoji: '🤔', text: 'Ask parent what to do', emotion: 'thoughtful', action: 'seek-guidance', points: 8 },
        { emoji: '🎁', text: 'Give the whole apple to friend', emotion: 'selfless', action: 'give-all', points: 7 }
      ],
      bestChoice: 'share',
      feedback: {
        best: '✅ Perfect! Sharing makes everyone happy!',
        good: '👍 Thinking before acting is very wise!',
        okay: '💡 Being generous is wonderful, sharing is a good balance!'
      }
    }
  ];

  const [story, setStory] = useState([]);
  const currentScene = storyScenes[scene];

  const startGame = () => {
    setGameStarted(true);
    setShowingToParent(true);
  };

  const handleChoice = (choice) => {
    const points = choice.points;
    const newScore = score + points;
    setScore(newScore);
    setShowIncorrect(false);

    const newStory = [...story, {
      scene: currentScene.title,
      choice: choice.text,
      emotion: choice.emotion,
      action: choice.action,
      points: points
    }];
    setStory(newStory);

    
    let feedbackKey = 'okay';
    if (choice.action === currentScene.bestChoice || choice.points === 10) {
      feedbackKey = 'best';
    } else if (choice.points >= 7) {
      feedbackKey = 'good';
    }
    const feedbackText = currentScene.feedback[feedbackKey];
    setActiveFeedback(feedbackText);

    setTimeout(() => {
      setActiveFeedback('');
      if (scene < 4) {
        setScene(scene + 1);
        setShowingToParent(true);
      } else {
        setGameComplete(true);
        const earnedPoints = Math.round(totalPoints * (newScore / 50));
        onComplete(earnedPoints, { score: newScore, story: newStory });
      }
    }, 3000);
  };

  if (gameComplete) {
    return (
      <div className="cooperative-game">
        <div className="game-complete">
          <h1>🎉 {t['Adventure Complete!'] || 'Adventure Complete!'}</h1>
          <div className="story-recap">
            <h3>{t['Your Journey:'] || 'Your Journey:'}</h3>
            {story.map((item, i) => (
              <div key={i} className="story-item">
                <p><strong>{t['Scene'] || 'Scene'} {i + 1}:</strong> {t[item.scene] || item.scene}</p>
                <p className="emotion-chosen">{t[item.choice] || item.choice} ({item.points} {t['pts'] || 'pts'})</p>
              </div>
            ))}
          </div>
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
          <h1>📖 {t['Emotion Adventure'] || 'Emotion Adventure'}</h1>
          <div className="game-rules">
            <h3 style={{ color: '#333' }}>{t['How to Play:'] || 'How to Play:'}</h3>
            <div className="role-instructions">
              <div className="parent-role">
                <h4>👨‍👩‍👧 {t['Parent = Guide:'] || 'Parent = Guide:'}</h4>
                <p>{t['You\'ll see hint cards. Guide your child through story choices!'] || 'You\'ll see hint cards. Guide your child through story choices!'}</p>
              </div>
              <div className="child-role">
                <h4>👶 {t['Child = Explorer:'] || 'Child = Explorer:'}</h4>
                <p>{t['Make choices in story situations. Learn emotions through actions!'] || 'Make choices in story situations. Learn emotions through actions!'}</p>
              </div>
            </div>
          </div>
          <button className="btn-start-game" onClick={startGame}>{t['Start Adventure'] || 'Start Adventure'} 🎮</button>
          <button className="btn-back" onClick={onClose}>{t['Back'] || 'Back'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cooperative-game">
      <div className="game-header">
        <h2 style={{ color: '#333' }}>📖 {t['Emotion Adventure'] || 'Emotion Adventure'}</h2>
        <div className="game-stats">
          <span className="stat">{t['Scene'] || 'Scene'}: {scene + 1}/5</span>
          <span className="stat">{t['Score'] || 'Score'}: {score}</span>
        </div>
      </div>

      {showingToParent ? (
        <div className="parent-view">
          <h3>🤫 {t['Parent Guide Card'] || 'Parent Guide Card'}</h3>
          <div className="scene-display" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <span className="big-emoji">{currentScene.emoji}</span>
            <h4 style={{ color: 'white' }}>{t['Scene'] || 'Scene'}: {t[currentScene.title] || currentScene.title}</h4>
            <p style={{ color: 'white', fontSize: '1.2rem' }}>{t[currentScene.scene] || currentScene.scene}</p>
          </div>
          <div className="parent-hint-card">
            <h4 style={{ color: '#333' }}>💡 {t['Your Role:'] || 'Your Role:'}</h4>
            <p style={{ color: '#666' }}>{t[currentScene.parentHint] || currentScene.parentHint}</p>
          </div>
          <button className="btn-ready" onClick={() => setShowingToParent(false)}>
            {t['I\'m Ready - Show Child the Scene 👍'] || 'I\'m Ready - Show Child the Scene 👍'}
          </button>
        </div>
      ) : (
        <div className="child-view">
          {activeFeedback ? (
            <div className="success-message" style={{ margin: '2rem auto', maxWidth: '600px', background: '#e1f5fe', borderColor: '#03a9f4' }}>
              <h2 style={{ color: '#01579b', fontSize: '1.8rem', lineHeight: '1.6' }}>{t[activeFeedback] || activeFeedback}</h2>
            </div>
          ) : (
            <>
              <div className="scene-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <span className="big-emoji">{currentScene.emoji}</span>
                <h3 style={{ color: 'white' }}>{t[currentScene.title] || currentScene.title}</h3>
                <p style={{ color: 'white', fontSize: '1.3rem' }}>{t[currentScene.childScenario] || currentScene.childScenario}</p>
              </div>

              <div className="choices-section">
                <h3 style={{ color: '#333' }}>{t['What should we do?'] || 'What should we do?'}</h3>
                <div className="choices-grid">
                  {currentScene.choices.map((choice, index) => (
                    <button
                      key={index}
                      className="choice-button"
                      onClick={() => handleChoice(choice)}
                    >
                      <span className="choice-emoji">{choice.emoji}</span>
                      <span className="choice-text">{t[choice.text] || choice.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <button className="btn-exit" onClick={onClose}>✕</button>
    </div>
  );
};

export default StoryTogetherGame;
