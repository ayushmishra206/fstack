import { ApolloProvider } from '@apollo/client';
import { useState, useEffect } from 'react';
import client from './apolloClient';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <ApolloProvider client={client}>
        {token && user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <AuthForm onLogin={handleLogin} />
        )}
      </ApolloProvider>
    </div>
  );
}

export default App;
