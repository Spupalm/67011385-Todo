// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // Check for stored username on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('todo_username');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    const handleLogin = (username) => {
        setCurrentUser(username);
    };

    const handleLogout = () => {
        // Clear username from local storage and state
        localStorage.removeItem('todo_username');
        setCurrentUser(null);
    };


    return (
        <div className="min-h-screen flex flex-col items-center
                  bg-gradient-to-br from-orange-300 to-red-400">

          {/* Title */}
          <h1 className="mt-16 mb-8 text-3xl font-bold">
            Full Stack Todo App
          </h1>
      
          {/* Content */}
          {currentUser ? (
            <TodoList username={currentUser} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
      
        </div>
      );
      
      
      
}

export default App;
