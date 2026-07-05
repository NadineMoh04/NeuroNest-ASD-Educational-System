
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useChildModeAdaptive } from '../../hooks/useChildModeAdaptive';
import AdaptiveFeedbackChild from '../AdaptiveFeedbackChild';
import './SoundRecognitionGame.css';


const SOUNDS = [
  
  { id: 'dog', emoji: '🐶', name: 'Dog', sound: 'Woof woof!', description: 'A dog barking', audioFile: '/sounds/dog.mp3', category: 'animals' },
  { id: 'cat', emoji: '🐱', name: 'Cat', sound: 'Meow meow!', description: 'A cat meowing', audioFile: '/sounds/cat.mp3', category: 'animals' },
  { id: 'cow', emoji: '🐮', name: 'Cow', sound: 'Moo moo!', description: 'A cow mooing', audioFile: '/sounds/cow.mp3', category: 'animals' },
  { id: 'duck', emoji: '🦆', name: 'Duck', sound: 'Quack quack!', description: 'A duck quacking', audioFile: '/sounds/duck.mp3', category: 'animals' },
  { id: 'horse', emoji: '🐴', name: 'Horse', sound: 'Neigh neigh!', description: 'A horse neighing', audioFile: '/sounds/horse.mp3', category: 'animals' },
  { id: 'sheep', emoji: '🐑', name: 'Sheep', sound: 'Baa baa!', description: 'A sheep baaing', audioFile: '/sounds/sheep.mp3', category: 'animals' },
  { id: 'bird', emoji: '🐦', name: 'Bird', sound: 'Tweet tweet!', description: 'A bird chirping', audioFile: '/sounds/bird.mp3', category: 'animals' },

  
  { id: 'car', emoji: '🚗', name: 'Car Horn', sound: 'Beep beep!', description: 'A car honking its horn', audioFile: '/sounds/car.mp3', category: 'vehicles' },
  { id: 'ambulance', emoji: '🚑', name: 'Emergency', sound: 'Wee woo wee woo!', description: 'An ambulance siren', audioFile: '/sounds/ambulance.mp3', category: 'vehicles' },
  { id: 'train', emoji: '🚆', name: 'Train', sound: 'Choo choo!', description: 'A train on the tracks', audioFile: '/sounds/train.mp3', category: 'vehicles' },
  { id: 'motorcycle', emoji: '🏍️', name: 'Motorcycle', sound: 'Vroom vroom!', description: 'A motorcycle revving', audioFile: '/sounds/motorcycle.mp3', category: 'vehicles' },

  
  { id: 'doorbell', emoji: '🔔', name: 'Doorbell', sound: 'Ding dong!', description: 'A doorbell ringing', audioFile: '/sounds/doorbell.mp3', category: 'everyday' },
  { id: 'alarm', emoji: '⏰', name: 'Alarm Clock', sound: 'Ring ring ring!', description: 'An alarm clock ringing', audioFile: '/sounds/alarm.mp3', category: 'everyday' },
  { id: 'telephone', emoji: '☎️', name: 'Telephone', sound: 'Brrring brrring!', description: 'A telephone ringing', audioFile: '/sounds/telephone.mp3', category: 'everyday' },
  { id: 'water', emoji: '🚰', name: 'Water Running', sound: 'Splish splash!', description: 'Water running from a tap', audioFile: '/sounds/water.mp3', category: 'everyday' },
  { id: 'rain', emoji: '🌧️', name: 'Rain', sound: 'Drip drop drip drop', description: 'Rain falling on the roof', audioFile: '/sounds/rain.mp3', category: 'everyday' },
  { id: 'wind', emoji: '🌬️', name: 'Wind', sound: 'Whooo whooo!', description: 'Wind blowing strongly', audioFile: '/sounds/wind.mp3', category: 'everyday' },
  { id: 'laughing', emoji: '😊', name: 'Laughing', sound: 'Ha ha ha!', description: 'Someone laughing happily', audioFile: '/sounds/laughing.mp3', category: 'everyday' },
  { id: 'sneezing', emoji: '🤧', name: 'Sneezing', sound: 'Achoo!', description: 'Someone sneezing', audioFile: '/sounds/sneezing.mp3', category: 'everyday' },
  { id: 'coughing', emoji: '😷', name: 'Coughing', sound: 'Cough cough!', description: 'Someone coughing', audioFile: '/sounds/coughing.mp3', category: 'everyday' },
  { id: 'knocking', emoji: '🚪', name: 'Knocking', sound: 'Knock knock knock!', description: 'Someone knocking on a door', audioFile: '/sounds/knocking.mp3', category: 'everyday' },
  { id: 'clap', emoji: '👏', name: 'Clapping', sound: 'Clap clap clap!', description: 'Hands clapping', audioFile: '/sounds/clap.mp3', category: 'everyday' },
];

