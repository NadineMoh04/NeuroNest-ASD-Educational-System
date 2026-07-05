import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ParentManagement.css';

const ParentManagement = () => {
    const navigate = useNavigate();
    const [parents, setParents] = useState([]);
    const [filteredParents, setFilteredParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingParent, setEditingParent] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/login');
            return;
        }
        fetchParents();
    }, [navigate]);

    const fetchParents = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:5000/api/admin/parents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setParents(response.data.parents);
            setFilteredParents(response.data.parents);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching parents:', err);
            setError('Failed to load parents');
            setLoading(false);
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/login');
            }
        }
    };

    const handleDelete = async (parentId, parentName) => {
        if (!window.confirm(`Are you sure you want to delete parent "${parentName}" and all their children?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/parents/${parentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            
            const updatedParents = parents.filter(parent => parent._id !== parentId);
            setParents(updatedParents);
            setFilteredParents(
                updatedParents.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
            alert('Parent deleted successfully');
        } catch (err) {
            console.error('Error deleting parent:', err);
            alert('Failed to delete parent: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleEdit = (parent) => {
        setEditingParent(parent._id);
        setEditForm({
            name: parent.name,
            email: parent.email
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `http://localhost:5000/api/admin/parents/${editingParent}`,
                editForm,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            
            const updatedParents = parents.map(parent =>
                parent._id === editingParent ? response.data.parent : parent
            );
            setParents(updatedParents);
            setFilteredParents(
                updatedParents.filter(p =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );

            setEditingParent(null);
            alert('Parent updated successfully');
        } catch (err) {
            console.error('Error updating parent:', err);
            alert('Failed to update parent: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleCancelEdit = () => {
        setEditingParent(null);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredParents(parents);
        } else {
            setFilteredParents(
                parents.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.email.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    if (loading) {
        return (
            <div className="parent-management">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading parents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="parent-management">
            
            <header className="admin-header">
                <div className="header-content">
                    <h1>Parent Management</h1>
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
                    <h2>All Parents ({parents.length})</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="🔍 Search by name or email..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        {searchQuery && (
                            <span className="search-count">{filteredParents.length} result{filteredParents.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                </div>

                {parents.length === 0 ? (
                    <div className="no-data">
                        <p>No parents found</p>
                    </div>
                ) : filteredParents.length === 0 ? (
                    <div className="no-data">
                        <p>No parents match "{searchQuery}"</p>
                    </div>
                ) : (
                    <div className="parents-grid">
                        {filteredParents.map(parent => (
                            <div key={parent._id} className="parent-card">
                                {editingParent === parent._id ? (
                                    
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
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                required
                                            />
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
                                        <div className="parent-info">
                                            <h3>{parent.name}</h3>
                                            <p className="email">{parent.email}</p>
                                            <p className="children-count">
                                                👶 Children: {parent.children?.length || 0}
                                            </p>
                                            <p className="created-date">
                                                📅 Joined: {new Date(parent.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="parent-actions">
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEdit(parent)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(parent._id, parent.name)}
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

export default ParentManagement;