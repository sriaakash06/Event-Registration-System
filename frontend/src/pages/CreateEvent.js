import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function CreateEvent() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [capacity, setCapacity] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await API.post('/api/events', {
                title,
                description,
                date,
                location,
                capacity: Number(capacity)
            });
            setSuccess('🎉 Event created successfully! Redirecting...');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create event. Please check inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="form-card" style={{ maxWidth: '500px' }}>
                <div className="form-header">
                    <div className="form-icon">📅</div>
                    <h2 className="form-title">Create New Event</h2>
                    <p className="form-subtitle">Organize and host a new event on EventHub</p>
                </div>

                {error && <div className="form-error">⚠️ {error}</div>}
                {success && <div className="form-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Event Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. React Developers Meetup"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date & Time</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. San Francisco, CA or Online"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Capacity (Max Attendees)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="e.g. 100"
                            value={capacity}
                            onChange={e => setCapacity(e.target.value)}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            placeholder="Tell people what your event is about..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows="4"
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        style={{ padding: '14px', fontSize: '1rem', marginTop: '12px' }}
                    >
                        {loading ? 'Creating Event...' : '🚀 Publish Event'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
