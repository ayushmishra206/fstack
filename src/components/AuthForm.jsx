import React, { useState, useEffect } from "react";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from users.json or localStorage
  useEffect(() => {
    const stored = localStorage.getItem('users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      fetch('/users.json')
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin("dummy-token", { id: user.id, name: user.name, email: user.email });
      } else {
        setError("Invalid email or password");
      }
    } else {
      if (users.find(u => u.email === email)) {
        setError("Email already exists");
        return;
      }
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        password
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setIsLogin(true);
      setName('');
      setEmail('');
      setPassword('');
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