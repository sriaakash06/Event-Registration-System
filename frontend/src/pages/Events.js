import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        API.get('/api/events')
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            });
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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
                    <span className="spinner-text">Loading events...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Discover Events</h1>
                <p className="page-subtitle">Find and register for exciting events happening near you</p>
            </div>

            {error && <div className="form-error" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>{error}</div>}

            {events.length === 0 && !error ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🎭</div>
                    <h3 className="empty-state-title">No events yet</h3>
                    <p className="empty-state-text">Check back soon for upcoming events!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {events.map(event => (
                        <Link to={`/events/${event._id}`} key={event._id} style={{ textDecoration: 'none' }}>
                            <div className="card">
                                <h3 className="card-title">{event.title}</h3>
                                <div className="card-meta">
                                    <span className="card-meta-icon">📅</span>
                                    {formatDate(event.date)}
                                </div>
                                <div className="card-meta">
                                    <span className="card-meta-icon">🕐</span>
                                    {formatTime(event.date)}
                                </div>
                                {event.location && (
                                    <div className="card-meta">
                                        <span className="card-meta-icon">📍</span>
                                        {event.location}
                                    </div>
                                )}
                                {event.description && (
                                    <p className="card-description">{event.description}</p>
                                )}
                                <div className="card-footer">
                                    <span className="capacity-badge">
                                        👥 {event.capacity} spots
                                    </span>
                                    {event.organizer && (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                            by {event.organizer.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Events;
