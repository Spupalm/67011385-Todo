// frontend/src/components/Login.js
import React, { useState } from 'react';

const API_URL = 'http://localhost:5001/api';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }

        try {
            // Use Fetch API for POST request
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }), // Convert object to JSON string
            });

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed due to server error.');
                return;
            }

            const data = await response.json(); // Parse the response body as JSON

            if (data.success) {
                localStorage.setItem('todo_username', username);
                onLogin(username); // Update App component state
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            // Handle network connection errors
            setError('Network error: Could not connect to the server.');
            console.error(err);
        }
    };


    return (
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        
        <img
          src="/cei-logo.png"
          alt="Cei Logo"
          className="w-10 mx-auto mb-4"
        />
    
        <h2 className="text-xl font-semibold text-center mb-4">
          Login
        </h2>
    
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
    
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>
    
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}
      </div>
    );
    
}
export default Login;