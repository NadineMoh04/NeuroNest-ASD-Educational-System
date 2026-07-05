import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { testAPI, parentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext.jsx';
import translations from '../translations/translations.js';
import './Test.css';

const Test = () => {
    const navigate = useNavigate();
    const { isArabic } = useLanguage();
    const t = isArabic ? translations.ar : translations.en;
    const t_en = translations.en;

    const questionsCount = t_en.questions.length;
    const [answers, setAnswers] = useState(Array(questionsCount).fill(null));
    const [score, setScore] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (questionIndex, option) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[questionIndex] = option;
            return updated;
        });
    };

    
    const calculateScore = () => {
        let totalScore = 0;

        answers.forEach((answer, index) => {
            if (!answer) return;
            const optionIndex = t_en.questions[index].options.findIndex(opt =>
                opt.trim().toLowerCase() === answer.trim().toLowerCase()
            );

            
            if (index < 9) {
                if (optionIndex >= 2) {
                    totalScore += 1;
                }
            }
            
            else if (index === 9) {
                if (optionIndex <= 2) {
                    totalScore += 1;
                }
            }
        });

        return totalScore;
    };

    const handleSubmit = async () => {
        
        const unanswered = answers.findIndex(answer => answer === null);
        if (unanswered !== -1) {
            const errorMsg = t.pleaseAnswerAll.replace('{num}', unanswered + 1);
            alert(errorMsg);
            return;
        }

        const calculatedScore = calculateScore();
        setScore(calculatedScore);
        setShowResults(true);

        
        if (parentAPI.isParentAuthenticated()) {
            setLoading(true);
            try {
                await testAPI.submitTest({
                    answers: answers,
                    score: calculatedScore
                });
                console.log('Test score saved successfully');
            } catch (error) {
                console.error('Error saving test score:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const getScoreMessage = (score) => {
        if (score <= 3) {
            return {
                title: t.lowRiskTitle,
                message: t.lowRiskMessage,
                color: '#10b981'
            };
        } else {
            return {
                title: t.highRiskTitle,
                message: t.highRiskMessage,
                color: '#f59e0b'
            };
        }
    };

    return (
        <div className="test-page">
            <div className="test-container">
                <header className="test-header">
                    <button
                        className="back-button"
                        onClick={() => navigate('/')}
                    >
                        {t.backToHome}
                    </button>
                    <p className="test-subtitle">{t.qchatSubtitle}</p>
                    <h1 className="test-title">{t.qchatTitle}</h1>
                    <p className="test-description">{t.qchatDesc}</p>
                </header>

                <form className="questions-grid">
                    {t.questions.map((question, index) => (
                        <section key={question.id} className="question-card">
                            <div className="question-title">
                                <span className="question-number">Q{index + 1}</span>
                                <h2>{question.text}</h2>
                            </div>
                            <div className="options-list">
                                {question.options.map((option, optIdx) => {
                                    
                                    const englishOption = t_en.questions[index].options[optIdx];
                                    return (
                                        <label key={option} className="option">
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={englishOption}
                                                checked={answers[index] === englishOption}
                                                onChange={() => handleOptionChange(index, englishOption)}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </form>

                {!showResults ? (
                    <button
                        type="button"
                        className="register-button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? t.submittingTest : t.submitTest}
                    </button>
                ) : (
                    <div className="results-container">
                        <div className="results-card" style={{ borderColor: getScoreMessage(score).color }}>
                            <h2 className="results-title">{t.testResults}</h2>
                            <div className="score-display">
                                <span className="score-number">{score}</span>
                                <span className="score-total">/ 10</span>
                            </div>
                            <div className="score-message" style={{ color: getScoreMessage(score).color }}>
                                <h3>{getScoreMessage(score).title}</h3>
                                <p>{getScoreMessage(score).message}</p>
                            </div>
                            <div className="results-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setAnswers(Array(questionsCount).fill(null));
                                        setShowResults(false);
                                        setScore(null);
                                    }}
                                >
                                    {t.retakeTest}
                                </button>
                                {score > 3 && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/child-info', { state: { authorized: true, score, qchatAnswers: answers } })}
                                    >
                                        {t.continueRegistration}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Test;

