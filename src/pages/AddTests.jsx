import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";

function AddTests() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editData = location.state?.testData || null;

  const [formData, setFormData] = useState({
    test_name: "",
    market_price: "",
    discount_percentage: "",
    after_discount_price: "",
    test_details: "",
    sample_type: "",
    test_TAT: "",
    facility_id: "",
    facility_name: "",
  });
  const [selectedParameters, setSelectedParameters] = useState([]);

  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    dispatch(changeNavValue(editData ? "Edit Test" : "Add New Test"));
    const fetchFacilities = async () => {
      try {
        const res = await fetch(
          "https://api.swasthyapro.com/api/database/get-facility"
        );
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        test_name: editData.test_name || "",
        market_price: editData.market_price || "",
        discount_percentage: editData.discount_percentage || "",
        after_discount_price: editData.after_discount_price || "",
        test_details: editData.test_details || "",
        sample_type: editData.sample_type || "",
        test_TAT: editData.test_TAT || "",
        facility_id: editData.facility_id || "",
        facility_name: editData.facility_name || "",
      });
      setSelectedParameters(editData.parameters || []);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFacilitySelect = (e) => {
    const selectedId = e.target.value;
    const selectedFacility = facilities.find((f) => f.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      facility_id: selectedId,
      facility_name: selectedFacility?.name || "",
    }));
  };

  const handleSubmit = async () => {
    const test_id = editData?.test_id || uuidv4();
    const creation_date = new Date().toLocaleDateString();

    const fullData = {
      ...formData,
      test_id,
      creation_date,
    };

    const isEdit = !!editData;

    try {
      const confirmation = await Swal.fire({
        title: isEdit ? "Update Test?" : "Add Test?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: isEdit ? "Yes, update it!" : "Yes, add it!",
      });

      if (!confirmation.isConfirmed) return;

      const response = await fetch(
        isEdit
          ? `https://api.swasthyapro.com/api/database/edit-test/${editData.id}`
          : "https://api.swasthyapro.com/api/database/add-test",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire(
          isEdit ? "Updated!" : "Added!",
          `Test has been ${isEdit ? "updated" : "added"} successfully.`,
          "success"
        );
        navigate("/list-tests");
      } else {
        Swal.fire("Error!", result.error || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      Swal.fire(
        "Error",
        "An error occurred while submitting the form.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-2">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="facility_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Facility
            </label>
            <select
              id="facility_id"
              value={formData.facility_id}
              onChange={handleFacilitySelect}
              className="w-full px-4 py-2 border text-black rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">-- Choose Facility --</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {[
            { id: "test_name", label: "Test Name", type: "text" },
            { id: "market_price", label: "Market Price (₹)", type: "number" },
            {
              id: "discount_percentage",
              label: "Discount (%)",
              type: "number",
            },
            {
              id: "after_discount_price",
              label: "Price After Discount (₹)",
              type: "number",
            },
            { id: "test_TAT", label: "Test TAT (Optional)", type: "text" },
            {
              id: "sample_type",
              label: "Sample Type (Optional)",
              type: "text",
            },
          ].map(({ id, label, type }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                className="w-full px-4 py-2 border text-black rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={label}
                required
              />
            </div>
          ))}

          {/* <div className="mb-4">
            <label htmlFor="test" className="block font-bold mb-2 text-black">
              Included Parameters
            </label>
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                value={parameterValue}
                onChange={(e) => setParameterValue(e.target.value)}
                placeholder="Enter test name"
                className="shadow border text-black rounded w-full py-2 px-3"
              />
              <button
                type="button"
                onClick={handleAddParameter}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-wrap gap-2">
              {selectedParameters.map((parameter, index) => (
                <li
                  key={index}
                  className="flex items-center bg-gray-200 text-black px-3 py-1 rounded-full"
                >
                  {" "}
                  <span>{parameter}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => handleRemoveParameter(index)}
                  >
                    <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700" />
                  </span>
                </li>
              ))}
            </ul>
          </div> */}

          <div>
            <label
              htmlFor="test_details"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Test Details (Optional)
            </label>
            <textarea
              id="test_details"
              value={formData.test_details}
              onChange={handleChange}
              rows={4}
              className="w-full text-black px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter detailed description of the test"
            ></textarea>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editData ? "Update Test" : "Add Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTests;
