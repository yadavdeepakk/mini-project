import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

// Import auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DoctorDashboard from './pages/DoctorDashboard';

// Import protected route component
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardRedirect /> }, // Redirect based on role
          { path: 'home', element: <HomePage /> }, // A generic home page if needed
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['doctor']} />,
        children: [
           { path: 'doctor-dashboard', element: <DoctorDashboard /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['patient']} />,
        children: [
          // { path: 'patient-dashboard', element: <PatientDashboard /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['family']} />,
        children: [
          // { path: 'family-dashboard', element: <FamilyDashboard /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
