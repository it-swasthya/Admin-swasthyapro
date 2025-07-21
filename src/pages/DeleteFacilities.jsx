import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { changeNavValue } from "../Redux/reducer";

function DeleteFacilities() {
  const dispatch = useDispatch()
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState(null);

  useEffect(() => {
    dispatch(changeNavValue("Manage Facilities"))
    const fetchFacilities = async () => {
      try {
        const response = await fetch(
          "https://api.swasthyapro.com/api/database/get-facility"
        );
        const data = await response.json();
        setFacilities(data);
        setFilteredFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    const filtered = facilities.filter((facility) =>
      Object.values(facility)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredFacilities(filtered);
  }, [searchTerm, facilities]);

  const handleDeleteFacility = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this facility?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.swasthyapro.com/api/database/delete-facility/${id}`
      );
      const updated = facilities.filter((f) => f.id !== id);
      setFacilities(updated);
      setFilteredFacilities(updated);
      Swal.fire("Deleted!", "The facility has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting facility:", error);
      Swal.fire("Error", "There was an issue deleting the facility.", "error");
    }
  };

  const handleEditFacility = (facility) => {
    setCurrentFacility(facility);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleUpdateFacility = async (e) => {
    e.preventDefault();
    const updatedFacility = {
      name: e.target.name.value,
      image_url: e.target.image_url.value,
    };

    try {
      await axios.put(
        `https://api.swasthyapro.com/api/database/edit-facility/${currentFacility.id}`,
        updatedFacility
      );

      const updatedList = facilities.map((f) =>
        f.id === currentFacility.id ? { ...f, ...updatedFacility } : f
      );
      setFacilities(updatedList);
      setFilteredFacilities(updatedList);
      Swal.fire(
        "Updated!",
        "Facility details updated successfully.",
        "success"
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating facility:", error);
      Swal.fire("Error", "There was a problem updating the facility.", "error");
    }
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);

    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: "yellow" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative min-h-screen p-3 bg-gray-50" style={{marginTop:"-12px"}}>
      <input
        type="text"
        placeholder="Search facilities..."
        className="mb-4 w-70 max-w-md px-4 text-black py-2 border border-gray-300 rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-4">
            <span className="text-lg text-gray-500">Loading facilities...</span>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-teal-500">
              <tr>
                <th className="px-6 py-2 text-left text-base font-bold text-white uppercase tracking-wider">
                  Facility Name
                </th>
                <th className="px-6 py-2 text-left text-base font-bold text-white uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-2 text-right text-base font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFacilities.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No facilities found.
                  </td>
                </tr>
              ) : (
                filteredFacilities.map((facility) => (
                  <tr key={facility.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {highlightText(facility.name, searchTerm)}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={facility.image_url}
                        alt={facility.name}
                        className="w-24 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-300"
                        onClick={() => handleEditFacility(facility)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 transition duration-300"
                        onClick={() => handleDeleteFacility(facility.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Editing Facility */}
      {isModalOpen && currentFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Facility
            </h3>
            <form onSubmit={handleUpdateFacility}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Facility Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={currentFacility.name}
                  className="mt-1 block w-full border text-black border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  defaultValue={currentFacility.image_url}
                  className="mt-1 block text-black w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteFacilities;
