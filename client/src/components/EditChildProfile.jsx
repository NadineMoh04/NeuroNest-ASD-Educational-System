import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parentAPI, mlAPI } from '../services/api';
import './ChildInfo.css'; 

const EditChildProfile = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('basic');
    const [mlPrediction, setMlPrediction] = useState(null);
    const [mlLoading, setMlLoading] = useState(false);
    
    const [storedAsdPrediction, setStoredAsdPrediction] = useState(null);

    const [formData, setFormData] = useState({
        
        name: '', 
        age: '',
        sex: '',
        ethnicity: '',
        qchatScore: '',

        
        speechDelay: null,
        learningDisorder: null,
        gddId: null,

        
        geneticDisorders: null,
        geneticDisordersNotes: '',
        jaundice: null,

        
        anxietyDisorder: null,
        depression: null,
        socialBehaviouralIssues: null,

        
        familyMemberAsd: null,
    });

    useEffect(() => {
        const fetchChild = async () => {
            try {
                const response = await parentAPI.getChildById(childId);
                const child = response.child;

                
                setFormData(prev => ({
                    ...prev,
                    name: child.name || '',
                    age: child.age || '',
                    sex: child.sex || '',
                    ethnicity: child.ethnicity || '',
                    qchatScore: child.qchatScore || '',
                    speechDelay: child.speechDelay || null,
                    learningDisorder: child.learningDisorder || null,
                    gddId: child.gddId || null,
                    geneticDisorders: child.geneticDisorders || null,
                    geneticDisordersNotes: child.geneticDisordersNotes || '',
                    jaundice: child.jaundice || null,
                    anxietyDisorder: child.anxietyDisorder || null,
                    depression: child.depression || null,
                    socialBehaviouralIssues: child.socialBehaviouralIssues || null,
                    familyMemberAsd: child.familyMemberAsd || null,
                }));
                
                if (child.asdPrediction !== undefined && child.asdPrediction !== null && child.asdPrediction > 0) {
                    setStoredAsdPrediction(child.asdPrediction);
                }
            } catch (err) {
                console.error("Error fetching child:", err);
                alert('Failed to load child profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (childId) {
            fetchChild();
        }
    }, [childId]);

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

    const handleMlPrediction = async () => {
        
        const qchatScore = parseInt(formData.qchatScore) || 0;
        
        const a1ToA10 = Array(10).fill(0).map((_, i) => i < qchatScore ? 1 : 0);

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

        if (features.length !== 15) {
            alert('Cannot run prediction: incomplete data. Please fill Age, Sex, Ethnicity, Jaundice, and Family Member with ASD.');
            return;
        }

        try {
            setMlLoading(true);
            const result = await mlAPI.predictASD(features);
            setMlPrediction(result);
        } catch (error) {
            console.error('ML Prediction failed:', error);
            alert('ML Prediction failed: ' + error.message);
        } finally {
            setMlLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            
            const asdPredictionToSave = mlPrediction?.probability?.asd
                ? Math.round(mlPrediction.probability.asd * 100)
                : (storedAsdPrediction || 0);

            
            const updatePayload = {
                ...formData,
                asdPrediction: asdPredictionToSave
            };
            const response = await parentAPI.updateChild(childId, updatePayload);
            console.log('Child profile updated:', response);
            alert("Profile Updated Successfully!");
            navigate('/parentdashboard');
        } catch (error) {
            console.error('Error updating child profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const ToggleButtons = ({ name, value, onChange, label, subLabel }) => (
        <div className="form-group row-group">
            <div className="label-container">
                <label>{label}</label>
                {subLabel && <span className="sub-label">{subLabel}</span>}
            </div>
            <div className="toggle-options">
                <button
                    type="button"
                    className={`toggle-btn ${value === true ? 'active yes' : ''}`}
                    onClick={() => onChange(name, true)}
                >
                    Yes
                </button>
                <button
                    type="button"
                    className={`toggle-btn ${value === false ? 'active no' : ''}`}
                    onClick={() => onChange(name, false)}
                >
                    No
                </button>
            </div>
        </div>
    );

    if (loading) return <div className="loading">Loading profile...</div>;

    return (
        <div className="child-info-page">
            <div className="child-info-container">
                <header className="page-header">
                    <button className="back-button" onClick={() => navigate('/parentdashboard')}>← Back to Dashboard</button> 
                    <h1>Edit Profile</h1>
                </header>


                <form onSubmit={handleSubmit} className="info-form">

                    
                    <section className={`form-section ${activeSection === 'basic' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('basic')}>
                            <h2>👶 Basic Child Information</h2>
                            <span className="toggle-icon">{activeSection === 'basic' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Age (Years)</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sex</label>
                                <select name="sex" value={formData.sex} onChange={handleInputChange}>
                                    <option value="">Select...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ethnicity</label>
                                <select name="ethnicity" value={formData.ethnicity} onChange={handleInputChange}>
                                    <option value="">Select...</option>
                                    <option value="asian">Asian</option>
                                    <option value="black">Black</option>
                                    <option value="hispanic">Hispanic</option>
                                    <option value="white">White</option>
                                    <option value="mixed">Mixed</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'development' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('development')}>
                            <h2>🗣️ Development & Learning</h2>
                            <span className="toggle-icon">{activeSection === 'development' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <ToggleButtons
                                label="Speech Delay / Language Disorder"
                                name="speechDelay"
                                value={formData.speechDelay}
                                onChange={handleToggleChange}
                            />
                            <ToggleButtons
                                label="Learning Disorder"
                                name="learningDisorder"
                                value={formData.learningDisorder}
                                onChange={handleToggleChange}
                            />
                            <ToggleButtons
                                label="Global Developmental Delay / Intellectual Disability"
                                name="gddId"
                                value={formData.gddId}
                                onChange={handleToggleChange}
                            />
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'medical' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('medical')}>
                            <h2>🧬 Medical & Genetic History</h2>
                            <span className="toggle-icon">{activeSection === 'medical' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <ToggleButtons
                                label="Genetic Disorders"
                                name="geneticDisorders"
                                value={formData.geneticDisorders}
                                onChange={handleToggleChange}
                            />
                            {formData.geneticDisorders && (
                                <div className="form-group">
                                    <label>Notes on Genetic Disorders (Optional)</label>
                                    <textarea
                                        name="geneticDisordersNotes"
                                        value={formData.geneticDisordersNotes}
                                        onChange={handleInputChange}
                                        placeholder="Please specify..."
                                    />
                                </div>
                            )}
                            <ToggleButtons
                                label="Jaundice"
                                subLabel="Jaundice is a condition where a baby or child’s skin and the white part of the eyes look yellow."
                                name="jaundice"
                                value={formData.jaundice}
                                onChange={handleToggleChange}
                            />
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'mental' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('mental')}>
                            <h2>🧠 Mental & Emotional Conditions</h2>
                            <span className="toggle-icon">{activeSection === 'mental' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            <ToggleButtons
                                label="Anxiety Disorder"
                                name="anxietyDisorder"
                                value={formData.anxietyDisorder}
                                onChange={handleToggleChange}
                            />
                            <ToggleButtons
                                label="Depression"
                                name="depression"
                                value={formData.depression}
                                onChange={handleToggleChange}
                            />
                            <ToggleButtons
                                label="Social / Behavioural Issues"
                                name="socialBehaviouralIssues"
                                value={formData.socialBehaviouralIssues}
                                onChange={handleToggleChange}
                            />
                        </div>
                    </section>

                    
                    <section className={`form-section ${activeSection === 'family' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('family')}>
                            <h2>👨‍👩‍👧 Family Background</h2>
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

                    
                    <section className={`form-section ${activeSection === 'prediction' ? 'open' : ''}`}>
                        <div className="section-header" onClick={() => toggleSection('prediction')}>
                            <h2>🤖 ASD Prediction</h2>
                            <span className="toggle-icon">{activeSection === 'prediction' ? '−' : '+'}</span>
                        </div>
                        <div className="section-content">
                            {storedAsdPrediction !== null && !mlPrediction && (
                                <div className="prediction-card" style={{
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    marginBottom: '1rem',
                                    backgroundColor: storedAsdPrediction > 70 ? '#fee2e2' : storedAsdPrediction > 30 ? '#fef3c7' : '#dcfce7',
                                    border: `2px solid ${storedAsdPrediction > 70 ? '#fecdd3' : storedAsdPrediction > 30 ? '#fef3c7' : '#bbf7d0'}`
                                }}>
                                    <p style={{ margin: 0, fontWeight: '600', color: storedAsdPrediction > 70 ? '#dc2626' : storedAsdPrediction > 30 ? '#d97706' : '#16a34a' }}>
                                        Current ASD Risk: {storedAsdPrediction}%
                                        {storedAsdPrediction > 70 ? ' (High Risk)' : storedAsdPrediction > 30 ? ' (Medium Risk)' : ' (Low Risk)'}
                                    </p>
                                </div>
                            )}
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
                                Run the ML model using this child's current profile data to get an updated ASD risk prediction.
                            </p>
                            <button
                                type="button"
                                onClick={handleMlPrediction}
                                disabled={mlLoading || !formData.age || !formData.sex || !formData.ethnicity || formData.jaundice === null || formData.familyMemberAsd === null}
                                className="predict-btn"
                                style={{ width: '100%' }}
                            >
                                {mlLoading ? 'Analyzing...' : '🤖 Run ASD Prediction'}
                            </button>

                            {mlPrediction && mlPrediction.probability && (
                                <div className="prediction-card" style={{
                                    marginTop: '1rem',
                                    padding: '16px',
                                    borderRadius: '10px',
                                    backgroundColor: mlPrediction.probability.asd > 0.7 ? '#fee2e2' : mlPrediction.probability.asd > 0.3 ? '#fef3c7' : '#dcfce7',
                                    border: `2px solid ${mlPrediction.probability.asd > 0.7 ? '#fecdd3' : mlPrediction.probability.asd > 0.3 ? '#fef3c7' : '#bbf7d0'}`
                                }}>
                                    <h4 style={{ margin: '0 0 8px 0' }}>🤖 New Prediction Result</h4>
                                    <p style={{ margin: '4px 0', fontWeight: '700', fontSize: '1.2rem', color: mlPrediction.probability.asd > 0.7 ? '#dc2626' : mlPrediction.probability.asd > 0.3 ? '#d97706' : '#16a34a' }}>
                                        ASD Risk: {Math.round(mlPrediction.probability.asd * 100)}%
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#4b5563' }}>
                                        Prediction: <strong>{mlPrediction.prediction === 1 ? 'ASD Likely' : 'ASD Unlikely'}</strong>
                                    </p>
                                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: '#4b5563' }}>
                                        Confidence: {Math.round(mlPrediction.confidence * 100)}%
                                    </p>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#9ca3af' }}>
                                        ✓ This result will be saved when you click "Update Profile".
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <footer className="form-footer">
                        <button type="submit" className="save-btn">Update Profile</button>
                    </footer>

                </form>
            </div>
        </div>
    );
};

export default EditChildProfile;
