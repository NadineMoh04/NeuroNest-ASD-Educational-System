import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChildManagement.css';

const ChildManagement = () => {
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [filteredChildren, setFilteredChildren] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingChild, setEditingChild] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        age: '',
        sex: '',
        learningLevel: ''
    });

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/login');
            return;
        }
        fetchChildren();
    }, [navigate]);

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/children', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setChildren(response.data.children);
            setFilteredChildren(response.data.children);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching children:', err);
            setError('Failed to load children');
            setLoading(false);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/login');
            }
        }
    };

    const handleDelete = async (parentId, childId, childName) => {
        if (!window.confirm(`Are you sure you want to delete child "${childName}"?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/parents/${parentId}/children/${childId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            
            const updatedChildren = children.filter(child => child.parentId !== parentId);
            setChildren(updatedChildren);
            setFilteredChildren(
                updatedChildren.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.parentName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            alert('Child and parent account deleted successfully');
        } catch (err) {
            console.error('Error deleting child:', err);
            alert('Failed to delete child: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleEdit = (child) => {
        setEditingChild(child._id);
        setEditForm({
            name: child.name,
            age: child.age,
            sex: child.sex || '',
            learningLevel: child.learningLevel || 'beginner'
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('adminToken');
            const child = children.find(c => c._id === editingChild);

            const response = await axios.put(
                `http://localhost:5000/api/admin/parents/${child.parentId}/children/${editingChild}`,
                editForm,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            
            const updatedChildren = children.map(c =>
                c._id === editingChild ? { ...c, ...response.data.child } : c
            );
            setChildren(updatedChildren);
            setFilteredChildren(
                updatedChildren.filter(c =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.parentName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            setEditingChild(null);
            alert('Child updated successfully');
        } catch (err) {
            console.error('Error updating child:', err);
            alert('Failed to update child: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleCancelEdit = () => {
        setEditingChild(null);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredChildren(children);
        } else {
            setFilteredChildren(
                children.filter(c =>
                    c.name.toLowerCase().includes(query.toLowerCase()) ||
                    c.parentName.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    if (loading) {
        return (
            <div className="child-management">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading children...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="child-management">
            
            <header className="admin-header">
                <div className="header-content">
                    <h1>Child Management</h1>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/admin/dashboard')}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <div className="management-content">
                {error && <div className="error-banner">{error}</div>}

                <div className="management-header">
                    <h2>All Children ({children.length})</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="🔍 Search by child or parent name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        {searchQuery && (
                            <span className="search-count">{filteredChildren.length} result{filteredChildren.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>

                {children.length === 0 ? (
                    <div className="no-data">
                        <p>No children found</p>
                    </div>
                ) : filteredChildren.length === 0 ? (
                    <div className="no-data">
                        <p>No children match "{searchQuery}"</p>
                    </div>
                ) : (
                    <div className="children-grid">
                        {filteredChildren.map(child => (
                            <div key={child._id} className="child-card">
                                {editingChild === child._id ? (
                                    
                                    <form onSubmit={handleUpdate} className="edit-form">
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Age:</label>
                                            <input
                                                type="number"
                                                value={editForm.age}
                                                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                                min="1"
                                                max="18"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Sex:</label>
                                            <select
                                                value={editForm.sex}
                                                onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Learning Level:</label>
                                            <select
                                                value={editForm.learningLevel}
                                                onChange={(e) => setEditForm({ ...editForm, learningLevel: e.target.value })}
                                            >
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                            </select>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn btn-save">Save</button>
                                            <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    
                                    <>
                                        <div className="child-info">
                                            <h3>👶 {child.name}</h3>
                                            <p className="age">🎂 Age: {child.age} years</p>
                                            <p className="sex">⚥ Sex: {child.sex || 'Not specified'}</p>
                                            <p className="level">📚 Level: {child.learningLevel || 'beginner'}</p>
                                            <p className="parent">👨‍👩‍👧‍👦 Parent: {child.parentName}</p>
                                            <p className="parent-email">📧 {child.parentEmail}</p>
                                            <p className="created-date">
                                                📅 Created: {new Date(child.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="child-actions">
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEdit(child)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(child.parentId, child._id, child.name)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildManagement;