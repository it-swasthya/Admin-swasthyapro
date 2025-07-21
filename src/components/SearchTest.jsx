import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/reducer";

const TestList = ({ searchQuery }) => {
  const [testList, setTestList] = useState([]); // For storing fetched tests
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error state
  const [selectedTestNames, setSelectedTestNames] = useState([]); // For storing selected tests

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTests = async () => {
      if (searchQuery.trim().length === 0) return; // Don't fetch if searchQuery is empty

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.swasthyapro.com/api/database/page/1/limit/100?q=${searchQuery}`
        );
        setTestList(response.data.data || []);
      } catch (err) {
        console.error("Error fetching test list:", err);
        setError("Failed to load test data");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [searchQuery]); // Only trigger when searchQuery changes

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
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
    <div className="w-full p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Search Results</h2>

      {testList.length === 0 ? (
        <p className="text-center text-gray-500">No tests found for this search.</p>
      ) : (
        <div className="space-y-6">
          {testList.map((test) => {
            const selected = selectedTestNames.includes(test.test_name);
            return (
              <label
                key={test.id}
                className="flex justify-between items-center p-2 border border-gray-300 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleCheckboxChange(test)}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <span className="text-gray-800 font-medium text-lg">
                    {highlightText(test.test_name, searchQuery)}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-400 line-through">
                    MRP ₹{test.market_price}
                  </div>
                  <div className="text-blue-600 font-semibold text-xl">
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

export default TestList;
