import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import LoginIllustration from './components/LoginIllustration';
import Profile from './components/Profile';
import FollowList from './components/FollowList';
import './styles/theme.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="flex w-full max-w-4xl bg-white/80 rounded-xl shadow-xl overflow-hidden">
          <LoginIllustration />
          <div className="flex-1 flex items-center justify-center p-8">
            <AuthForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/profile" element={
          <Profile 
            user={user} 
            onUpdate={handleProfileUpdate} 
            onLogout={handleLogout} 
          />
        } />
        <Route path="/:userId/followers" element={<FollowList user={user} type="followers" onLogout={handleLogout} />} />
        <Route path="/:userId/following" element={<FollowList user={user} type="following" onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
