import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/reducer";
import { decryptEncryptedData } from "../utils/DecodeFormatData";

const TestWithPrices = ({ facilityName, searchQuery }) => {
  const [testList, setTestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestNames, setSelectedTestNames] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.swasthyapro.com/api/database/page/1/limit/100?q=${searchQuery || facilityName}`
        );

        const decodedData =  await decryptEncryptedData(response.data) 

        setTestList(decodedData.data || []);
      } catch (err) {
        console.error("Error fetching test list:", err);
        setError("Failed to load test data");
      } finally {
        setLoading(false);
      }
    };

    if (facilityName||searchQuery) getTests();

    const storedTests = JSON.parse(localStorage.getItem("tests")) || [];
    setSelectedTestNames(storedTests.map((test) => test.name));
  }, [facilityName, searchQuery]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
  };


  const highlightText = (text, query) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  const handleCheckboxChange = (test) => {
    const isSelected = selectedTestNames.includes(test.test_name);
    const updatedSelected = isSelected
      ? selectedTestNames.filter((name) => name !== test.test_name)
      : [...selectedTestNames, test.test_name];
    setSelectedTestNames(updatedSelected);

    dispatch(addToCart({ test, isSelected }));
  };

  if (loading) return <p className="p-6 text-gray-500">Loading tests...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
  <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8 text-center">
    {facilityName?.toUpperCase()}
  </h2>

  {testList.length === 0 ? (
    <p className="text-center text-gray-500">No tests available for this category.</p>
  ) : (
    <div className="space-y-4">
      {testList.map((test) => {
        const selected = selectedTestNames.includes(test.test_name);
        return (
          <label
            key={test.id}
            className="flex justify-between items-center p-3 sm:p-4 border border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="checkbox"
                checked={selected}
                onChange={() => handleCheckboxChange(test)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="text-gray-800 font-medium text-base sm:text-lg">
                {highlightText(test.test_name, searchQuery)}
              </span>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400 line-through">
                MRP ₹{test.market_price}
              </div>
              <div className="text-blue-600 font-semibold text-lg sm:text-xl">
                ₹{test.after_discount_price}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  )}
</div>

  );
};

export default TestWithPrices;