const CATEGORIES = [
  { id: 'animals', emoji: '🐾', name: 'Animals', description: 'Animal sounds like barking, mooing, and roaring!', color: '#10b981' },
  { id: 'vehicles', emoji: '🚗', name: 'Vehicles & City', description: 'Car horns, sirens, trains, and airplanes!', color: '#3b82f6' },
  { id: 'everyday', emoji: '🏠', name: 'Everyday & Nature', description: 'Doorbell, rain, thunder, laughing, and more!', color: '#f59e0b' },
];


const DIFFICULTY_CONFIG = {
  Easy: { options: 3, showDescription: true, showEmoji: true, soundHint: true },
  Medium: { options: 4, showDescription: true, showEmoji: false, soundHint: true },
  Hard: { options: 5, showDescription: false, showEmoji: false, soundHint: false },
};


const SYNTH_CONFIGS = {
  
  'dog': { frequency: 400, type: 'sawtooth', duration: 0.1, repeats: 2 },
  'cat': { frequency: 600, type: 'sine', duration: 0.4, repeats: 2 },
  'cow': { frequency: 200, type: 'sawtooth', duration: 0.6, repeats: 2 },
  'duck': { frequency: 800, type: 'square', duration: 0.2, repeats: 3 },
  'horse': { frequency: 500, type: 'sawtooth', duration: 0.5, repeats: 2 },
  'sheep': { frequency: 700, type: 'sine', duration: 0.4, repeats: 2 },
  'bird': { frequency: 1400, type: 'sine', duration: 0.2, repeats: 3 },
  
  'car': { frequency: 500, type: 'square', duration: 0.2, repeats: 2 },
  'ambulance': { frequency: 900, type: 'sine', duration: 0.4, repeats: 3 },
  'train': { frequency: 350, type: 'sawtooth', duration: 0.5, repeats: 2 },
  'motorcycle': { frequency: 180, type: 'sawtooth', duration: 0.4, repeats: 2 },
  
  'doorbell': { frequency: 1000, type: 'sine', duration: 0.4, repeats: 2 },
  'alarm': { frequency: 1200, type: 'square', duration: 0.2, repeats: 4 },
  'telephone': { frequency: 1100, type: 'sine', duration: 0.3, repeats: 3 },
  'water': { frequency: 900, type: 'sine', duration: 0.1, repeats: 5 },
  'rain': { frequency: 1000, type: 'sine', duration: 0.1, repeats: 5 },
  'wind': { frequency: 300, type: 'sine', duration: 0.8, repeats: 1 },
  'laughing': { frequency: 600, type: 'sine', duration: 0.2, repeats: 3 },
  'sneezing': { frequency: 700, type: 'square', duration: 0.15, repeats: 2 },
  'coughing': { frequency: 400, type: 'square', duration: 0.15, repeats: 3 },
  'knocking': { frequency: 600, type: 'square', duration: 0.1, repeats: 3 },
  'clap': { frequency: 800, type: 'square', duration: 0.1, repeats: 3 },
};


