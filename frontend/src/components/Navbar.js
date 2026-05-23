import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
