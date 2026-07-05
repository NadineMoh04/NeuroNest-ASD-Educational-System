import React, { useState } from 'react';
import AnimalMatchingGame from './AnimalMatchingGame';
import LetterTracingGame from './LetterTracingGame';
import MemoryCardFlipGame from './MemoryCardFlipGame';
import SoundRecognitionGame from './SoundRecognitionGame';
import PatternCompletionGame from './PatternCompletionGame';
import CountingObjectsGame from './CountingObjectsGame';
import './MiniGamesDemo.css';

const GAMES = [
    {
        id: 'animal-matching',
        name: 'Animal Matching',
        emoji: '🐶',
        description: 'Match pairs of animals',
        component: AnimalMatchingGame,
        color: '#667eea'
    },
    {
        id: 'letter-tracing',
        name: 'Letter Tracing',
        emoji: '✏️',
        description: 'Trace letters with your finger',
        component: LetterTracingGame,
        color: '#f5576c'
    },
    {
        id: 'memory-card',
        name: 'Memory Card Flip',
        emoji: '🧠',
        description: 'Find matching card pairs',
        component: MemoryCardFlipGame,
        color: '#4ecdc4'
    },
    {
        id: 'sound-recognition',
        name: 'Sound Recognition',
        emoji: '🔊',
        description: 'Identify different sounds',
        component: SoundRecognitionGame,
        color: '#fcb69f'
    },
    {
        id: 'pattern-completion',
        name: 'Pattern Completion',
        emoji: '🔷',
        description: 'Complete the pattern',
        component: PatternCompletionGame,
        color: '#a8edea'
    },
    {
        id: 'counting-objects',
        name: 'Counting Objects',
        emoji: '🍎',
        description: 'Count and learn numbers',
        component: CountingObjectsGame,
        color: '#fdcb6e'
    }
];

const MiniGamesDemo = ({ onClose }) => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameStats, setGameStats] = useState([]);

    const handleGameComplete = (score, stats) => {
        setGameStats(prev => [...prev, {
            gameId: selectedGame.id,
            gameName: selectedGame.name,
            score,
            stats,
            timestamp: new Date().toISOString()
        }]);
        setSelectedGame(null);
    };

    const handleGameClose = () => {
        setSelectedGame(null);
    };

    
    if (selectedGame) {
        const GameComponent = selectedGame.component;
        return (
            <GameComponent
                onComplete={handleGameComplete}
                onClose={handleGameClose}
            />
        );
    }

    
    return (
        <div className="mini-games-overlay">
            <div className="mini-games-container">
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="demo-header">
                    <h1>🎮 Mini Games Collection</h1>
                    <p className="subtitle">Choose a game to play!</p>
                </div>

                {gameStats.length > 0 && (
                    <div className="recent-stats">
                        <h3>📊 Recent Games Played: {gameStats.length}</h3>
                        <div className="stats-summary">
                            {gameStats.slice(-3).map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <span className="stat-game">{stat.gameName}</span>
                                    <span className="stat-score">⭐ {Math.floor(stat.score)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="games-grid">
                    {GAMES.map((game) => (
                        <button
                            key={game.id}
                            className="game-card"
                            onClick={() => setSelectedGame(game)}
                            style={{ '--game-color': game.color }}
                        >
                            <div className="game-icon">{game.emoji}</div>
                            <h3 className="game-title">{game.name}</h3>
                            <p className="game-description">{game.description}</p>
                            <div className="play-button">Play Now ▶️</div>
                        </button>
                    ))}
                </div>

                <div className="demo-footer">
                    <p>🌟 All games adapt to your learning level!</p>
                    <p>📈 Track your progress as you play</p>
                </div>
            </div>
        </div>
    );
};

export default MiniGamesDemo;
