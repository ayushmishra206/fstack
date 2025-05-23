import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/config';

/**
 * Renders a user search input with live results in a dropdown.
 *
 * Allows users to search for other users by name or username. As the user types, matching results are fetched from the API and displayed in a dropdown list. Selecting a user navigates to their profile and closes the dropdown. The dropdown also closes when clicking outside the component or clearing the input.
 */
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim()) {
      try {
        const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(e.target.value)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Search failed:', err);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full px-4 py-2 rounded-full border focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border max-h-96 overflow-auto z-50">
          {results.map(user => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="flex items-center p-3 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={user.avatar || '/default-avatar.png'}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">@{user.username}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
