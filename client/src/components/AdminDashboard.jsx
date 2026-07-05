import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalParents: 0,
        totalChildren: 0,
        riskDistribution: { lowRisk: 0, mediumRisk: 0, highRisk: 0, noAssessment: 0 },
        levelBreakdown: { beginner: 0, intermediate: 0, advanced: 0 }
    });
    const [recentActivity, setRecentActivity] = useState({
        parents: [],
        children: []
    });
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        const admin = JSON.parse(localStorage.getItem('admin'));

        if (!adminToken || !admin) {
            navigate('/admin/login');
            return;
        }

        fetchDashboardData();
    }, [navigate, location.pathname]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setStats(response.data.stats);
            setRecentActivity(response.data.recentActivity);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data');
            setLoading(false);

            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
                navigate('/admin/login');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/');
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
                {icon}
            </div>
            <div className="stat-content">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );

    
    const riskPercent = (count) => {
        const total = stats.riskDistribution.lowRisk + stats.riskDistribution.mediumRisk + stats.riskDistribution.highRisk + stats.riskDistribution.noAssessment;
        return total > 0 ? Math.round((count / total) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            
            <header className="admin-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <div className="header-actions">
                        <span className="admin-name">
                            👤 {JSON.parse(localStorage.getItem('admin'))?.name}
                        </span>
                        <button className="btn btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            
            <nav className="admin-nav">
                <button
                    className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >
                    📊 Dashboard
                </button>
                <button
                    className={`nav-tab ${activeTab === 'parents' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/parents')}
                >
                    👨‍👩‍👧‍👦 Manage Parents
                </button>
                <button
                    className={`nav-tab ${activeTab === 'children' ? 'active' : ''}`}
                    onClick={() => navigate('/admin/children')}
                >
                    👶 Manage Children
                </button>
            </nav>

            
            {activeTab === 'dashboard' && (
                <div className="dashboard-content">
                    {error && <div className="error-banner">{error}</div>}

                    
                    <div className="stats-grid">
                        <StatCard
                            title="Total Parents"
                            value={stats.totalParents}
                            icon="👨‍👩‍👧‍👦"
                            color="#4CAF50"
                        />
                        <StatCard
                            title="Total Children"
                            value={stats.totalChildren}
                            icon="👶"
                            color="#9C27B0"
                        />
                        <StatCard
                            title="High Risk Children"
                            value={stats.riskDistribution.highRisk}
                            icon="⚠️"
                            color="#f44336"
                        />
                    </div>

                    
                    <div className="insights-section">
                        <h2>🧠 ASD Risk Distribution</h2>
                        <p className="insights-subtitle">Based on ML prediction scores across all children</p>
                        <div className="risk-bars">
                            <div className="risk-row">
                                <div className="risk-label">
                                    <span className="risk-dot high"></span>
                                    High Risk
                                </div>
                                <div className="risk-bar-bg">
                                    <div
                                        className="risk-bar-fill high"
                                        style={{ width: `${riskPercent(stats.riskDistribution.highRisk)}%` }}
                                    ></div>
                                </div>
                                <span className="risk-count">{stats.riskDistribution.highRisk}</span>
                            </div>
                            <div className="risk-row">
                                <div className="risk-label">
                                    <span className="risk-dot medium"></span>
                                    Medium Risk
                                </div>
                                <div className="risk-bar-bg">
                                    <div
                                        className="risk-bar-fill medium"
                                        style={{ width: `${riskPercent(stats.riskDistribution.mediumRisk)}%` }}
                                    ></div>
                                </div>
                                <span className="risk-count">{stats.riskDistribution.mediumRisk}</span>
                            </div>
                            <div className="risk-row">
                                <div className="risk-label">
                                    <span className="risk-dot low"></span>
                                    Low Risk
                                </div>
                                <div className="risk-bar-bg">
                                    <div
                                        className="risk-bar-fill low"
                                        style={{ width: `${riskPercent(stats.riskDistribution.lowRisk)}%` }}
                                    ></div>
                                </div>
                                <span className="risk-count">{stats.riskDistribution.lowRisk}</span>
                            </div>
                            <div className="risk-row">
                                <div className="risk-label">
                                    <span className="risk-dot none"></span>
                                    No Assessment
                                </div>
                                <div className="risk-bar-bg">
                                    <div
                                        className="risk-bar-fill none"
                                        style={{ width: `${riskPercent(stats.riskDistribution.noAssessment)}%` }}
                                    ></div>
                                </div>
                                <span className="risk-count">{stats.riskDistribution.noAssessment}</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="insights-section">
                        <h2>📚 Learning Levels</h2>
                        <div className="level-cards">
                            <div className="level-stat beginner">
                                <span className="level-stat-value">{stats.levelBreakdown.beginner}</span>
                                <span className="level-stat-label">Beginner</span>
                            </div>
                            <div className="level-stat intermediate">
                                <span className="level-stat-value">{stats.levelBreakdown.intermediate}</span>
                                <span className="level-stat-label">Intermediate</span>
                            </div>
                            <div className="level-stat advanced">
                                <span className="level-stat-value">{stats.levelBreakdown.advanced}</span>
                                <span className="level-stat-label">Advanced</span>
                            </div>
                        </div>
                    </div>

                    
                    <div className="recent-activity">
                        
                        <div className="activity-section">
                            <h2>👶 Recent Children</h2>
                            <div className="activity-list">
                                {recentActivity.children && recentActivity.children.length > 0 ? (
                                    recentActivity.children.map(child => (
                                        <div key={child._id} className="activity-item child-activity-item">
                                            <div className="activity-info">
                                                <strong>{child.name}</strong>
                                                <span>
                                                    Age {child.age} • Q-CHAT: {child.qchatScore ?? '—'} •
                                                    <span className={`risk-badge ${child.asdPrediction > 70 ? 'risk-high' : child.asdPrediction > 30 ? 'risk-medium' : child.asdPrediction > 0 ? 'risk-low' : 'risk-none'}`}>
                                                        {child.asdPrediction > 70 ? 'High Risk' : child.asdPrediction > 30 ? 'Medium Risk' : child.asdPrediction > 0 ? 'Low Risk' : 'No Assessment'}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="activity-date">
                                                <span className="parent-tag">👨‍👩‍👧 {child.parentName}</span>
                                                {new Date(child.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-activity">No children registered yet</p>
                                )}
                            </div>
                        </div>

                        
                        <div className="activity-section">
                            <h2>👨‍👩‍👧‍👦 Recent Parent Registrations</h2>
                            <div className="activity-list">
                                {recentActivity.parents.length > 0 ? (
                                    recentActivity.parents.map(parent => (
                                        <div key={parent._id} className="activity-item">
                                            <div className="activity-info">
                                                <strong>{parent.name}</strong>
                                                <span>{parent.email}</span>
                                            </div>
                                            <div className="activity-date">
                                                {new Date(parent.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-activity">No recent parent registrations</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
