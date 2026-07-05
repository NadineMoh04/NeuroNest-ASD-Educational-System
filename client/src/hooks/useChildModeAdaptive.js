import { useState, useCallback, useRef } from 'react';





export const useChildModeAdaptive = ({
  initialDifficulty = 'Easy',
  consecutiveThreshold = 3, 
  onDifficultyChange = null 
}) => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState({ message: '', type: '', show: false });
  
  const difficultyLevels = ['Easy', 'Medium', 'Hard'];
  const feedbackTimeoutRef = useRef(null);

  
  const correctMessages = [
    '🌟 Great job!',
    '⭐ Amazing work!',
    '🎉 Excellent!',
    '🏆 You\'re doing fantastic!',
    '💪 Keep it up!',
    '🌈 Wonderful!',
    '🎯 Perfect!',
    '✨ You\'re a star!'
  ];

  const incorrectMessages = [
    '💙 Let\'s try again!',
    '🌟 Good effort! One more time!',
    '💪 You can do it!',
    '🎈 Almost there! Try again!',
    '🌈 Keep going! You\'ll get it!',
    '⭐ Don\'t give up!',
    '🎉 Nice try! Let\'s practice more!'
  ];

  const difficultyChangeMessages = {
    increase: '🚀 Great work! Let\'s make it more challenging!',
    decrease: '💙 Let\'s make it a bit easier. You\'ve got this!'
  };

  
  const showFeedbackMessage = useCallback((message, type = 'success', duration = 2000) => {
    
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setFeedback({ message, type, show: true });

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, duration);
  }, []);

  
  const recordAnswer = useCallback((isCorrect, questionId = null) => {
    setTotalQuestions(prev => prev + 1);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setConsecutiveCorrect(prev => {
        const newCount = prev + 1;
        setConsecutiveIncorrect(0); 

        
        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        showFeedbackMessage(randomMessage, 'success');

        
        if (newCount >= consecutiveThreshold) {
          setDifficulty(currentDifficulty => {
            const currentIndex = difficultyLevels.indexOf(currentDifficulty);
            if (currentIndex < difficultyLevels.length - 1) {
              const newDifficulty = difficultyLevels[currentIndex + 1];
              showFeedbackMessage(difficultyChangeMessages.increase, 'difficulty-change', 3000);
              if (onDifficultyChange) {
                onDifficultyChange(newDifficulty, 'increase');
              }
              return newDifficulty;
            }
            return currentDifficulty;
          });
          setConsecutiveCorrect(0); 
        }

        return newCount;
      });
    } else {
      setConsecutiveIncorrect(prev => {
        const newCount = prev + 1;
        setConsecutiveCorrect(0); 

        
        const randomMessage = incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
        showFeedbackMessage(randomMessage, 'encouragement');

        
        if (newCount >= consecutiveThreshold) {
          setDifficulty(currentDifficulty => {
            const currentIndex = difficultyLevels.indexOf(currentDifficulty);
            if (currentIndex > 0) {
              const newDifficulty = difficultyLevels[currentIndex - 1];
              showFeedbackMessage(difficultyChangeMessages.decrease, 'difficulty-change', 3000);
              if (onDifficultyChange) {
                onDifficultyChange(newDifficulty, 'decrease');
              }
              return newDifficulty;
            }
            return currentDifficulty;
          });
          setConsecutiveIncorrect(0); 
        }

        return newCount;
      });
    }
  }, [consecutiveThreshold, difficultyLevels, onDifficultyChange, showFeedbackMessage]);

  
  const getAccuracy = useCallback(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [totalQuestions, correctAnswers]);

  
  const getStats = useCallback(() => ({
    difficulty,
    consecutiveCorrect,
    consecutiveIncorrect,
    totalQuestions,
    correctAnswers,
    achieved: getAccuracy()
  }), [difficulty, consecutiveCorrect, consecutiveIncorrect, totalQuestions, correctAnswers, getAccuracy]);

  
  const resetStats = useCallback(() => {
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setFeedback({ message: '', type: '', show: false });
  }, []);

  
  useState(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  return {
    difficulty,
    feedback: feedback.message,
    feedbackType: feedback.type,
    showFeedback: feedback.show,
    consecutiveCorrect,
    consecutiveIncorrect,
    stats: getStats(),
    recordAnswer,
    getAccuracy,
    resetStats,
    getStats
  };
};
