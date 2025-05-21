import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import LoginIllustration from './components/LoginIllustration';
import Profile from './components/Profile';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (token, user) => {
    setUser(user);
    // Optionally store token in state if you implement JWT later
  };

  const handleLogout = () => {
    setUser(null);
  };

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
        <Route path="/profile" element={<Profile user={user} onUpdate={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
