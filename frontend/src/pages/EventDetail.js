import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';

function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        API.get(`/api/events/${id}`)
            .then(res => {
                setEvent(res.data);
                setLoading(false);
            })
            .catch(err => {
                setMessage({ type: 'error', text: 'Event not found.' });
                setLoading(false);
            });
    }, [id]);

    const handleRegister = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        setRegistering(true);
        setMessage({ type: '', text: '' });

        try {
            await API.post('/api/registrations', { eventId: id });
            setMessage({ type: 'success', text: '🎉 Successfully registered! Check your registrations page.' });
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setRegistering(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="spinner-text">Loading event details...</span>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-state-icon">😕</div>
                    <h3 className="empty-state-title">Event not found</h3>
                    <p className="empty-state-text">This event may have been removed or doesn't exist.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-flex' }}>
                        ← Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-container animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                ← Back to all events
            </Link>

            <div className="detail-card">
                <span className="detail-badge">📅 Event</span>
                <h1 className="detail-title">{event.title}</h1>

                <div className="detail-info">
                    <div className="detail-info-item">
                        <span className="detail-info-icon">📅</span>
                        <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="detail-info-item">
                        <span className="detail-info-icon">🕐</span>
                        <span>{formatTime(event.date)}</span>
                    </div>
                    {event.location && (
                        <div className="detail-info-item">
                            <span className="detail-info-icon">📍</span>
                            <span>{event.location}</span>
                        </div>
                    )}
                    <div className="detail-info-item">
                        <span className="detail-info-icon">👥</span>
                        <span>{event.capacity} spots available</span>
                    </div>
                    {event.organizer && (
                        <div className="detail-info-item">
                            <span className="detail-info-icon">🧑‍💼</span>
                            <span>Organized by {event.organizer.name}</span>
                        </div>
                    )}
                </div>

                {event.description && (
                    <div className="detail-description">
                        {event.description}
                    </div>
                )}

                {message.text && (
                    <div className={message.type === 'error' ? 'form-error' : 'form-success'}>
                        {message.text}
                    </div>
                )}

                <div className="detail-actions">
                    <button
                        className="btn btn-success"
                        onClick={handleRegister}
                        disabled={registering}
                        style={{ flex: 1 }}
                    >
                        {registering ? 'Registering...' : (token ? '🎟️ Register for this Event' : '🔐 Login to Register')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventDetail;
