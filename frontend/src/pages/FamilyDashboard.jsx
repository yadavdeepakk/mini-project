import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

const FamilyDashboard = () => {
  const { user } = useAuthStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [linkedPatients, setLinkedPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState(null);

  useEffect(() => {
    const fetchLinkedPatients = async () => {
      if (user && user.linkedPatients && user.linkedPatients.length > 0) {
        try {
          setLoadingPatients(true);
          // In a real app, you'd fetch details for each linked patient
          // For now, we'll just show their IDs or a placeholder
          const patientDetails = await Promise.all(
            user.linkedPatients.map(async (patientId) => {
              // This endpoint would need to be created on the backend
              // For now, we'll return a placeholder object
              return { _id: patientId, name: `Patient ${patientId.substring(0, 4)}`, status: 'active' };
            })
          );
          setLinkedPatients(patientDetails);
        } catch (err) {
          setPatientsError(err);
          console.error('Error fetching linked patients:', err);
        } finally {
          setLoadingPatients(false);
        }
      }
    };
    fetchLinkedPatients();
  }, [user]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteMessage('');
    try {
      const response = await api.post('/family/invite', { patientId: user.id, email: inviteEmail });
      setInviteMessage(response.data.message + ' Link: ' + response.data.inviteLink);
      setInviteEmail('');
    } catch (error) {
      setInviteMessage(`Invite failed: ${error.response?.data?.message || error.message}`);
      console.error('Error sending invite:', error);
    }
  };

  if (user?.role !== 'family') return <div className="text-center py-8 text-red-500">Access Denied.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold mb-6">Family Dashboard - {user.name}</h2>

      {/* Invite Patient Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Invite Patient</h3>
        <form onSubmit={handleInviteSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="email"
            placeholder="Patient's Email to Invite"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Send Invite
          </button>
        </form>
        {inviteMessage && <p className="mt-4 text-sm">{inviteMessage}</p>}
      </div>

      {/* Linked Patients Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Linked Patients</h3>
        {loadingPatients ? (
          <p>Loading linked patients...</p>
        ) : patientsError ? (
          <p className="text-red-500">Error loading patients: {patientsError.message}</p>
        ) : linkedPatients.length === 0 ? (
          <p>No patients linked yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {linkedPatients.map((patient) => (
              <div key={patient._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-semibold">{patient.name}</p>
                <p className="text-gray-700">Status: {patient.status}</p>
                {/* Add links to view patient details (prescriptions, schedules) here */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notifications for Linked Patients */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Notifications for Linked Patients</h3>
        <p className="text-gray-600">[Receive reminders/notifications for linked patient]</p>
        {/* Display notifications here */}
      </div>
    </div>
  );
};

export default FamilyDashboard;
