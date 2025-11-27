import React from 'react';
import useAuthStore from '../store/authStore';

const DoctorDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Doctor Dashboard</h2>
      <p className="text-lg mb-4">Welcome, Dr. {user?.name || 'Guest'}!</p>
      {/* Placeholder for calendar, appointment management, etc. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Appointments Calendar</h3>
          <p>View and manage your scheduled appointments.</p>
          {/* Calendar component will go here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Patient Communication</h3>
          <p>Communicate securely with your patients.</p>
          {/* Chat component will go here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Prescription Management</h3>
          <p>Upload, confirm, and issue digital prescriptions.</p>
          {/* Prescription UI will go here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Patient Records</h3>
          <p>Access patient medical history and past prescriptions.</p>
          {/* Patient record UI will go here */}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
