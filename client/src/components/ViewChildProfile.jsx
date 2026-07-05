import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parentAPI } from '../services/api';
import './ViewChildProfile.css';

const ViewChildProfile = () => {
    const { childId } = useParams();
    const navigate = useNavigate();
    const [child, setChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editAge, setEditAge] = useState(false);
    const [age, setAge] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchChild = async () => {
            try {
                const response = await parentAPI.getChildById(childId);
                setChild(response.child);
                setAge(response.child.age || '');
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

    const handleSaveAge = async () => {
        try {
            setSaving(true);
            await parentAPI.updateChild(childId, { age: parseInt(age) });
            setChild(prev => ({ ...prev, age: parseInt(age) }));
            setEditAge(false);
            alert('Age updated successfully!');
        } catch (err) {
            console.error('Error updating age:', err);
            alert('Failed to update age. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="view-profile-page"><div className="loading">Loading profile...</div></div>;
    if (!child) return <div className="view-profile-page"><div className="error">Child not found</div></div>;

    const yesNoDisplay = (value) => {
        return (
            <div className="toggle-display-group">
                <span className={`toggle-display-btn ${value === true ? 'active-yes' : ''}`}>Yes</span>
                <span className={`toggle-display-btn ${value === false ? 'active-no' : ''}`}>No</span>
            </div>
        );
    };

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '—';

    return (
        <div className="view-profile-page">
            <div className="view-profile-container">
                <header className="profile-header">
                    <button className="back-button" onClick={() => navigate('/parentdashboard')}>
                        ← Back to Dashboard
                    </button>
                    <h1>Child Profile</h1>
                    <p className="profile-subtitle">Registered information from assessment</p>
                </header>

                <div className="profile-content">

                    
                    <section className="profile-section">
                        <h2>🧠 Assessment & Behavioral Scores</h2>
                        <div className="field-row">
                            <span className="field-label">Q-CHAT-10 Score</span>
                            <span className="field-value">{child.qchatScore !== undefined ? child.qchatScore : '—'}</span>
                        </div>
                        <p className="field-help">Based on your child's current behaviors. Score range: 0 (low risk) to 10 (high risk)</p>
                        {child.asdPrediction !== undefined && child.asdPrediction > 0 && (
                            <div className={`asd-prediction-bar ${child.asdPrediction > 70 ? 'high' : child.asdPrediction > 30 ? 'medium' : 'low'}`}>
                                <div className="prediction-info">
                                    <span className="prediction-title">ASD Prediction Risk</span>
                                    <span className="prediction-percent">{child.asdPrediction}%</span>
                                    <span className="prediction-risk">
                                        {child.asdPrediction > 70 ? 'High Risk' : child.asdPrediction > 30 ? 'Medium Risk' : 'Low Risk'}
                                    </span>
                                </div>
                                <div className="prediction-bar-bg">
                                    <div className="prediction-bar-fill" style={{ width: `${child.asdPrediction}%` }}></div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Basic Child Information - same as ChildInfo */}
                    <section className="profile-section">
                        <h2>👶 Basic Child Information</h2>
                        <div className="field-row">
                            <span className="field-label">Name</span>
                            <span className="field-value">{child.name || '—'}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">Age (Years)</span>
                            {editAge ? (
                                <div className="age-edit-inline">
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        min="1"
                                        max="18"
                                    />
                                    <button onClick={handleSaveAge} disabled={saving} className="age-save-btn">
                                        {saving ? '...' : '✓'}
                                    </button>
                                    <button onClick={() => { setEditAge(false); setAge(child.age); }} className="age-cancel-btn">
                                        ✗
                                    </button>
                                </div>
                            ) : (
                                <span className="field-value">
                                    {child.age || '—'} years
                                    <button onClick={() => setEditAge(true)} className="edit-pencil" title="Edit Age">✏️</button>
                                </span>
                            )}
                        </div>
                        <div className="field-row">
                            <span className="field-label">Sex</span>
                            <span className="field-value">{capitalize(child.sex)}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">Ethnicity</span>
                            <span className="field-value">{capitalize(child.ethnicity)}</span>
                        </div>
                    </section>

                    {/* Medical & Genetic History - same as ChildInfo */}
                    <section className="profile-section">
                        <h2>🧬 Medical & Genetic History</h2>
                        <div className="field-row-toggle">
                            <div className="field-label-group">
                                <span className="field-label">Jaundice</span>
                                <span className="field-sublabel">Jaundice is a condition where a baby or child's skin and the white part of the eyes look yellow.</span>
                            </div>
                            <span className="field-value">{yesNoDisplay(child.jaundice)}</span>
                        </div>
                    </section>

                    
                    <section className="profile-section">
                        <h2>👨‍👩‍👧 Family Background</h2>
                        <div className="field-row-toggle">
                            <span className="field-label">Family Member with ASD</span>
                            <span className="field-value">{yesNoDisplay(child.familyMemberAsd)}</span>
                        </div>
                    </section>

                    
                    <section className="profile-section">
                        <h2>📝 Test Metadata</h2>
                        <div className="field-row">
                            <span className="field-label">Who Completed the Test</span>
                            <span className="field-value">{child.whoCompletedTest || '—'}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">Profile Created</span>
                            <span className="field-value">{child.createdAt ? new Date(child.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default ViewChildProfile;
