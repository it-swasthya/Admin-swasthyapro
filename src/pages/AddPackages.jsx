import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";

function AddPackages() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.packageData || null;
  const editTest = location.state?.data || null
  
  const dispatch = useDispatch();
  const [packageName, setPackageName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [afterDiscount, setAfterDiscount] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [packageType, setPackageType] = useState("");
  const [sampleType, setSampleType] = useState("");
  const [testTAT, setTestTAT] = useState("");
  const [testDetails, setTestDetails] = useState("");

  const parsedPrice = parseFloat(price) || 0;
  const parsedDiscount = parseFloat(discount) || 0;
  const calculatedAfterDiscount = parsedPrice - ((parsedPrice * parsedDiscount) / 100);
  useEffect(() => {
    dispatch(changeNavValue(editData || editTest ? "Edit Package" : "Add Package"));
    const storedTests = JSON.parse(localStorage.getItem("selectedTests")) || [];
    setSelectedTests(storedTests);
    const storedState = JSON.parse(localStorage.getItem("addPackageForm"));
    if (storedState || editTest) {
      setPackageName(storedState?.packageName || "");
      setPrice(storedState?.price || "");
      setDiscount(storedState?.discount || "");
      setAfterDiscount(storedState?.afterDiscount || "");
      setSelectedTests(storedTests || []);
      setPackageType(storedState?.packageType || "");
      setSampleType(storedState?.sampleType || "");
      setTestTAT(storedState?.testTAT || "");
      setTestDetails(storedState?.testDetails || "");
    }
    if (editData) {
      localStorage.setItem("selectedTests", JSON.stringify(editData?.test_data));
      setPackageName(editData?.package_name || "");
      setPrice(editData?.market_price || "");
      setDiscount(editData?.discount_percentage || "");
      setAfterDiscount(editData?.after_discount_price || "");
      setSelectedTests(editData?.test_data || []);
      setPackageType(editData?.Package_type || "");
      setSampleType(editData?.sample_type || "");
      setTestTAT(editData?.test_TAT || "");
      setTestDetails(editData?.test_details || "");
    }
    return () => {
      const allowedRoutes = ["/list-tests"];
      const nextPath = window.location.pathname;
     
      if (!allowedRoutes.includes(nextPath)) {
        localStorage.removeItem("selectedTests");
        localStorage.removeItem("addPackageForm");
      }
    };
  }, [editData]);

  useEffect(() => {
    setAfterDiscount(calculatedAfterDiscount);
  }, [calculatedAfterDiscount]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedTests.length === 0) {
      alert("Please add at least one test.");
      return;
    }
    const packageData = {
      package_name: packageName,
      test_data: selectedTests,
      market_price: parseInt(price),
      discount_percentage: parseInt(discount),
      after_discount_price: parseInt(afterDiscount),
      creation_date: new Date().toISOString().split("T")[0],
      test_details: testDetails,
      sample_type: sampleType,
      test_TAT: testTAT,
      Package_type: packageType,
    };
  
    try {
      const action = editData || editTest ? "Update" : "Add";
      const confirmation = await Swal.fire({
        title: `${action} Package`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: `Yes, ${action}`,
      });

      if (!confirmation.isConfirmed) return;
      const url = editData || editTest
        ? `https://api.swasthyapro.com/api/database/update-package/${editData?.id || editTest?.id}`
        : "https://api.swasthyapro.com/api/database/add-package";
      const method = editData || editTest ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(packageData),
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire(
          `${action}d!`,
          `Package ${action.toLowerCase()}d successfully`,
          "success"
        );
        localStorage.removeItem("addPackageForm")
        localStorage.removeItem("selectedTests")

        navigate("/list-packages");
      } else {
        Swal.fire(
          "Error",
          `Failed to ${action.toLowerCase()} package`,
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something Went Wrong", "error");
    }
  };

  const handleAddTest = () => {
    localStorage.setItem(
      "addPackageForm",
      JSON.stringify({
        packageName,
        price,
        discount,
        afterDiscount,
        selectedTests,
        packageType,
        sampleType,
        testTAT,
        testDetails,
      
      })
    );
    navigate("/list-tests", {
      state: { from: location.pathname, editData },
      replace: true,
    });
  };

  const handleRemoveTest = (indexToRemove) => {
    setSelectedTests((prevTests) =>
      prevTests.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="packageName"
              className="block font-bold mb-2 text-black"
            >
              Package Name
            </label>
            <input
              required
              id="packageName"
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="Enter package name"
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="packageType"
              className="block font-bold mb-2 text-black"
            >
              Package Type
            </label>
            <input
              required
              id="packageType"
              type="text"
              value={packageType}
              onChange={(e) => setPackageType(e.target.value)}
              placeholder="Enter package type"
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="packagePrice"
              className="block font-bold mb-2 text-black"
            >
              Price (₹)
            </label>
            <input
              required
              id="packagePrice"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="discount"
              className="block font-bold mb-2 text-black"
            >
              Discount (%)
            </label>
            <input
              required
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="afterDiscount"
              className="block font-bold mb-2 text-black"
            >
              Price After Discount (₹)
            </label>
            <input
              readOnly
              id="afterDiscount"
              type="number"
              value={afterDiscount}
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          {/* Test List */}
          <div className="mb-4">
            <label htmlFor="test" className="block font-bold mb-2 text-black">
              Included Tests
            </label>
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={handleAddTest}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            {selectedTests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTests.map((test, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {test.test_name || `Test ${index + 1}`}
                    <TrashIcon
                      className="w-4 h-4 cursor-pointer text-red-500"
                      onClick={() => handleRemoveTest(index)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-black">
              Test Details (Optional)
            </label>
            <textarea
              value={testDetails}
              onChange={(e) => setTestDetails(e.target.value)}
              className="shadow border text-black rounded w-full py-2 px-3"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-black">
              Sample Type (Optional)
            </label>
            <input
              type="text"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-black">
              Test TAT (Optional)
            </label>
            <input
              type="text"
              value={testTAT}
              onChange={(e) => setTestTAT(e.target.value)}
              className="shadow border text-black rounded w-full py-2 px-3"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              {editData ||editTest ? "Update Package" : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPackages;
