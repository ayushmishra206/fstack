import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [register, { loading: regLoading }] = useMutation(REGISTER);
  const [login, { loading: loginLoading }] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const { data } = await login({ variables: { email, password } });
        onLogin(data.login.token, data.login.user);
      } else {
        await register({ variables: { name, email, password } });
        setIsLogin(true);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message.replace('GraphQL error: ', ''));
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
          disabled={regLoading || loginLoading}
        >
          {isLogin ? (loginLoading ? 'Logging in...' : 'Login') : (regLoading ? 'Registering...' : 'Register')}
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