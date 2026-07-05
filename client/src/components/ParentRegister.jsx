import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const ParentRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        kidname: ''
        
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            
            const registrationData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                kidname: formData.kidname
            };
            
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
            
            
            navigate('/child-info');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration setup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>Parent Registration</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="kidname">Kid's Name</label>
                        <input
                            type="text"
                            id="kidname"
                            name="kidname"
                            value={formData.kidname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="login-link">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default ParentRegister;