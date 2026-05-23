import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Profile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        API.get('/api/auth/profile')
            .then(res => {
                setName(res.data.name);
                setEmail(res.data.email);
                setFetching(false);
            })
            .catch(err => {
                setError('Failed to fetch profile details.');
                setFetching(false);
            });
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updatePayload = { name, email };
            if (password.trim()) {
                updatePayload.password = password;
            }
            const { data } = await API.put('/api/auth/profile', updatePayload);
            setSuccess('🎉 Profile updated successfully!');
            localStorage.setItem('user', JSON.stringify(data.user));
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.error || 'Profile update failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="page-container">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="spinner-text">Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="form-card">
                <div className="form-header">
                    <div className="form-icon">👤</div>
                    <h2 className="form-title">My Profile</h2>
                    <p className="form-subtitle">Manage and update your account details</p>
                </div>

                {error && <div className="form-error">⚠️ {error}</div>}
                {success && <div className="form-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter a new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            minLength={6}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{ padding: '14px', fontSize: '1rem', marginTop: '12px' }}
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
