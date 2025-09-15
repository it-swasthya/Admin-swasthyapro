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
import { getRadiologyBookingColumn } from "../../components/columns/RadiologyBookingColumn";
import { RadiologyAppointmentFlattenRow } from "../../utils/RadiologyBookingFlattenRow";

const RadiologyBooking = () => {
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

 const getRadiologyBooking = async () => {
  try {
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.get(
      "https://api.swasthyapro.com/api/labs/get-radiology/bookings"
    );

    const formatted = response.data.result.map((appointment) =>
      RadiologyAppointmentFlattenRow(appointment)
    );


    setAppointment(formatted);
  } catch (err) {
    setError("Error fetching appointments");
    console.error("Error fetching appointments:", err);
  } finally {
    Swal.close();
  }
};

  useEffect(() => {
    dispatch(changeNavValue("Radiology Orders"));
    getRadiologyBooking();
  }, [dispatch]);

  // Handle submit allot center
  // const handleSubmitAllot = async () => {
  //   if (!selectedCenter || !price) {
  //     Swal.fire("Error", "Please select a center and enter price", "error");
  //     return;
  //   }

  //   try {
  //     // Show loading
  //     Swal.fire({
  //       title: "Allotting center...",
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading();
  //       },
  //     });

  //     // API request
  //     await axios.post("https://api.swasthyapro.com/api/labs/allot-center", {
  //       appointmentId: selectedUser.id,
  //       center: selectedCenter,
  //       price,
  //     });

  //     Swal.close(); // close loading
  //     Swal.fire("Success", "Center allotted successfully!", "success");

  //     // Close modal & reset states
  //     setOpenModal(false);
  //     setSelectedCenter("");
  //     setPrice("");
  //     setSelectedUser(null);

  //     // Refresh appointments
  //     getRadiologyAppointments();
  //   } catch (err) {
  //     console.error("Error allotting center:", err);
  //     Swal.close(); // close loading in case of error
  //     Swal.fire("Error", "Failed to allot center", "error");
  //   }
  // };

  const column = getRadiologyBookingColumn(
  //   {
  //   onCenterAllot: (user) => {
  //     setSelectedUser(user);
  //     setOpenModal(true);
  //   },
  // }
);

  return (
    <>
   <TableComponent
        columns={column}
        data={appointment}
        flattenRow={RadiologyAppointmentFlattenRow}
        filename={"Radiology Appointments file"}
      />

      
    </>
  );
};

export default RadiologyBooking;
