import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar({ user, token, onAuthChange }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (onAuthChange) onAuthChange();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">🎪</span>
                EventHub
            </Link>

            <div className="navbar-links">
                <Link to="/" className={isActive('/')}>Events</Link>

                {token ? (
                    <>
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin" className={isActive('/admin')}>
                                    Dashboard
                                </Link>
                                <Link to="/create-event" className={isActive('/create-event')}>
                                    Create Event
                                </Link>
                            </>
                        )}
                        <Link to="/my-registrations" className={isActive('/my-registrations')}>
                            My Registrations
                        </Link>
                        <Link to="/profile" className={isActive('/profile')}>
                            Profile
                        </Link>
                        <div className="nav-user">
                            <span className="nav-user-avatar">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                            <span>{user?.name || 'User'}</span>
                            {user?.role === 'admin' && (
                                <span style={{
                                    fontSize: '0.65rem',
                                    padding: '2px 8px',
                                    borderRadius: '999px',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    color: '#10b981',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    fontWeight: '600',
                                    marginLeft: '6px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Admin</span>
                            )}
                        </div>
                        <button className="nav-btn nav-btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="nav-btn nav-btn-ghost">Log In</button>
                        </Link>
                        <Link to="/register">
                            <button className="nav-btn nav-btn-primary">Sign Up</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
