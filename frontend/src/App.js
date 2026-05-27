import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import MyRegistrations from './pages/MyRegistrations';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user/token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setToken(savedToken);
    setUser(savedUser);
  }, []);

  // Called after login to update state immediately
  const handleAuthChange = useCallback(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setToken(savedToken);
    setUser(savedUser);
  }, []);

  return (
    <Router>
      <Navbar user={user} token={token} onAuthChange={handleAuthChange} />
      <div>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login onAuthChange={handleAuthChange} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;