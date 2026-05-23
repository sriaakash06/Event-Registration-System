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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back 👋</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input style={styles.input} placeholder="Email" type="email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input style={styles.input} placeholder="Password" type="password"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button type="submit" style={styles.btn}>Login</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '15px' }}>
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', marginTop: '60px' },
    card: {
        backgroundColor: 'white', padding: '40px', borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
    },
    title: { textAlign: 'center', marginBottom: '25px', color: '#2c3e50' },
    input: {
        width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
        border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box'
    },
    btn: {
        width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white',
        border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer'
    },
    error: { color: 'red', textAlign: 'center', marginBottom: '15px' }
};

export default Login;