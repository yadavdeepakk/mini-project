import React from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Welcome, {user?.name || 'Guest'}!</h2>
      {user && (
        <p className="text-lg mb-4">You are logged in as a {user.role}.</p>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
      {/* Add more content based on user role here */}
    </div>
  );
};

export default HomePage;
