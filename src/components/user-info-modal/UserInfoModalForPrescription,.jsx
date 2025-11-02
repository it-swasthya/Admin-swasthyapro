import React, { useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const UserDetailsModalForPrescription = ({
  open,
  onClose,
  selectedDetails = {},
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        {/* Header */}
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

        {/* Content */}
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
          <div>
            <strong>Email:</strong> {selectedDetails.email || "N/A"}
          </div>
          <div>
            <strong>Contact:</strong> {selectedDetails.contact || "N/A"}
          </div>
          <div>
            <strong>Gender:</strong>{" "}
            {selectedDetails.gender === "M"
              ? "Male"
              : selectedDetails.gender === "F"
                ? "Female"
                : selectedDetails.gender || "N/A"}
          </div>
          <div>
            <strong>Age:</strong> {selectedDetails.age || "N/A"}
          </div>
          <div className="col-span-2">
            <strong>Address:</strong> {selectedDetails.address || "N/A"}
          </div>
        </div>
      </div>
    </div> 
  );
};
export default UserDetailsModalForPrescription;
