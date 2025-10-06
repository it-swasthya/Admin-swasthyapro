import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(changeNavValue("Create User"));
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: null,
    contact: null,
    address: "",
    pincode: null,
    state: "",
    alternate_contact: null,
    email: "",
    password: "",
    gstNO: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({
    contact: null,
    alternate_contact: null,
  });

  const [password, setPassword] = useState(["", "", "", ""]);
  const [showMpi, setShowMpi] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMpiChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...password];
    updated[index] = value;
    setPassword(updated);
    setFormData({ ...formData, password: updated.join("") });

    if (value && index < 3) {
      const nextInput = document.getElementById(`mpi-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleMpiKeyDown = (index, e) => {
    if (e.key === "Backspace" && password[index] === "" && index > 0) {
      const prevInput = document.getElementById(`mpi-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateForm = () => {
    let formErrors = {};

   
    if (!formData.gender) {
      formErrors.gender = "Please select a gender";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const isComplete = ["first_name", "password"].every((key) => formData[key]);

    if (!isComplete) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const resp = await axios.post(
        "https://api.swasthyapro.com/api/auth/register",
        {
          first_name: formData.first_name || "",
          last_name: formData.last_name || "",
          date_of_birth: formData.date_of_birth || null,
          contact: formData.contact || null,
          address: formData.address || "",
          pincode: formData.pincode || null,
          state: formData.state || "",
          alternate_contact: formData.alternate_contact || null,
          email: formData.email || null,
          password: formData.password || "",
          gstNO: formData || "",
          age: Number(formData.age) || null,
          gender: formData.gender || null,
        }
      );
      if (resp.data.message === "User registered") {
        Swal.fire({
          title: "User Created Successfully!",
          icon: "success",
          draggable: true,
        });
        setFormData({
          first_name: "",
          last_name: "",
          date_of_birth: null,
          contact: null,
          address: "",
          pincode: null,
          state: "",
          alternate_contact: null,
          email: "",
          password: "",
          gstNO: "",
          age: "",
          gender: "",
        });
        setTimeout(() => {
          navigate("/all-users");
        }, 500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-start justify-center px-2 pb-16">
      <div className="w-full max-w-xs sm:max-w-lg bg-white border border-black shadow-lg rounded-xl px-3 py-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <InputField
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required={false}
            />
            <input
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              type="date"
              className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
            />
            <InputField
              label="Enter Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
            />
            <div>
              <label className="block text-sm font-medium">
                Gender <span className="text-red-700">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
              >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <InputField
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              maxLength={10}
              error={errors.contact}
            />
            <InputField
              label="Alternate Contact"
              name="alternate_contact"
              value={formData.alternate_contact}
              onChange={handleChange}
              error={errors.alternate_contact}
              required={false}
            />
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              error={errors.email}
              required={false}
            />
            <InputField
              label="Pincode"
              name="pincode"
              type="number"
              value={formData.pincode}
              onChange={handleChange}
              required={false}
              maxLength={6}
            />
            <InputField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required={false}
            />
            <InputField
              label="GST Number (Optional)"
              name="gstNO"
              value={formData.gstNO}
              onChange={handleChange}
              required={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <textarea
              rows={3}
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full p-2 text-sm border border-black bg-white text-black rounded-md focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Create M-PIN <span className="text-red-700">*</span>
            </label>
            <div className="mt-1 flex items-center space-x-2">
              {password.map((digit, index) => (
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-white hover:text-black border border-black transition duration-200"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

export default RegistrationForm;
