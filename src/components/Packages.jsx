import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { addPackageToCart } from "../Redux/reducer";
import { decryptEncryptedData } from "../utils/DecodeFormatData";
import { routesToObfuscated } from "../utils/RoutesKey";

function PackagesCard() {
  const [data, setData] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPackages = async () => {
      const response = await axios.get(
        `https://api.swasthyapro.com/api/database/${routesToObfuscated["get-packages"]}`
      );
      const decodedData = await decryptEncryptedData(response.data);
      setData(decodedData.data);
    };

    getPackages();

    // Load selected packages from localStorage
    const storedPackages = JSON.parse(localStorage.getItem("packages")) || [];
    const storedNames = storedPackages.map((pkg) => pkg.name);
    setSelectedPackages(storedNames);
  }, []);

  const handleCheckboxChange = (item) => {
    const isSelected = selectedPackages.includes(item.Package_type);
    const updatedSelected = isSelected
      ? selectedPackages.filter((name) => name !== item.Package_type)
      : [...selectedPackages, item.Package_type];

    setSelectedPackages(updatedSelected);
    dispatch(addPackageToCart({ package: item, isSelected }));
  };

  const showTestsPopup = (pkg) => {
    const testList = Array.isArray(pkg.test_data)
      ? pkg.test_data
          .map(
            (test, index) =>
              `<li><strong>${index + 1}</strong> - ${test.test_name}</li>`
          )
          .join("")
      : "<li>No test data available.</li>";

    Swal.fire({
      title: `Tests in ${pkg.package_name}`,
      html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
      confirmButtonText: "Close",
      width: "40rem",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-6 bg-gray-100 gap-y-4 gap-x-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-lg rounded-lg p-6 relative border border-gray-300 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:cursor-pointer max-w-xs flex flex-col justify-between"
        >
          {/* Top Section */}
          <div className="flex-grow">
            {/* Package Type */}
            <div className="font-semibold mb-1 uppercase text-black bg-blue-200 rounded-full text-sm tracking-wide px-2 py-1 inline-block">
              {item.Package_type.toUpperCase()}
            </div>

            {/* Test List */}
            <ul className="text-gray-700 mb-2 space-y-2">
              <li
                className="flex items-center px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-all duration-200"
                onClick={() => showTestsPopup(item)}
              >
                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500 transform transition-all duration-200 hover:scale-110 hover:rotate-12" />
                {item.test_data?.length || 0} Tests Covered{" "}
                {item.test_data?.length > 0 && "▼"}
              </li>
            </ul>

            {/* Price Section */}
            <div className="text-blue-700 font-bold text-lg mb-1 flex items-center">
              {item.market_price && (
                <span className="line-through text-gray-500 text-sm mr-2">
                  ₹{item.market_price}
                </span>
              )}
              ₹{item.after_discount_price}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-end mt-4">
            {/* Add to Cart Checkbox */}
            <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedPackages.includes(item.Package_type)}
                onChange={() => handleCheckboxChange(item)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 transition"
              />
              <span
                className={`text-xs font-semibold ${
                  selectedPackages.includes(item.Package_type)
                    ? "text-blue-700"
                    : "text-black"
                }`}
              >
                {selectedPackages.includes(item.Package_type) ? "Added" : "Add"}
              </span>
            </label>

            {/* Discount + Know More */}
            <div className="flex flex-col items-end">
              {item.discount_percentage && (
                <div className="mb-2 bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md transform hover:scale-105 transition duration-300">
                  {item.discount_percentage}% OFF
                </div>
              )}

              <button
                className="relative text-blue-600 font-semibold hover:text-blue-700 flex items-center transition-all duration-300 group"
                onClick={() => showTestsPopup(item)}
              >
                Know More
                <ArrowRightIcon className="w-4 h-4 ml-1 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
                <span className="absolute top-full mt-1 left-0 hidden group-hover:block text-xs bg-gray-700 text-white px-2 py-1 rounded-lg shadow-lg z-10">
                  View tests
                </span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PackagesCard;
