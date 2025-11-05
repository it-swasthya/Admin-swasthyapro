import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const submitIPDAppointment = async ({
  name,
  disease,
  mobile,
  city,
  insurance,
  adhar_file,
  pan_file,
  insurance_file,
}) => {


  const formData = new FormData();
  formData.append("name", name);
  formData.append("disease", disease);
  formData.append("mobile", mobile);
  formData.append("city", city);
  formData.append("insurance", insurance ? "1" : "0");
  if (adhar_file) formData.append("adhar_file", adhar_file);
  if (pan_file) formData.append("pan_file", pan_file);
  if (insurance_file) formData.append("insurance_file", insurance_file);

  try {
    const response = await fetch(
      "https://api.swasthyapro.com/api/appointment/ipd-appointment",
      {
        method: "POST",
        body: formData,
      }
    );
    if (!response.ok) {
      const error = await response.json();
      showNotification("error", error?.message || "Something went wrong");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

const sendIpdEmail = async (payload) => {
  try {
    const response = await fetch(
      "https://api.swasthyapro.com/api/mail/send-ipd-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error sending IPD email:", error.message);
  }
};

const HospitalAppointment = ({ isOpen, onClose, getAllAppointment }) => {

  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape" && isOpen) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);
  const [formValues, setFormValues] = useState({
    name: "",
    disease: "",
    mobile: "",
    city: "",
    email: "",
    description: "",
    state: "Delhi",
  });

  const [hasInsurance, setHasInsurance] = useState(false);
  const [insuranceFiles, setInsuranceFiles] = useState({
    "Aadhar Card": null,
    "Pan Card": null,
    Insurance: null,
  });

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setInsuranceFiles({ ...insuranceFiles, [field]: e.target.files[0] });
  };

  const handleSubmit = async () => {
    if (
      !formValues.name ||
      !formValues.mobile ||
      !formValues.city ||
      !formValues.email
    ) {
      Swal.fire("", "Please fill all required fields.", "error");
      return;
    }

    Swal.fire({
      title: "Booking Appointment...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const result = await submitIPDAppointment({
      name: formValues.name,
      disease: formValues.disease,
      mobile: formValues.mobile,
      city: formValues.city,
      email: formValues.email,
      description: formValues.description,
      insurance: hasInsurance,
      adhar_file: insuranceFiles["Aadhar Card"],
      pan_file: insuranceFiles["Pan Card"],
      insurance_file: insuranceFiles["Insurance"],
    });

    if (result.success) {
      await sendIpdEmail({
        userName: formValues.name,
        userEmail: formValues.email,
        disease: formValues.disease,
        city: formValues.city,
        mobile: formValues.mobile,
        insurance: insuranceFiles.Insurance !== null ? "1" : "0",
      });
      Swal.close();
      Swal.fire("success", "Appointment booked successfully!", "success");
      setFormValues({
        name: "",
        disease: "",
        mobile: "",
        city: "Delhi",
      });
      setHasInsurance(false);
      setInsuranceFiles({
        "Aadhar Card": null,
        "Pan Card": null,
        Insurance: null,
      });
      getAllAppointment();
      onClose();
    } else {
      Swal.fire("", "Failed to book appointment: " + result.message, "error");
      Swal.close();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[95%] md:max-w-2xl max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700"
          onClick={()=>{onClose() ;
      setFormValues({
        name: "",
        disease: "",
        mobile: "",
        city: "Delhi",
      });
      setHasInsurance(false);
      setInsuranceFiles({
        "Aadhar Card": null,
        "Pan Card": null,
        Insurance: null,
      });}}
        >
          &times;
        </button>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900">
            Consult expert surgeons
          </h2>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Patient Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Patient Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Patient name"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email Address<span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* Disease */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Select Disease
              </label>
              <input
                type="text"
                name="disease"
                value={formValues.disease}
                onChange={handleInputChange}
                placeholder="e.g. Semen Freezing"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Mobile Number<span className="text-red-600"> *</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formValues.mobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                State<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="state"
                value={formValues.state}
                onChange={handleInputChange}
                placeholder="State"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                City Name<span className="text-red-600"> *</span>
              </label>
              <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleInputChange}
                placeholder="City name"
                className="w-full border rounded-xl p-2.5 text-sm"
              />
            </div>

            {/* Empty Spacer */}
            <div></div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1 font-semibold">
                Description <span className="text-blue-600">(Optional)</span>
              </label>
              <textarea
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                placeholder="How Are You Feeling? Please Describe Your Condition"
                rows={3}
                className="w-full border rounded-xl p-2.5 text-sm resize-none"
              />
            </div>
          </div>

          {/* Upload Documents */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Identity Documents{" "}
              <span className="text-blue-600">(Optional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Aadhar Card", "Pan Card"].map((field) => (
                <div
                  key={field}
                  className="relative border rounded-xl p-3 bg-gray-50 hover:bg-gray-100"
                >
                  <label className="block text-sm text-gray-600 mb-1 font-medium">
                    Upload {field}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, field)}
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {insuranceFiles[field] && (
                    <p className="text-xs mt-1 text-blue-600 truncate">
                      {insuranceFiles[field].name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Option */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have insurance?{" "}
              <span className="text-blue-600">(Optional)</span>
            </label>
            <div className="flex items-center gap-5 flex-wrap">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="insurance"
                  value="yes"
                  onChange={() => setHasInsurance(true)}
                  className="mr-2 cursor-pointer"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="insurance"
                  value="no"
                  onChange={() => {
                    setHasInsurance(false);
                    setInsuranceFiles({ ...insuranceFiles, Insurance: null });
                  }}
                  className="mr-2 cursor-pointer"
                />
                No
              </label>
            </div>
          </div>

          {/* Insurance File Upload */}
          {hasInsurance && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Insurance Document
              </label>
              <div className="border rounded-xl p-3 bg-gray-50 hover:bg-gray-100">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "Insurance")}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                {insuranceFiles["Insurance"] && (
                  <p className="text-xs mt-1 text-blue-600 truncate">
                    {insuranceFiles["Insurance"].name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm"
              onClick={handleSubmit}
            >
              Book An Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAppointment;
