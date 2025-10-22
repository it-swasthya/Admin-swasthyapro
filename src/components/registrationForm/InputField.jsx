import React from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  maxLength,
  error,
  required = true,
}) => (
  <div>
    <label className="block text-sm font-medium">
      {label} {required && <span className="text-red-700">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      required={required}
      className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default InputField;
