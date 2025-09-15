import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import TableComponent from "../../components/table/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { changeNavValue } from "../../Redux/reducer";
import { useTheme, useMediaQuery } from "@mui/material";
import { getRadiologyAppointmentTableColumns } from "../../components/columns/RadiologyAppointmentColumn";
import { RadiologyAppointmentFlattenRow } from "../../utils/RadiologyAppointmentFlattenRow";
// import { getRadiologyAppointmentTableColumns } from "../../components/columns/RadiologyAppointments";
// import { RadiologyAppointmentFlattenRow } from "../../utils/RadiologyAppointmentFlattenRow";

const RadiologyAppointments = () => {
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState([]);
  const [error, setError] = useState(null);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [price, setPrice] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const getRadiologyAppointments = async () => {
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await axios.get(
        "https://api.swasthyapro.com/api/labs/radiology-appointments"
      );
      setAppointment(response.data.data);
    } catch (err) {
      setError("Error fetching appointments");
      console.error("Error fetching users:", err);
    } finally {
      Swal.close();
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Radiology Appointments"));
    getRadiologyAppointments();
  }, [dispatch]);

  // Handle submit allot center
const handleSubmitAllot = async () => {
  if (!selectedCenter || !price) {
    Swal.fire("Error", "Please select a center and enter price", "error");
    return;
  }

  try {
    // Show loading
    Swal.fire({
      title: "Allotting center...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // API request
    await axios.post("https://api.swasthyapro.com/api/labs/allot-center", {
      appointmentId: selectedUser.id,
      center: selectedCenter,
      price,
    });

    Swal.close(); // close loading
    Swal.fire("Success", "Center allotted successfully!", "success");

    // Close modal & reset states
    setOpenModal(false);
    setSelectedCenter("");
    setPrice("");
    setSelectedUser(null);

    // Refresh appointments
    getRadiologyAppointments();
  } catch (err) {
    console.error("Error allotting center:", err);
    Swal.close(); // close loading in case of error
    Swal.fire("Error", "Failed to allot center", "error");
  }
};


  const column = getRadiologyAppointmentTableColumns({
    onCenterAllot: (user) => {
      setSelectedUser(user);
      setOpenModal(true);
    },
  });

  return (
    <>
      {/* <div className="mb-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <button
          onClick={() => navigate("/create-user")}
          className=" h-[40px] sm:h-auto bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
        >
          + Create User
        </button>
      </div> */}

      <TableComponent
        columns={column}
        data={appointment}
        flattenRow={RadiologyAppointmentFlattenRow}
        filename={"Radiology Appointments file"}
      />

      {/* Allot Center Modal */}
     {openModal && (
 <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-50">
  <div className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-6">
    <h2 className="text-xl text-black font-semibold mb-4">
      Allot Center for {selectedUser?.name}
    </h2>

    {/* Centers Dropdown */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-1">
        Select Center<span className="text-red-600">*</span>
      </label>
      <select
        value={selectedCenter}
        onChange={(e) => setSelectedCenter(e.target.value)}
        className="w-full p-2 rounded-lg border-gray-300 text-black shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
      >
        <option value="">-- Select a center --</option>
        <option value="SRM">SRM</option>
        {/* <option value="Center 2">Center 2</option>
        <option value="Center 3">Center 3</option> */}
      </select>
    </div>

    {/* Price Input */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-black mb-1">
        Enter Price<span className="text-red-600">*</span>
      </label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 rounded-lg border-gray-300 text-black shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
        placeholder="Enter price"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-3">
      <button
        onClick={() => setOpenModal(false)}
        className="px-4 py-2 rounded-lg border border-gray-300 text-black hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmitAllot}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Submit
      </button>
    </div>
  </div>
</div>

)}

    </>
  );
};

export default RadiologyAppointments;
