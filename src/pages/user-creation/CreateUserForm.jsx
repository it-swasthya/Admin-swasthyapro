import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeNavValue } from "../../Redux/reducer";
import InputField from "../../components/registrationForm/InputField";
import MPinInput from "../../components/registrationForm/MPinInput";
import GenderSelect from "../../components/registrationForm/GenderSelect";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(changeNavValue("Create User"));
    window.scrollTo(0, 0);
  }, [dispatch]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    contact: "",
    address: "",
    pincode: "",
    state: "",
    alternate_contact: "",
    email: "",
    password: "",
    gstNO: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordArray, setPasswordArray] = useState(["", "", "", ""]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.gender) formErrors.gender = "Please select a gender";
    if (!formData.first_name) formErrors.first_name = "First name is required";
    if (!formData.password) formErrors.password = "M-PIN is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://api.swasthyapro.com/api/auth/register",
        {
          ...formData,
          age: Number(formData.age) || null,
        }
      );

      if (response.data.message === "User registered") {
        Swal.fire({
          title: "User Created Successfully!",
          icon: "success",
        });
        setFormData({
          first_name: "",
          last_name: "",
          date_of_birth: "",
          contact: "",
          address: "",
          pincode: "",
          state: "",
          alternate_contact: "",
          email: "",
          password: "",
          gstNO: "",
          age: "",
          gender: "",
        });
        setTimeout(() => navigate("/all-users"), 500);
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
        title: "Error",
        text: "Something went wrong!",
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen  text-black flex items-start justify-center  px-2 pb-16">
      <div className="w-full max-w-xs sm:max-w-lg bg-white border border-black shadow-lg rounded-xl px-3 py-4">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
            <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required={false} />

            <InputField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required={false} />
            <InputField label="Enter Age" name="age" type="number" value={formData.age} onChange={handleChange} />

            <GenderSelect name="gender" value={formData.gender} onChange={handleChange} error={errors.gender} />

            <InputField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} maxLength={10} />
            <InputField label="Alternate Contact" name="alternate_contact" value={formData.alternate_contact} onChange={handleChange} required={false} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required={false} />
            <InputField label="Pincode" name="pincode" type="number" value={formData.pincode} onChange={handleChange} maxLength={6} required={false} />
            <InputField label="State" name="state" value={formData.state} onChange={handleChange} required={false} />
            <InputField label="GST Number (Optional)" name="gstNO" value={formData.gstNO} onChange={handleChange} required={false} />
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

          <MPinInput
            passwordArray={passwordArray}
            setPasswordArray={setPasswordArray}
            setFormData={setFormData}
          />

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

export default RegistrationForm;
