import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mlAPI, parentAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext.jsx';
import './ChildInfo.css';

const ChildInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isArabic, t } = useLanguage();
    const [activeSection, setActiveSection] = useState('assessment');
    const [mlPrediction, setMlPrediction] = useState(null); 
    const [mlLoading, setMlLoading] = useState(false); 

    useEffect(() => {
        if (!location.state?.authorized && !location.state?.score) {
            
            if (!location.state?.score) {
                navigate('/test');
            }
        }
    }, [location, navigate]);

    const [formData, setFormData] = useState({
        
        parentName: '',
        parentEmail: '',
        parentPassword: '',
        confirmPassword: '',
        kidname: '',

        
        qchatScore: location.state?.score || location.state?.qchatScore || '',
        
        qchatAnswers: Array(10).fill(null),

        
        age: '',
        sex: '',
        ethnicity: '',

        
        speechDelay: null,
        learningDisorder: null,
        gddId: null,

        
        geneticDisorders: null,
        jaundice: null,

        
        anxietyDisorder: null,
        depression: null,
        socialBehaviouralIssues: null,

        
        familyMemberAsd: null,

        
        whoCompletedTest: '',
    });

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section); 
    };

    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value 
        }));
    };

    const handleToggleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const requiredFields = [
            
            
            'qchatScore',
            

            
            'age',
            'sex',
            'ethnicity',

            
            
            
            

            
            
            'jaundice',

            
            
            
            

            
            'familyMemberAsd',

            
            'whoCompletedTest',

            
            'parentName',
            'parentEmail',
            'parentPassword',
            'confirmPassword',
            'kidname'
        ];

        const missingFields = requiredFields.filter(field => {
            
            if (['jaundice', 'age', 'familyMemberAsd'].includes(field)) {
                return formData[field] === null || formData[field] === undefined;
            }
            
            return !formData[field];
        });

        if (missingFields.length > 0) {
            alert(isArabic ? 'يرجى ملء جميع الحقول المطلوبة لإجراء التنبؤ بدقة.' : `Please fill in ALL required fields for accurate prediction: ${missingFields.join(', ')}`);

            
            const sectionMap = {
                parentName: 'parent',
                parentEmail: 'parent',
                parentPassword: 'parent',
                confirmPassword: 'parent',
                kidname: 'parent',

                
                qchatScore: 'assessment',
                

                age: 'basic',
                sex: 'basic',
                ethnicity: 'basic',

                
                
                

                
                jaundice: 'medical',

                
                
                

                familyMemberAsd: 'family',

                whoCompletedTest: 'metadata'
            };

            
            const firstMissingField = missingFields[0];
            const targetSection = sectionMap[firstMissingField] || 'parent';
            setActiveSection(targetSection);

            return;
        }

        
        if (formData.parentPassword !== formData.confirmPassword) {
            alert(isArabic ? 'كلمتا المرور غير متطابقتين!' : 'Passwords do not match!');
            setActiveSection('parent');
            return;
        }

        
        if (formData.parentPassword.length < 6) {
            alert(isArabic ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters long');
            setActiveSection('parent');
            return;
        }

        try {
            
            const { confirmPassword, ...registrationDataWithoutConfirm } = formData;

            const registrationData = {
                name: formData.parentName || 'Parent User',
                email: formData.parentEmail || 'parent@example.com',
                password: formData.parentPassword || 'password123',
                kidname: formData.kidname || 'Child Name',
                childInfo: {
                    ...registrationDataWithoutConfirm,
                    qchatScore: location.state?.score || formData.qchatScore || 0,
                    
                    asdPrediction: mlPrediction?.probability?.asd
                        ? Math.round(mlPrediction.probability.asd * 100)
                        : (parseInt(location.state?.score || formData.qchatScore || 0) * 10)
                }
            };

            console.log('Sending registration data:', registrationData);

            
            await parentAPI.register(registrationData);

            console.log('Registration Successful');

            
            navigate('/parentdashboard');
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);
            alert('Registration failed: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleMlPrediction = async () => {
        console.log('DEBUG: handleMlPrediction called');
        console.log('DEBUG: location.state:', location.state);
        console.log('DEBUG: formData:', formData);

        
        
        const requiredPredictionFields = [
            'qchatScore',   
            'age',          
            'jaundice',          
            'familyMemberAsd',   
            'sex',               
            'ethnicity'          
        ];

        
        const formQchatScore = parseInt(formData.qchatScore);
        if (isNaN(formQchatScore) || formQchatScore < 0 || formQchatScore > 10) {
            alert(isArabic ? 'يرجى إدخال درجة Q-CHAT-10 صحيحة بين 0 و 10' : 'Please enter a valid Q-CHAT-10 score between 0 and 10');
            setActiveSection('assessment');
            return;
        }

        const missingPredictionFields = requiredPredictionFields.filter(field => {
            
            if (['jaundice', 'familyMemberAsd'].includes(field)) {
                return formData[field] === null || formData[field] === undefined;
            }
            
            return !formData[field];
        });

        if (missingPredictionFields.length > 0) {
            console.log('DEBUG: Missing required fields for prediction:', missingPredictionFields);
            alert(isArabic ? 'يرجى ملء جميع الحقول المطلوبة للتنبؤ بطيف التوحد بدقة.' : `Please fill in ALL required fields for accurate ASD prediction: ${missingPredictionFields.join(', ')}`);

            
            const sectionMap = {
                qchatScore: 'assessment',
                age: 'basic',
                jaundice: 'medical',
                familyMemberAsd: 'family',
                sex: 'basic',
                ethnicity: 'basic'
            };

            const firstMissing = missingPredictionFields[0];
            const targetSection = sectionMap[firstMissing] || 'assessment';
            setActiveSection(targetSection);

            return;
        }

        console.log('DEBUG: All validations passed, preparing features');

        
        

        
        const qchatScore = parseInt(location.state?.score || location.state?.qchatScore || 0);
        const qchatAnswers = location.state?.qchatAnswers || [];

        
        
        const qchatToFeature = (answer, questionIndex) => {
            if (!answer) return 0;

            const optionIndex = ['always', 'usually', 'sometimes', 'rarely', 'never'].findIndex(opt =>
                answer.toLowerCase().includes(opt)
            );

            
            if (questionIndex < 9) {
                return optionIndex >= 2 ? 1 : 0;
            }
            
            else {
                return optionIndex <= 2 ? 1 : 0;
            }
        };

        
        const a1ToA10 = qchatAnswers.length === 10
            ? qchatAnswers.map((answer, idx) => qchatToFeature(answer, idx))
            : Array(10).fill(0); 

        
        const features = [
            
            ...a1ToA10,

            
            parseInt(formData.age) || 0,

            
            formData.jaundice ? 1 : 0,

            
            formData.familyMemberAsd ? 1 : 0,

            
            formData.sex === 'male' ? 1 : 0,

            
            formData.ethnicity === 'asian' ? 4 :
                formData.ethnicity === 'black' ? 1 :
                    formData.ethnicity === 'hispanic' ? 3 :
                        formData.ethnicity === 'white' ? 5 :
                            formData.ethnicity === 'mixed' ? 6 : 7
        ];

        console.log('DEBUG: Sending features to ML model:', features);
        console.log('DEBUG: Feature count:', features.length);

        
        if (features.length !== 15) {
            console.error('DEBUG: Feature count mismatch:', features.length);
            alert(`Invalid feature count. Expected 15, got ${features.length}. Please check all required fields are filled.`);
            return;
        }

        try {
            console.log('DEBUG: Calling ML API...');
            setMlLoading(true);
            const result = await mlAPI.predictASD(features);
            console.log('DEBUG: ML Prediction result received:', result);
            console.log('DEBUG: Result structure:', Object.keys(result));
            console.log('DEBUG: Result prediction:', result.prediction);
            console.log('DEBUG: Result probability:', result.probability);

            
            setMlPrediction(null);
            setTimeout(() => {
                setMlPrediction(result);
                console.log('DEBUG: mlPrediction state set to:', result);
            }, 0);
        } catch (error) {
            console.error('DEBUG: ML Prediction failed:', error);
            console.error('DEBUG: Error details:', error.response || error.message);

            
            if (error.message.includes('Failed to fetch')) {
                alert('Cannot connect to ML service. Please make sure the ML service is running on port 6000.');
            } else if (error.message.includes('400')) {
                alert('Invalid data sent to ML model. Please check all required fields are filled.');
            } else {
                alert(`ML Prediction failed: ${error.message}`);
            }
        } finally {
            console.log('DEBUG: Setting loading to false');
            setMlLoading(false);
        }
    };

    const ToggleButtons = ({ name, value, onChange, label, subLabel }) => (
        <div className="form-group row-group">
            <div className="label-container">
                <label>{t(label)}</label>
                {subLabel && <span className="sub-label">{t(subLabel)}</span>}
            </div>
            <div className="toggle-options">
                <button
                    type="button"
                    className={`toggle-btn ${value === true ? 'active yes' : ''}`}
                    onClick={() => onChange(name, true)}
                >
                    {t('Yes')}
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${value === false ? 'active no' : ''}`}
                    onClick={() => onChange(name, false)}
                >
                    {t('No')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="child-info-page">
            <div className="child-info-container">
                <header className="page-header">
                    <div className="progress-indicator">{t('Step 2 of 3')}</div>
                    <h1>{t('Child Information')}</h1>
                    <p className="reassurance-text">
                        {t('This information helps us personalize learning and support for your child.')}
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="info-form">

                    
                    <section className={`form-section ${activeSection === 'parent' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('parent')}>
                            <h2>{t('👨‍👩‍👧 Parent Information')}</h2>
                            <span className="toggle-icon">{activeSection === 'parent' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <div className="form-group">
                                <label>{t('Parent Full Name')}</label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleInputChange}
                                    placeholder={t("Enter parent's full name")}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Parent Email')}</label>
                                <input
                                    type="email"
                                    name="parentEmail"
                                    value={formData.parentEmail}
                                    onChange={handleInputChange}
                                    placeholder={t("Enter parent's email")}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Parent Password')}</label>
                                <input
                                    type="password"
                                    name="parentPassword"
                                    value={formData.parentPassword}
                                    onChange={handleInputChange}
                                    placeholder={t('Create a password')}
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Confirm Password')}</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder={t('Confirm your password')}
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Child\'s Name')}</label>
                                <input
                                    type="text"
                                    name="kidname"
                                    value={formData.kidname}
                                    onChange={handleInputChange}
                                    placeholder={t('Enter child\'s name')}
                                />
                            </div>
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'assessment' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('assessment')}>
                            <h2>{t('🧠 Assessment & Behavioral Scores')}</h2>
                            <span className="toggle-icon">{activeSection === 'assessment' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <div className="form-group">
                                <label>{t('Q-CHAT-10 Score')}</label>
                                <input
                                    type="number"
                                    name="qchatScore"
                                    value={formData.qchatScore}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="10"
                                    placeholder={t('Enter score (0-10)')}
                                />
                                <small className="help-text">
                                    {t('Based on your child\'s current behaviors. Score range: 0 (low risk) to 10 (high risk)')}
                                </small>
                            </div>


                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'basic' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('basic')}>
                            <h2>{t('👶 Basic Child Information')}</h2>
                            <span className="toggle-icon">{activeSection === 'basic' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <div className="form-group">
                                <label>{t('Age (Years)')}</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Sex')}</label>
                                <select name="sex" value={formData.sex} onChange={handleInputChange}>
                                    <option value="">{t('Select...')}</option>
                                    <option value="male">{t('Male')}</option>
                                    <option value="female">{t('Female')}</option>
                                    <option value="other">{t('Other')}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{t('Ethnicity')}</label>
                                <select name="ethnicity" value={formData.ethnicity} onChange={handleInputChange}>
                                    <option value="">{t('Select...')}</option>
                                    <option value="asian">{t('Asian')}</option>
                                    <option value="black">{t('Black')}</option>
                                    <option value="hispanic">{t('Hispanic')}</option>
                                    <option value="white">{t('White')}</option>
                                    <option value="mixed">{t('Mixed')}</option>
                                    <option value="other">{t('Other')}</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'medical' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('medical')}>
                            <h2>{t('🧬 Medical & Genetic History')}</h2>
                            <span className="toggle-icon">{activeSection === 'medical' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <ToggleButtons
                                label="Jaundice"
                                subLabel="Jaundice is a condition where a baby or child’s skin and the white part of the eyes look yellow."
                                name="jaundice"
                                value={formData.jaundice}
                                onChange={handleToggleChange}
                            />
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'family' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('family')}>
                            <h2>{t('👨‍👩‍👧 Family Background')}</h2>
                            <span className="toggle-icon">{activeSection === 'family' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <ToggleButtons
                                label="Family Member with ASD"
                                name="familyMemberAsd"
                                value={formData.familyMemberAsd}
                                onChange={handleToggleChange}
                            />
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'metadata' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('metadata')}>
                            <h2>{t('📝 Respondent Information')}</h2>
                            <span className="toggle-icon">{activeSection === 'metadata' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <div className="form-group">
                                <label>{t('Who Completed the Test')}</label>
                                <select name="whoCompletedTest" value={formData.whoCompletedTest} onChange={handleInputChange}>
                                    <option value="">{t('Select...')}</option>
                                    <option value="Parent">{t('Parent')}</option>
                                    <option value="Guardian">{t('Guardian')}</option>
                                    <option value="Teacher">{t('Teacher')}</option>
                                    <option value="Specialist">{t('Specialist')}</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <footer className="form-footer">
                        <div className="prediction-section">
                            <button
                                type="button"
                                className="predict-btn"
                                onClick={handleMlPrediction}
                                disabled={mlLoading || !formData.age || formData.jaundice === null || formData.jaundice === undefined || formData.familyMemberAsd === null || formData.familyMemberAsd === undefined || !formData.sex || !formData.ethnicity}
                            >
                                {mlLoading ? t('Analyzing...') : t('Get ASD Prediction')}
                            </button>

                            {mlPrediction && mlPrediction.probability && (
                                <div className="ml-results">
                                    <h3>{t('🤖 ML Prediction Results')}</h3>
                                    <div className="prediction-card" style={{
                                        borderLeft: `4px solid ${(mlPrediction.prediction === 1) ? '#ef4444' : '#10b981'}`
                                    }}>
                                        <div className="prediction-main">
                                            <span className="prediction-label">
                                                {(mlPrediction.prediction === 1) ? t('ASD Likely') : t('ASD Unlikely')}
                                            </span>
                                            <span className="confidence">
                                                {t('Confidence:')} {mlPrediction.confidence ? (mlPrediction.confidence * 100).toFixed(1) : 'N/A'}%
                                            </span>
                                        </div>
                                        <div className="prediction-details">
                                            <div className="probability-bar">
                                                <div className="prob-label">{t('ASD Probability:')}</div>
                                                <div className="prob-bars">
                                                    <div className="prob-bar no-asd">
                                                        <div
                                                            className="prob-fill"
                                                            style={{ width: `${(mlPrediction.probability.no_asd || 0) * 100}%` }}
                                                        ></div>
                                                        <span>{t('No ASD:')} {((mlPrediction.probability.no_asd || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="prob-bar asd">
                                                        <div
                                                            className="prob-fill"
                                                            style={{ width: `${(mlPrediction.probability.asd || 0) * 100}%` }}
                                                        ></div>
                                                        <span>{t('ASD:')} {((mlPrediction.probability.asd || 0) * 100).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="risk-level" style={{
                                                backgroundColor: mlPrediction.risk_level === 'High' ? '#fee2e2' :
                                                    mlPrediction.risk_level === 'Medium' ? '#fef3c7' : '#dcfce7',
                                                color: mlPrediction.risk_level === 'High' ? '#dc2626' :
                                                    mlPrediction.risk_level === 'Medium' ? '#d97706' : '#16a34a'
                                            }}>
                                                {t('Risk Level:')} {t(mlPrediction.risk_level) || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="save-btn">{t('Save & Continue')}</button>
                    </footer>

                </form>
            </div>
        </div>
    );
};

export default ChildInfo;
