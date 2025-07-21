import { useEffect, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import Select from "react-select";

function Faq() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editData = location.state?.testData || null;

  const [formData, setFormData] = useState({
    facility_id: "",
    test_id: "",
    test_name: "",
  });

  const [faqList, setFaqList] = useState([{ faq_ques: "", faq_ans: "" }]);
  const [facilities, setFacilities] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [testList, setTestList] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  useEffect(() => {
    dispatch(changeNavValue(editData ? "Edit FAQ" : "Add New FAQ"));

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
  }, [dispatch, editData]);

  // useEffect(() => {
  //   if (formData.facility_id) {
  //     const fetchDefaultTests = async () => {
  //       setLoadingTests(true);
  //       try {
  //         const response = await fetch(
  //           `https://api.swasthyapro.com/api/database/page/1/limit/10?q=${formData.facility_id}`
  //         );
  //         const result = await response.json();
  //         setTestList(result.data || []);
  //       } catch (err) {
  //         console.error("Error loading default tests:", err);
  //         setTestList([]);
  //       } finally {
  //         setLoadingTests(false);
  //       }
  //     };

  //     fetchDefaultTests();
  //   }
  // }, [formData.facility_id]);


  useEffect(() => {
    if (editData) {
      setFormData({
        facility_id: editData.facility_id || "",
        test_id: editData.test_id || "",
        test_name: editData.test_name || "",
      });
      setFaqList(editData.faqs || [{ faq_ques: "", faq_ans: "" }]);
    }
  }, [editData]);

  const handleFacilitySelect = async(e) => {
    const selectedFacility = facilities.find((f) => f.id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      facility_id: e.target.value,
    }));
    try {
      const response = await fetch(
        `https://api.swasthyapro.com/api/database/page/1/limit/1000?q=${selectedFacility.name || ""}`
      );
      const result = await response.json();
      setTestList(result.data || []);
    } catch (err) {
      console.error("Error fetching test list:", err);
      setTestList([]);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqList];
    updatedFaqs[index][field] = value;
    setFaqList(updatedFaqs);
  };

  const addFaqField = () => {
    setFaqList([...faqList, { faq_ques: "", faq_ans: "" }]);
  };

  const removeFaqField = (index) => {
    const updatedFaqs = [...faqList];
    updatedFaqs.splice(index, 1);
    setFaqList(updatedFaqs);
  };

  const handleSubmit = async () => {
    const finalData = {
      facility_id: formData.facility_id,
      test_id: formData.test_id || uuidv4(),
      faqs: faqList.filter((f) => f.faq_ques.trim() && f.faq_ans.trim()),
    };

    const isEdit = !!editData;
    try {
      const confirmation = await Swal.fire({
        title: isEdit ? "Update Test?" : "Add FAQ?",
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
          : "https://api.swasthyapro.com/api/faq/add-faq",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Swal.fire(
          isEdit ? "Updated!" : "Added!",
          `FAQ has been ${isEdit ? "updated" : "added"} successfully.`,
          "success"
        );
        navigate("/");
      } else {
        Swal.fire("Error!", result.error || "Something went wrong.", "error");
      }
    } catch (error) {
      console.error("Error submitting FAQ:", error);
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
          {/* Facility Selector */}
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

          {/* Searchable Test Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Test
            </label>
           <Select
  value={
    formData.test_id
      ? {
          value: formData.test_id,
          label: formData.test_name,
        }
      : null
  }
  onInputChange={(inputValue) => setSearchInput(inputValue)}
  onChange={(selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      test_id: selectedOption?.value || "",
      test_name: selectedOption?.label || "",
    }));
  }}
  options={testList
    .filter((test) =>
      test.test_name.toLowerCase().includes(searchInput.toLowerCase())
    )
    .map((test) => ({
      value: test.id,
      label: test.test_name,
    }))}
  isLoading={loadingTests}
  isClearable
  placeholder="Search or select test..."
  noOptionsMessage={() =>
    searchInput && testList.length === 0
      ? "No results found"
      : "No tests available"
  }
  className="text-black"
  isDisabled={formData.facility_id ? false :true}
/>

          </div>

          {/* FAQs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">FAQs</h3>
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded shadow-sm space-y-2"
              >
                <input
                  type="text"
                  placeholder="FAQ Question"
                  value={faq.faq_ques}
                  onChange={(e) =>
                    handleFaqChange(index, "faq_ques", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                  
        disabled={formData.facility_id && formData.test_id ? false :true}
                />
                <input
                  type="text"
                  placeholder="FAQ Answer"
                  value={faq.faq_ans}
                  onChange={(e) =>
                    handleFaqChange(index, "faq_ans", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded text-black"
                  required
                    disabled={formData.facility_id && formData.test_id ? false :true}

                />
                {faqList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFaqField(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFaqField}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add another FAQ
            </button>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editData ? "Update FAQs" : "Add FAQs"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Faq;
