import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [location, setLocation] = useState('');

    const fetchEvents = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (location) params.append('location', location);

        API.get(`/api/events?${params.toString()}`)
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]); // Fetch automatically when category changes

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchEvents();
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('All');
        setLocation('');
        
        setLoading(true);
        API.get('/api/events')
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load events. Please try again later.');
                setLoading(false);
            });
    };

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

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Discover Events</h1>
                <p className="page-subtitle">Find and register for exciting events happening near you</p>
            </div>

            {/* Filter Bar */}
            <form onSubmit={handleFilterSubmit} className="form-card" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '20px', marginBottom: '32px', alignItems: 'flex-end', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ flex: 2, minWidth: '200px' }}>
                    <label className="form-label" style={{ marginBottom: '6px' }}>Search Title/Description/Tags</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search keywords..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label" style={{ marginBottom: '6px' }}>Category</label>
                    <select
                        className="form-input"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ height: '46px', padding: '0 10px', fontSize: '15px' }}
                    >
                        <option value="All">All Categories</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Meetup">Meetup</option>
                        <option value="Social">Social</option>
                        <option value="Exhibition">Exhibition</option>
                        <option value="General">General</option>
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label className="form-label" style={{ marginBottom: '6px' }}>Location</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Filter by location..."
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '8px', minWidth: '200px', height: '46px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                        🔍 Search
                    </button>
                    <button type="button" onClick={handleClearFilters} className="btn btn-secondary">
                        Reset
                    </button>
                </div>
            </form>

            {error && <div className="form-error" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>{error}</div>}

            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="spinner-text">Loading events...</span>
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🎭</div>
                    <h3 className="empty-state-title">No events found</h3>
                    <p className="empty-state-text">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="card-grid">
                    {events.map(event => (
                        <Link to={`/events/${event._id}`} key={event._id} style={{ textDecoration: 'none' }}>
                            <div className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '999px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600', 
                                        background: 'rgba(99, 102, 241, 0.15)', 
                                        color: 'var(--primary-light)',
                                        border: '1px solid rgba(99, 102, 241, 0.2)'
                                    }}>
                                        📁 {event.category || 'General'}
                                    </span>
                                </div>
                                <h3 className="card-title">{event.title}</h3>
                                
                                {event.tags && event.tags.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
                                        {event.tags.map((tag, idx) => (
                                            <span key={idx} style={{ 
                                                fontSize: '0.72rem', 
                                                color: 'var(--text-secondary)', 
                                                background: 'rgba(255,255,255,0.06)', 
                                                padding: '2px 8px', 
                                                borderRadius: '4px',
                                                border: '1px solid var(--border-color)'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

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