const SoundRecognitionGame = ({ onComplete, onClose, totalPoints = 30 }) => {
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

  const [gamePhase, setGamePhase] = useState('menu'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorySounds, setCategorySounds] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundSource, setSoundSource] = useState('');
  const audioRef = useRef(null);
  const synthTimeoutRef = useRef(null);
  const audioContextRef = useRef(null);

  
  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {
        console.error(e);
      }
      audioRef.current = null;
    }

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error(e);
      }
    }

    if (synthTimeoutRef.current) {
      clearTimeout(synthTimeoutRef.current);
      synthTimeoutRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.error(e);
      }
      audioContextRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  const handleClose = useCallback(() => {
    stopAllAudio();
    onClose();
  }, [onClose, stopAllAudio]);

  
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  const MAX_ROUNDS = 10;
  const config = DIFFICULTY_CONFIG[difficulty];
  const pointsPerRound = totalPoints / MAX_ROUNDS;

  
  const handleSelectCategory = (cat) => {
    const sounds = SOUNDS.filter(s => s.category === cat.id);
    setCategorySounds(sounds);
    setSelectedCategory(cat);
    setScore(0);
    setRound(0);
    setGamePhase('playing');
  };

  
  const generateQuestion = useCallback(() => {
    if (categorySounds.length === 0) return;

    const targetSound = categorySounds[Math.floor(Math.random() * categorySounds.length)];
    setCurrentSound(targetSound);

    const numOptions = Math.min(config.options, categorySounds.length);
    let optionSounds = [targetSound];
    while (optionSounds.length < numOptions) {
      const random = categorySounds[Math.floor(Math.random() * categorySounds.length)];
      if (!optionSounds.find(o => o.id === random.id)) {
        optionSounds.push(random);
      }
    }

    setOptions(optionSounds.sort(() => Math.random() - 0.5));
    setIsPlaying(false);
  }, [config.options, categorySounds]);

  useEffect(() => {
    if (gamePhase === 'playing') {
      generateQuestion();
    }
  }, [generateQuestion, difficulty, gamePhase]);

  
  const playSound = () => {
    if (!currentSound) return;
    setIsPlaying(true);
    setSoundSource('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(currentSound.audioFile);
    audioRef.current = audio;

    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      console.log(`[SoundGame] File not found for "${currentSound.id}", falling back to speech.`);
      playWithSpeech();
    });

    audio.play().catch(() => playWithSpeech());
    setSoundSource('file');
  };

  
  const playWithSpeech = () => {
    if (!currentSound) return;

    const utterance = new SpeechSynthesisUtterance(currentSound.sound);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      console.log('[SoundGame] Speech API failed, falling back to synth.');
      playWithSynth();
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSoundSource('speech');
  };

  
  const playWithSynth = () => {
    if (!currentSound) return;

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) { }
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;
    const cfg = SYNTH_CONFIGS[currentSound.id] || { frequency: 500, type: 'sine', duration: 0.3, repeats: 2 };
    let playCount = 0;

    const playTone = () => {
      if (playCount >= cfg.repeats) {
        setIsPlaying(false);
        try { audioContext.close(); } catch (e) { }
        audioContextRef.current = null;
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = cfg.frequency;
      oscillator.type = cfg.type;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + cfg.duration);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + cfg.duration);

      playCount++;
      synthTimeoutRef.current = setTimeout(playTone, cfg.duration * 1000 + 100);
    };

    setSoundSource('synth');
    playTone();
  };

  
  const handleAnswer = (selectedSound) => {
    stopAllAudio(); 
    const isCorrect = selectedSound.id === currentSound.id;
    recordAnswer(isCorrect, `sound_${selectedSound.id}`);

    if (isCorrect) {
      setScore(prev => prev + pointsPerRound);

      setTimeout(() => {
        if (round + 1 >= MAX_ROUNDS) {
          onComplete(score + pointsPerRound, {
            achieved: getAccuracy(),
            difficulty,
            totalAttempts: round + 1
          });
        } else {
          setRound(prev => prev + 1);
          generateQuestion();
        }
      }, 1500);
    }
  };

  
  if (gamePhase === 'menu') {
    return (
      <div className="sound-recognition-overlay">
        <div className="sound-recognition-container">
          <button className="close-btn" onClick={handleClose}>×</button>

          <div className="game-header">
            <h2>🔊 Sound Recognition</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: '8px 0 0' }}>
              Choose a level to play!
            </p>
          </div>

          <div className="level-selection">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="level-card"
                onClick={() => handleSelectCategory(cat)}
                style={{ borderLeft: `5px solid ${cat.color}` }}
              >
                <span className="level-emoji">{cat.emoji}</span>
                <div className="level-info">
                  <span className="level-name">{cat.name}</span>
                  <span className="level-desc">{cat.description}</span>
                  <span className="level-count">
                    {SOUNDS.filter(s => s.category === cat.id).length} sounds
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="sound-recognition-overlay">
      <div className="sound-recognition-container">
        <button className="close-btn" onClick={handleClose}>×</button>

        <div className="game-header">
          <h2>🔊 Sound Recognition</h2>
          <div className="game-info">
            <span>{selectedCategory?.emoji} {selectedCategory?.name}</span>
            <span>Sound {round + 1}/{MAX_ROUNDS}</span>
            <span>⭐ {Math.floor(score)}</span>
          </div>
        </div>

        <AdaptiveFeedbackChild
          difficulty={difficulty}
          feedback={feedback}
          feedbackType={feedbackType}
          showFeedback={showFeedback}
          stats={stats}
        />

        <div className="sound-display">
          <div className={`sound-icon ${isPlaying ? 'playing' : ''}`}>
            🔊
          </div>

          <button className="play-sound-btn" onClick={playSound} disabled={isPlaying}>
            {isPlaying ? '🔊 Playing...' : '▶️ Play Sound'}
          </button>

          {soundSource && (
            <div className="sound-source-badge">
              {soundSource === 'file' ? '🎵 Real Sound' :
                soundSource === 'speech' ? '🗣️ Voice' : '🔊 Synth'}
            </div>
          )}

          {config.soundHint && currentSound && (
            <div className="sound-hint">
              Listen: &quot;{currentSound.sound}&quot;
            </div>
          )}

          {config.showDescription && currentSound && (
            <div className="sound-description">
              {currentSound.description}
            </div>
          )}
        </div>

        <div className="question-text">
          What sound is this?
        </div>

        <div className="options-grid">
          {options.map((option) => (
            <button
              key={option.id}
              className="sound-option"
              onClick={() => handleAnswer(option)}
            >
              {config.showEmoji && (
                <span className="option-emoji">{option.emoji}</span>
              )}
              <span className="option-name">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundRecognitionGame;
