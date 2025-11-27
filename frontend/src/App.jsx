import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, user, logout, initializeAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">MediScan</h1>
          <div className="space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
                <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
              </>
            ) : (
              <>
                {user?.role === 'doctor' && (
                  <Link to="/doctor-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                )}
                {user?.role === 'patient' && (
                  <Link to="/patient-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                )}
                {user?.role === 'family' && (
                  <Link to="/family-dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Outlet /> {/* This is where nested routes will render */}
      </main>
    </div>
  );
}

export default App;
