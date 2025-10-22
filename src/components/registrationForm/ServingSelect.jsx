import React from "react";

const ServingSelect = ({ name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium">
      Serving <span className="text-red-700">*</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
    >
      <option value="">Select Serving</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default ServingSelect;
