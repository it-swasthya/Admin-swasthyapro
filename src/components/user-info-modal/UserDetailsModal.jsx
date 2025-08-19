import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const UserDetailModal = ({ isOpen, onClose, user }) => {
  const userData = user?.User;
  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center text-gray-700 gap-2">
            <InformationCircleIcon className="w-6 h-6 text-blue-600" />
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>First Name:</strong> {userData.first_name || "N/A"} </div>
          <div><strong>Last Name:</strong> {userData.last_name|| "N/A"}</div>
          <div><strong>DOB:</strong> {userData.date_of_birth|| "N/A"}</div>
          <div><strong>Age:</strong> {userData.age|| "N/A"}</div>
          <div><strong>Contact:</strong> {userData.contact|| "N/A"}</div>
          <div><strong>Alternate Contact:</strong> {userData.alternate_contact|| "N/A"}</div>
          <div><strong>Email:</strong> {userData.email|| "N/A"}</div>
          <div className="col-span-2"><strong>Address:</strong> {userData.address|| "N/A"}</div>
          <div><strong>Pincode:</strong> {userData.pincode|| "N/A"}</div>
          <div><strong>State:</strong> {userData.state|| "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
