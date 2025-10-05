import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/reducer";
import { decryptEncryptedData } from "../../utils/DecodeFormatData";
import Tests from "./Tests";

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

        const decodedData = await decryptEncryptedData(response.data);

        setTestList(decodedData.data || []);
      } catch (err) {
        console.error("Error fetching test list:", err);
        setError("Failed to load test data");
      } finally {
        setLoading(false);
      }
    };

    if (facilityName || searchQuery) getTests();

    const storedTests = JSON.parse(localStorage.getItem("tests")) || [];
    setSelectedTestNames(storedTests.map((test) => test.name));
  }, [facilityName, searchQuery]);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
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

    <Tests
      facilityName={facilityName}
      testList={testList}
      selectedTestNames={selectedTestNames}
      handleCheckboxChange={handleCheckboxChange}
      highlightText={highlightText}
      searchQuery={searchQuery}
    />
  );
};

export default TestWithPrices;
