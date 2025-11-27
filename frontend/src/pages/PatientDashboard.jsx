import React from 'react';
import useAuthStore from '../../store/authStore';

const PatientDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-4">Patient Dashboard</h2>
      <p className="text-lg mb-4">Welcome, {user?.name}!</p>
      {/* Placeholder for prescription capture, medication history, etc. */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">My Prescriptions</h3>
        <p>Prescription capture and list will go here.</p>
      </div>
    </div>
  );
};

export default PatientDashboard;
