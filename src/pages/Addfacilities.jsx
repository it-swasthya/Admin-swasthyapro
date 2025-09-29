import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { changeNavValue } from "../Redux/reducer";

function AddFacilities() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Add Facility"));
  }, []);
  const handleSubmit = async () => {
    if (!name || !imageUrl) {
      return setMessage("Facility name and image URL are required");
    }

    const facilityData = {
      id: uuidv4(),
      name,
      image_url: imageUrl,
    };

    try {
      const res = await fetch(
        "https://api.swasthyapro.com/api/database/add-facility",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(facilityData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Facility added successfully!");
        setName("");
        setImageUrl("");
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting the form");
    }
  };

  return (
    <div className=" sm:p-6 md:p-8  bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6">
            <label
              htmlFor="facilityName"
              className="block text-gray-700 text-sm sm:text-base font-semibold mb-2"
            >
              Facility Name
            </label>
            <input
              id="facilityName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter facility name"
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="imageUrl"
              className="block text-gray-700 text-sm sm:text-base font-semibold mb-2"
            >
              Image URL
            </label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="shadow-md appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("Error") ? "text-red-600" : "text-green-600"
              } mb-6 text-center`}
            >
              {message}
            </p>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add Facility
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFacilities;
