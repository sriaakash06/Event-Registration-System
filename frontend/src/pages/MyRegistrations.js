import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function MyRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return navigate('/login');
        API.get('/registrations/my').then(res => setRegistrations(res.data));
    }, []);

    const handleCancel = async (id) => {
        try {
            await API.patch(`/registrations/${id}/cancel`);
            setRegistrations(registrations.map(r =>
                r._id === id ? { ...r, status: 'cancelled' } : r
            ));
        } catch (err) {
            alert('Cancel failed');
        }
    };

    return (
        <div>
            <h2 style={styles.title}>📋 My Registrations</h2>
            {registrations.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>No registrations yet.</p>
            ) : (
                <div style={styles.grid}>
                    {registrations.map(reg => (
                        <div key={reg._id} style={styles.card}>
                            <h3>{reg.event?.title}</h3>
                            <p>📅 {new Date(reg.event?.date).toDateString()}</p>
                            <p>📍 {reg.event?.location}</p>
                            <p>Status:
                                <span style={{
                                    color: reg.status === 'confirmed' ? 'green' : 'red',
                                    fontWeight: 'bold', marginLeft: '8px'
                                }}>
                                    {reg.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                                </span>
                            </p>
                            {reg.status === 'confirmed' && (
                                <button style={styles.cancelBtn}
                                    onClick={() => handleCancel(reg._id)}>
                                    Cancel Registration
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    title: { textAlign: 'center', color: '#2c3e50', marginBottom: '30px' },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px', maxWidth: '1100px', margin: '0 auto'
    },
    card: {
        backgroundColor: 'white', padding: '25px', borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    },
    cancelBtn: {
        marginTop: '10px', padding: '8px 16px', backgroundColor: '#e74c3c',
        color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%'
    }
};

export default MyRegistrations;