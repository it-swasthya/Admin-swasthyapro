import  { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { changeNavValue } from "../../Redux/reducer";
import InputField from "../../components/registrationForm/InputField";
import MPinInput from "../../components/registrationForm/MPinInput";
import GenderSelect from "../../components/registrationForm/GenderSelect";
import ServingSelect from "../../components/registrationForm/ServingSelect";
import { fetchProtectedData } from "../../utils/adminAuth";

const RegistrationFormForCGHS = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.user || null;
    const [formData, setFormData] = useState({
   
  "first_name": "",
  "last_name": "",
  "date_of_birth": "",
  "age": "",
  "contact": "",
  "alternate_contact": "",
  "email": "",
  "address": "",
  "gender": "",
  "pincode": "",
  "state": "",
  "role": "cghs",
  "employee_id": "",
  "ministry": "",
  "organisation_name": "",
  "serving": ""

  });
 useEffect(() => {
    dispatch(changeNavValue(editData ? "Update CGHS User " : "Create CGHS User"));
    if (editData) {
      setFormData((prev) => ({
        ...prev,
        first_name: editData.firstName || "",
        last_name: editData.lastName || "",
        employee_id:editData.employee_id || "",
         serving:editData.serving || "",
        organisation_name:editData.organisation_name || "",
        ministry:editData.ministry || "",
        contact: editData.contact || "",
        date_of_birth: editData.dob || "",
        address: editData.address || "",
        pincode: editData.pincode || "",
        state: editData.state || "",
        alternate_contact: editData.alternate_contact || "",
        email: editData.email || "",
        gstNO: editData.gstNO || "",
        age: editData.age || "",
        gender: editData.gender || "",
      }));
    }

    window.scrollTo(0, 0);
  }, [dispatch]);



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
    if (Object.keys(formErrors).length  && !editData) {
      setErrors(formErrors);
      return;
    }

    try {
      // const response = await axios.post(
      //   "https://api.swasthyapro.com/api/auth/register",
      //   {
      //     ...formData,
      //     age: Number(formData.age) || null,
      //   }
      // );
        const url = editData
        ? `https://api.swasthyapro.com/api/user/user-role-update/${editData.id}`
        : "https://api.swasthyapro.com/api/auth/register";
      const method = editData ? "PUT" : "POST";
      const result = await fetchProtectedData(url,method , {
          ...formData,
          age: Number(formData.age) || null,
        });
      const response =  result;
       if (
        response.message === "User registered" ||
        response.message == "User updated successfully"
      )  {
        Swal.fire({
          title: `User ${editData ? "Updated" : "Created"} Successfully!`,
          icon: "success",
        });
        setFormData({
          first_name: "",
          last_name: "",
          employee_id: "",
          ministry: "",
          serving: "",
          organisation_name: "",
          date_of_birth: "",
              role: "cghs",
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
            <InputField
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required={false}
            />
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
            <InputField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              required={true}
            />
            <InputField
              label="Enter Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
            />
            <GenderSelect
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
            />
            <InputField
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              maxLength={10}
            />
            <InputField
              label="Ministry"
              name="ministry"
              value={formData.ministry}
              onChange={handleChange}
              required={true}
            />
            <InputField
              label="Organisation Name"
              name="organisation_name"
              value={formData.organisation_name}
              onChange={handleChange}
              required={true}
            />
            <ServingSelect
              name="serving"
              value={formData.serving}
              onChange={handleChange}
              // error={errors.serving}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required={false}
            />
            <InputField
              label="Pincode"
              name="pincode"
              type="number"
              value={formData.pincode}
              onChange={handleChange}
              maxLength={6}
              required={false}
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

         { !editData &&<MPinInput
            passwordArray={passwordArray}
            setPasswordArray={setPasswordArray}
            setFormData={setFormData}
          />}

          <div className="pt-2">
           {
            editData ? <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-white hover:text-black border border-black transition duration-200"
            >
              Update User
            </button>: <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-white hover:text-black border border-black transition duration-200"
            >
              Create User
            </button>
           }
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationFormForCGHS;
