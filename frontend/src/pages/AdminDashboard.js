import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'registrations'
    
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token || user?.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const eventsRes = await API.get('/api/events');
                const regsRes = await API.get('/api/registrations/all');
                setEvents(eventsRes.data);
                setRegistrations(regsRes.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch dashboard data. Make sure you are logged in as an administrator.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token, user?.role, navigate]);

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('⚠️ Are you sure you want to delete this event? This will also remove associated registrations.')) return;
        try {
            await API.delete(`/api/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
            setSuccess('🗑️ Event deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete event.');
        }
    };

    const handleCancelRegistration = async (regId) => {
        if (!window.confirm('⚠️ Are you sure you want to cancel this user\'s registration?')) return;
        try {
            await API.patch(`/api/registrations/${regId}/cancel`);
            setRegistrations(registrations.map(r => r._id === regId ? { ...r, status: 'cancelled' } : r));
            setSuccess('❌ Registration cancelled successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to cancel registration.');
        }
    };

    // Calculate filled spots for an event
    const getFilledSpots = (eventId) => {
        return registrations.filter(r => r.event?._id === eventId && r.status === 'confirmed').length;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="spinner-text">Loading admin dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Manage events, track registration capacity, and review user attendance</p>
            </div>

            {error && <div className="form-error" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>{error}</div>}
            {success && <div className="form-success" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>{success}</div>}

            {/* Dashboard Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <button 
                    onClick={() => setActiveTab('events')} 
                    className={`nav-btn ${activeTab === 'events' ? 'nav-btn-primary' : 'nav-btn-ghost'}`}
                    style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)' }}
                >
                    📅 Manage Events ({events.length})
                </button>
                <button 
                    onClick={() => setActiveTab('registrations')} 
                    className={`nav-btn ${activeTab === 'registrations' ? 'nav-btn-primary' : 'nav-btn-ghost'}`}
                    style={{ padding: '10px 24px', borderRadius: 'var(--radius-sm)' }}
                >
                    🎟️ Registrations ({registrations.length})
                </button>
            </div>

            {activeTab === 'events' ? (
                <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Title</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Category</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Date</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Location</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Attendance</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px 8px', fontWeight: '600' }}>
                                        <Link to={`/events/${event._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                                            {event.title}
                                        </Link>
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{ fontSize: '0.82rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)' }}>
                                            {event.category || 'General'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {event.location || 'Online'}
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span style={{ fontWeight: '700', color: getFilledSpots(event._id) >= event.capacity ? 'var(--danger-light)' : 'var(--success-light)' }}>
                                            {getFilledSpots(event._id)}
                                        </span>
                                        <span style={{ color: 'var(--text-muted)' }}> / {event.capacity}</span>
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleDeleteEvent(event._id)}
                                            className="btn btn-danger"
                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>User</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Email</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Event</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Date Registered</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px 8px', fontWeight: '600' }}>{reg.user?.name || 'Deleted User'}</td>
                                    <td style={{ padding: '16px 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{reg.user?.email || 'N/A'}</td>
                                    <td style={{ padding: '16px 8px' }}>
                                        {reg.event ? (
                                            <Link to={`/events/${reg.event._id}`} style={{ color: 'var(--primary-light)', textDecoration: 'none' }}>
                                                {reg.event.title}
                                            </Link>
                                        ) : (
                                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Deleted Event</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '16px 8px' }}>
                                        <span className={`badge ${reg.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                        {reg.status === 'confirmed' && (
                                            <button 
                                                onClick={() => handleCancelRegistration(reg._id)}
                                                className="btn btn-danger"
                                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
