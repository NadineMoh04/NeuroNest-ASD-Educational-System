
import React, { useState, useEffect, useCallback } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import { useLanguage } from '../../context/LanguageContext.jsx';
import translations from '../../translations/translations.js';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './CategorizationGame.css';


const GAME_DATA = {
  fruits: [
    { id: 'apple', emoji: '🍎', name: 'Apple' },
    { id: 'banana', emoji: '🍌', name: 'Banana' },
    { id: 'orange', emoji: '🍊', name: 'Orange' },
    { id: 'grape', emoji: '🍇', name: 'Grape' },
    { id: 'strawberry', emoji: '🍓', name: 'Strawberry' },
    { id: 'watermelon', emoji: '🍉', name: 'Watermelon' },

  ],
  vegetables: [
    { id: 'tomato', emoji: '🍅', name: 'Tomato' },
    { id: 'carrot', emoji: '🥕', name: 'Carrot' },
    { id: 'broccoli', emoji: '🥦', name: 'Broccoli' },
    { id: 'corn', emoji: '🌽', name: 'Corn' },
    { id: 'potato', emoji: '🥔', name: 'Potato' },
    { id: 'lettuce', emoji: '🥬', name: 'Lettuce' },
    { id: 'onion', emoji: '🧅', name: 'Onion' },
  ],
  animals: [
    { id: 'dog', emoji: '🐶', name: 'Dog' },
    { id: 'cat', emoji: '🐱', name: 'Cat' },
    { id: 'cow', emoji: '🐮', name: 'Cow' },
    { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
    { id: 'bird', emoji: '🐦', name: 'Bird' },
    { id: 'fish', emoji: '🐟', name: 'Fish' },
    { id: 'elephant', emoji: '🐘', name: 'Elephant' },
  ],
  bodyParts: [
    { id: 'eye', emoji: '👁️', name: 'Eye' },
    { id: 'ear', emoji: '👂', name: 'Ear' },
    { id: 'nose', emoji: '👃', name: 'Nose' },
    { id: 'mouth', emoji: '👄', name: 'Mouth' },
    { id: 'hand', emoji: '✋', name: 'Hand' },
    { id: 'foot', emoji: '🦶', name: 'Foot' },
    { id: 'heart', emoji: '❤️', name: 'Heart' },
  ]
};

const CATEGORIES = {
  fruits: { name: 'Fruits', icon: '🍎', color: '#FFE5E5' },
  vegetables: { name: 'Vegetables', icon: '🥕', color: '#E5FFE5' },
  animals: { name: 'Animals', icon: '🐶', color: '#E5E5FF' },
  bodyParts: { name: 'Body Parts', icon: '👁️', color: '#FFE5FF' }
};


const LEVEL_CONFIG = {
  1: {
    categories: ['fruits', 'animals'],
    objectCount: 3,
    name: 'Very Easy'
  },
  2: {
    categories: ['fruits', 'animals', 'vegetables'],
    objectCount: 4,
    name: 'Easy'
  },
  3: {
    categories: ['fruits', 'animals', 'vegetables', 'bodyParts'],
    objectCount: 5,
    name: 'Medium'
  },
  4: {
    categories: ['fruits', 'animals', 'vegetables', 'bodyParts'],
    objectCount: 6,
    name: 'Advanced',
    includeTricky: true 
  }
};

const CategorizationGame = ({ onComplete, onClose, totalPoints = 30 }) => {
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

  const [level, setLevel] = useState(1); 
  const [score, setScore] = useState(0);
  const [objects, setObjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draggedObject, setDraggedObject] = useState(null);
  const [round, setRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [stars, setStars] = useState(0);
  const [showLocalFeedback, setShowLocalFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [localFeedbackType, setLocalFeedbackType] = useState('');

  const MAX_ROUNDS = 3;
  const objectsPerRound = LEVEL_CONFIG[level].objectCount;

  
  const setupRound = useCallback(() => {
    console.log(`Setting up Level ${level}, Round ${round + 1}`);

    const config = LEVEL_CONFIG[level];
    const categoryKeys = config.categories;

    console.log('Categories:', categoryKeys);
    console.log('Objects per round:', objectsPerRound);

    
    setCategories(categoryKeys.map(key => ({
      key,
      ...CATEGORIES[key]
    })));

    
    const selectedObjects = [];
    const usedIds = new Set();

    
    categoryKeys.forEach(catKey => {
      const categoryObjects = GAME_DATA[catKey];
      const available = categoryObjects.filter(obj => !usedIds.has(obj.id));
      if (available.length > 0) {
        const obj = available[Math.floor(Math.random() * available.length)];
        selectedObjects.push({ ...obj, category: catKey });
        usedIds.add(obj.id);
      }
    });

    
    while (selectedObjects.length < objectsPerRound) {
      const randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
      const categoryObjects = GAME_DATA[randomCat];
      const available = categoryObjects.filter(obj => !usedIds.has(obj.id));

      if (available.length > 0) {
        const obj = available[Math.floor(Math.random() * available.length)];
        selectedObjects.push({ ...obj, category: randomCat });
        usedIds.add(obj.id);
      } else {
        break; 
      }
    }

    console.log(`Selected ${selectedObjects.length} objects for this round`);

    
    setObjects(selectedObjects.sort(() => Math.random() - 0.5));
    setRoundComplete(false);
    setCorrectCount(0);
    setShowLocalFeedback(false);
  }, [level, objectsPerRound]);

  useEffect(() => {
    console.log('========== useEffect triggered ==========');
    console.log('Current Level:', level);
    console.log('Current Round:', round);
    console.log('Level Config:', LEVEL_CONFIG[level]);
    setupRound();
    console.log('==========================================');
  }, [setupRound, round, level]);

  
  const handleDragStart = (object) => {
    setDraggedObject(object);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (categoryKey) => {
    if (!draggedObject) return;

    const isCorrect = draggedObject.category === categoryKey;

    if (isCorrect) {
      
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      setTotalCorrect(prev => prev + 1);

      
      const remainingObjects = objects.filter(obj => obj.id !== draggedObject.id);
      setObjects(remainingObjects);

      recordAnswer(true);

      
      setFeedbackMessage('Great job! ⭐');
      setLocalFeedbackType('success');
      setShowLocalFeedback(true);
      setTimeout(() => setShowLocalFeedback(false), 1500);

      
      if (remainingObjects.length === 0) {
        console.log('=== ROUND COMPLETE ===');
        console.log('Round:', round + 1, 'of', MAX_ROUNDS);
        console.log('Current Level:', level);

        setRoundComplete(true);
        const pointsEarned = Math.round(totalPoints / MAX_ROUNDS);
        setScore(prev => prev + pointsEarned);
        setStars(prev => prev + 1);

        console.log(`Round ${round + 1} complete! Moving to next...`);

        
        setTimeout(() => {
          if (round < MAX_ROUNDS - 1) {
            console.log(`Advancing to Round ${round + 2}`);
            setRound(prev => prev + 1);
          } else {
            
            console.log(`Level ${level} complete! Current level:`, level);
            console.log('Level < 4?', level < 4);

            if (level < 4) {
               console.log('Showing level complete screen for level', level);
              setLevelComplete(true);
            } else {
              
              console.log('Game complete! All 4 levels finished!');
              setGameComplete(true);
            }
          }
        }, 2000);
      }
    } else {
      
      recordAnswer(false);
      setFeedbackMessage('Try again! 💪');
      setLocalFeedbackType('error');
      setShowLocalFeedback(true);
      setTimeout(() => setShowLocalFeedback(false), 1500);
    }

    setDraggedObject(null);
  };

  
  const handleTouchStart = (object, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedObject(object);
    console.log('Touch started on:', object.name);
  };

  const handleTouchMove = (e) => {
    if (!draggedObject) return;
    e.preventDefault();
    e.stopPropagation();

    
    const touch = e.touches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    
    document.querySelectorAll('.category-box').forEach(box => {
      box.classList.remove('drag-over');
    });

    
    if (dropTarget) {
      const categoryElement = dropTarget.closest('.category-box');
      if (categoryElement) {
        categoryElement.classList.add('drag-over');
        console.log('Dragging over:', categoryElement.dataset.category);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (!draggedObject) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    
    document.querySelectorAll('.category-box').forEach(box => {
      box.classList.remove('drag-over');
    });

    if (dropTarget) {
      const categoryElement = dropTarget.closest('.category-box');
      if (categoryElement) {
        const categoryKey = categoryElement.dataset.category;
        console.log('Dropped on:', categoryKey);
        handleDrop(categoryKey);
        return;
      }
    }

    console.log('Touch ended without drop');
    setDraggedObject(null);
  };

  
  const handleLevelUp = () => {
    console.log('=== HANDLE LEVEL UP CALLED ===');
    console.log('Current level:', level);
    console.log('Moving to level:', level + 1);

    
    setLevelComplete(false);
    setRoundComplete(false);
    setCorrectCount(0);
    setRound(0);

    
    setLevel(prev => {
      const newLevel = prev + 1;
      console.log('Setting level from', prev, 'to', newLevel);
      return newLevel;
    });

    console.log('Level up initiated - useEffect will trigger setupRound');
  };

  
  const handleCompleteGame = () => {
    if (onComplete) {
      onComplete({
        score,
        stars,
        level,
        accuracy: getAccuracy()
      });
    }
    if (onClose) {
      onClose();
    }
  };

  
  const handleReset = () => {
    setLevel(1);
    setScore(0);
    setRound(0);
    setCorrectCount(0);
    setStars(0);
    setGameComplete(false);
    setLevelComplete(false);
    setRoundComplete(false);
  };

  if (gameComplete) {
    
    React.useEffect(() => {
      const timer = setTimeout(() => {
        handleCompleteGame();
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="categorization-overlay">
        <div className="categorization-container">
          <button className="close-btn" onClick={handleCompleteGame}>×</button>
          <div className="game-complete-screen">
            <h2>🎉 {t['Amazing Job!'] || 'Amazing Job!'} 🎉</h2>
            <div className="stars-display">
              {[...Array(stars)].map((_, i) => (
                <span key={i} className="star">⭐</span>
              ))}
            </div>
            <p className="final-score">{t['Score'] || 'Score'}: {score} {t['points'] || 'points'}</p>
            <p className="final-level">{t['reached level'] || 'Reached Level'} {level}</p>
            <p className="final-accuracy">{t['accuracy'] || 'Accuracy'}: {getAccuracy()}%</p>
            <p className="auto-close-notice">{t['closing game in 5 seconds...'] || 'Closing game in 5 seconds...'}</p>
            <div className="complete-buttons">
              <button className="btn-play-again" onClick={handleReset}>
                {t['Play Again 🔄'] || 'Play Again 🔄'}
              </button>
              <button className="btn-close" onClick={handleCompleteGame}>
                {t['Done ✓'] || 'Done ✓'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (levelComplete) {
    console.log('Rendering Level Complete Screen for level:', level);
    return (
      <div className="categorization-overlay">
        <div className="categorization-container">
          <button className="close-btn" onClick={handleCompleteGame}>×</button>
          <div className="level-complete-screen">
            <h2>⭐ {t['Level'] || 'Level'} {level} {t['Done'] || 'Complete'}! ⭐</h2>
            <p className="level-name">{t['Great work on'] || 'Great work on'} {t[LEVEL_CONFIG[level].name] || LEVEL_CONFIG[level].name}!</p>
            <p className="current-score">{t['Score'] || 'Score'}: {score} {t['points'] || 'points'}</p>
            <button className="btn-next-level" onClick={() => {
              console.log('Next Level button clicked!');
              handleLevelUp();
            }}>
              {t['Next Level'] || 'Next Level →'}
            </button>
            <button className="btn-close-small" onClick={handleCompleteGame}>
              {t['Finish Game'] || 'Finish Game'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = LEVEL_CONFIG[level];

  return (
    <div className="categorization-overlay">
      <div className="categorization-container">
        <button className="close-btn" onClick={handleCompleteGame}>×</button>

        <div className="game-header">
          <h2>🗂️ {t['Categorization Game'] || 'Categorization Game'}</h2>
          <div className="game-info">
            <span className="level-badge">{t['Level'] || 'Level'} {level}: {t[config.name] || config.name}</span>
            <span className="round-info">{t['Round'] || 'Round'} {round + 1}/{MAX_ROUNDS}</span>
            <span className="score-display">⭐ {score}</span>
          </div>
        </div>

        <div className="instruction">
          <p className="instruction-text">🎯 {t['Drag each object to the correct category box below!'] || 'Drag each object to the correct category box below!'}</p>
          <p className="instruction-subtext">{t['Touch and hold the object, then drag it to the right box'] || 'Touch and hold the object, then drag it to the right box'}</p>
        </div>

        <div className="game-area">
          
          <div className="objects-area">
            <h3 className="area-title">
              <span className="title-icon">📦</span>
              {t['Objects to Sort:'] || 'Objects to Sort:'}
              <span className="object-count">({objects.length} {t['items'] || 'items'})</span>
            </h3>
            <div className="objects-container">
              {objects.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✨</span>
                  <p>{t['All objects sorted! Great job!'] || 'All objects sorted! Great job!'}</p>
                </div>
              ) : (
                objects.map((obj, index) => (
                  <div
                    key={obj.id}
                    className={`object-card ${draggedObject?.id === obj.id ? 'dragging' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      handleDragStart(obj);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onTouchStart={(e) => handleTouchStart(obj, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <span className="object-emoji">{obj.emoji}</span>
                    <span className="object-name">{t[obj.name] || obj.name}</span>
                    <span className="drag-hint">👆 {t['Drag me!'] || 'Drag me!'}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          
          <div className="categories-area">
            <h3 className="area-title">
              <span className="title-icon">🎯</span>
              {t['Category Boxes:'] || 'Category Boxes:'}
            </h3>
            <div className="categories-container">
              {categories.map((cat) => (
                <div
                  key={cat.key}
                  className="category-box"
                  data-category={cat.key}
                  style={{ backgroundColor: cat.color }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove('drag-over');
                    handleDrop(cat.key);
                  }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{t[cat.name] || cat.name}</span>
                  <span className="drop-hint">{t['Drop here'] || 'Drop here'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        
        {showLocalFeedback && (
          <div className={`feedback-message ${localFeedbackType}`}>
            {t[feedbackMessage] || feedbackMessage}
          </div>
        )}

        
        {showFeedback && (
          <AdaptiveFeedbackChild
            feedback={feedback}
            type={feedbackType}
          />
        )}

        
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((round * objectsPerRound + correctCount) / (MAX_ROUNDS * objectsPerRound)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorizationGame;
