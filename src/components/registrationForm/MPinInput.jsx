import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const MPinInput = ({ passwordArray, setPasswordArray, setFormData }) => {
  const [showMpi, setShowMpi] = useState(false);

  const handleMpiChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...passwordArray];
    updated[index] = value;
    setPasswordArray(updated);
    setFormData((prev) => ({ ...prev, password: updated.join("") }));

    if (value && index < 3) {
      document.getElementById(`mpi-${index + 1}`)?.focus();
    }
  };

  const handleMpiKeyDown = (index, e) => {
    if (e.key === "Backspace" && passwordArray[index] === "" && index > 0) {
      document.getElementById(`mpi-${index - 1}`)?.focus();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium">
        Create M-PIN <span className="text-red-700">*</span>
      </label>
      <div className="mt-1 flex items-center space-x-2">
        {passwordArray.map((digit, index) => (
          <input
            key={index}
            id={`mpi-${index}`}
            type={showMpi ? "text" : "password"}
            value={digit}
            maxLength={1}
            onChange={(e) => handleMpiChange(index, e.target.value)}
            onKeyDown={(e) => handleMpiKeyDown(index, e)}
            className="w-10 p-2 text-sm border border-black bg-white text-black rounded-md text-center focus:ring-1 focus:ring-black"
            required
          />
        ))}
        <button
          type="button"
          onClick={() => setShowMpi((prev) => !prev)}
          className="p-2 border border-black rounded-md hover:bg-black hover:text-white transition"
        >
          {showMpi ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default MPinInput;
