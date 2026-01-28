// frontend/src/components/TodoList.js
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

function TodoList({ username, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, [username]); // Refetch when username changes (e.g., after login)

    // 1. READ: Fetch all todos for the current user
    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos/${username}`);
            
            if (!response.ok) {
                console.error('Failed to fetch todos:', response.statusText);
                return;
            }

            const data = await response.json();
            setTodos(data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    // 2. CREATE: Add a new todo
    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, task: newTask }),
            });

            if (!response.ok) {
                console.error('Failed to add todo:', response.statusText);
                return;
            }

            const newTodo = await response.json();
            // Add the new item to the beginning of the list
            setTodos([newTodo, ...todos]); 
            setNewTask('');
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    // 3. UPDATE: Toggle the 'done' status
    const handleToggleDone = async (id, currentDoneStatus) => {
        const newDoneStatus = !currentDoneStatus;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: newDoneStatus }),
            });

            if (!response.ok) {
                console.error('Failed to update todo:', response.statusText);
                return;
            }

            // Update the status in the local state immediately
            setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, done: newDoneStatus } : todo
            ));
        } catch (err) {
            console.error('Error toggling done status:', err);
        }
    };

    // 4. DELETE: Remove a todo item
    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                 console.error('Failed to delete todo:', response.statusText);
                return;
            }

            // Filter out the deleted item from the state
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const handleLogout = () => {
        // Clear storage and trigger state change in App.js
        localStorage.removeItem('todo_username');
        onLogout();
    };

    return (
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Todo List for: <span className="text-indigo-600">{username}</span>
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
    
                {/* Add Todo */}
                <form onSubmit={handleAddTodo} className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="New Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                        Add
                    </button>
                </form>
    
                {/* Todo List */}
                <ul className="space-y-3">
                    {todos.map(todo => (
                        <li
                            key={todo.id}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={!!todo.done}
                                    onChange={() => handleToggleDone(todo.id, todo.done)}
                                    className="w-5 h-5 accent-indigo-500"
                                />
                                <span
                                    className={`text-gray-800 ${
                                        todo.done ? 'line-through text-gray-400' : ''
                                    }`}
                                >
                                    {todo.task}
                                </span>
                            </div>
    
                            <div className="flex items-center gap-3">
                                <small className="text-gray-400">
                                    {new Date(todo.updated).toLocaleString()}
                                </small>
                                <button
                                    onClick={() => handleDeleteTodo(todo.id)}
                                    className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
    
            </div>
        
    );
}
    

export default TodoList;