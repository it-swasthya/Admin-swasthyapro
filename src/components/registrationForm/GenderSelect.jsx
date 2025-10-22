import React from "react";

const GenderSelect = ({ name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium">
      Gender <span className="text-red-700">*</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
    >
      <option value="">Select Gender</option>
      <option value="M">Male</option>
      <option value="F">Female</option>
      <option value="Other">Other</option>
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default GenderSelect;
