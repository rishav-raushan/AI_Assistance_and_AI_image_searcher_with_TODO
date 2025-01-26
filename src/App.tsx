import React, { useState } from "react";
import { createStore, applyMiddleware } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { thunk } from "redux-thunk";
import { Search, Send, Trash2, Brain, Image as ImageIcon, LogIn, LogOut, GraduationCap } from 'lucide-react';
import { fetchAIResponse, addTask, deleteTask, setPriority, searchImages, login, logout } from "./actions";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

// Authentication Component
const Auth = () => {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const handleLogin = () => {
    if (username.trim()) {
      dispatch(login(username));
      setUsername("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      {!user.isAuthenticated ? (
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            onClick={handleLogin}
          >
            <LogIn size={20} />
            Login
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-lg">Welcome, <span className="font-semibold">{user.username}</span>!</p>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// Search Bar Component
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.loading);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchImages(query));
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <input
        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Search Unsplash images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        onClick={handleSearch}
        disabled={loading}
      >
        <Search size={20} />
        Search
      </button>
    </div>
  );
};

// Image Gallery Component
const ImageGallery = () => {
  const images = useSelector((state: any) => state.images);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {images.map((image: any) => (
        <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={image.urls.small}
            alt={image.alt_description}
            className="w-full h-48 object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <p className="text-white text-sm">{image.user.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// AI Assistant Component
const AIAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const dispatch = useDispatch();
  const aiResponse = useSelector((state: any) => state.aiResponse);
  const loading = useSelector((state: any) => state.loading);

  const handleSubmit = () => {
    if (prompt.trim()) {
      dispatch(fetchAIResponse(prompt));
      setPrompt("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gradient">
        <Brain className="text-blue-500" />
        AI Assistant
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          <Send size={20} />
          Send
        </button>
      </div>
      {loading && (
        <div className="animate-pulse bg-gray-100 rounded-lg p-4">
          Loading...
        </div>
      )}
      {aiResponse && (
        <div className="bg-gray-50 rounded-lg p-4 prose max-w-none whitespace-pre-line">
          {aiResponse}
        </div>
      )}
    </div>
  );
};

// Task Input Component
const TaskInput = () => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const handleAddTask = () => {
    if (task.trim() && user.isAuthenticated) {
      dispatch(addTask({ task, priority }));
      setTask("");
    }
  };

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

// Task List Component
const TaskList = () => {
  const tasks = useSelector((state: any) => state.tasks);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800";
      case "Medium":
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800";
      case "Low":
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800";
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
    }
  };

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks yet. Add some tasks to get started!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task: any, index: number) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <span className="font-medium">{task.task}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition-colors"
                onClick={() => dispatch(deleteTask(index))}
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center justify-center gap-2">
        <GraduationCap className="text-blue-500" size={24} />
        <div className="text-center">
          <p className="font-semibold text-gray-800">Rishav Raushan</p>
          <p className="text-gray-600">B.Tech CSE, 4th Year</p>
          <p className="text-gray-600">Central University of Haryana</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 mb-4">by - Rishav Raushan</p>
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Task Manager with AI Assistant
          </h1>
          <Auth />
          <SearchBar />
          <ImageGallery />
          <AIAssistant />
          <TaskInput />
          <TaskList />
          <Footer />
        </div>
      </div>
    </Provider>
  );
};

export default App;