import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/api/auth/login', form);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="form-container animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="form-card">
                <div className="form-header">
                    <div className="form-icon">🔑</div>
                    <h2 className="form-title">Welcome Back</h2>
                    <p className="form-subtitle">Sign in to manage your events and registrations</p>
                </div>

                {error && <div className="form-error">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{ padding: '14px', fontSize: '1rem', marginTop: '8px' }}
                    >
                        Login
                    </button>
                </form>

                <div className="form-footer">
                    No account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;