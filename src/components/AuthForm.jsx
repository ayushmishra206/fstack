import React, { useState } from "react";
import { API_URL } from '../utils/config';

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const baseUrl = API_URL;
      console.log('Using API URL:', baseUrl); // Debug log
      
      if (isLogin) {
        const res = await fetch(`${baseUrl}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Login failed');
        }

        const data = await res.json();
        onLogin(data.user);
        setEmail('');
        setPassword('');
      } else {
        const res = await fetch(`${API_URL}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        setIsLogin(true);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Auth error:', err, 'API_URL:', API_URL);
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur shadow-xl rounded-xl p-8 w-full max-w-md">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        {isLogin ? 'Login' : 'Register'}
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-blue-200 p-2 rounded focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition font-semibold shadow"
          type="submit"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}