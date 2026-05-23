import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');
        API.get('/api/registrations/my')
            .then(res => {
                setRegistrations(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [token, navigate]);

    const handleCancel = async (id) => {
        try {
            await API.patch(`/api/registrations/${id}/cancel`);
            setRegistrations(registrations.map(r =>
                r._id === id ? { ...r, status: 'cancelled' } : r
            ));
        } catch (err) {
            alert('Cancel failed. Please try again.');
        }
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

    if (loading) {
        return (
            <div className="page-container">
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="spinner-text">Loading your registrations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">My Registrations</h1>
                <p className="page-subtitle">Track and manage your event registrations</p>
            </div>

            {registrations.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3 className="empty-state-title">No registrations yet</h3>
                    <p className="empty-state-text">Browse events and register to see them here!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {registrations.map(reg => (
                        <div key={reg._id} className="card">
                            <h3 className="card-title">{reg.event?.title || 'Event'}</h3>
                            <div className="card-meta">
                                <span className="card-meta-icon">📅</span>
                                {reg.event?.date ? formatDate(reg.event.date) : 'Date TBD'}
                            </div>
                            {reg.event?.location && (
                                <div className="card-meta">
                                    <span className="card-meta-icon">📍</span>
                                    {reg.event.location}
                                </div>
                            )}
                            <div className="card-footer">
                                <span className={`badge ${reg.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                                    {reg.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                                </span>
                                {reg.status === 'confirmed' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleCancel(reg._id)}
                                        style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRegistrations;