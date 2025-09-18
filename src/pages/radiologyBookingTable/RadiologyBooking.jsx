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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { changeNavValue } from "../../Redux/reducer";
import { getRadiologyBookingColumn } from "../../components/columns/RadiologyBookingColumn";
import { RadiologyAppointmentFlattenRow } from "../../utils/RadiologyBookingFlattenRow";

const RadiologyBooking = () => {
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState([]);
  const [error, setError] = useState(null);

  // Modal states
  // const [openModal, setOpenModal] = useState(false);
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [selectedCenter, setSelectedCenter] = useState("");
  const [opentStatusUpdate, setStatusUpdate] = useState(false);
  const [seletedPaymentMethod, setSelectedPaymentStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // const [price, setPrice] = useState("");

  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const navigate = useNavigate();

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


  const updatePaymentStatus = async () => {
    setStatusUpdate(false);
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.patch(
        "https://api.swasthyapro.com/api/labs/radiology/RADBOOK698019/payment",
        {
          payment_status: seletedPaymentMethod,
        }
      );

      if (response.status === 200) {
        getRadiologyBooking();
        Swal.fire({
          text: "Status updated",
          icon: "success",
          timer: 1000,
        });
      }
    } catch (err) {
      Swal.fire({
        text: "Something went wrong",
        icon: "error",
        timer: 1000,
      });
    } finally {
      Swal.close();
    }
  };

  const handleEditPayment = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(true);
  };

  const column = getRadiologyBookingColumn({ handleEditPayment , getRadiologyBooking });

  return (
    <>
      <TableComponent
        columns={column}
        data={appointment}
        flattenRow={RadiologyAppointmentFlattenRow}
        filename={"Radiology Appointments file"}
      />
      <Dialog open={opentStatusUpdate} onClose={() => setStatusUpdate(false)}>
        <DialogTitle>Edit Payment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="payment-status-label">Payment Status</InputLabel>
            <Select
              labelId="payment-status-label"
              value={seletedPaymentMethod}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              label="Payment Status"
            >
              {["paid", "pending", "paid at centre", "partial paid"].map(
                (status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdate(false)}>Cancel</Button>
          <Button onClick={updatePaymentStatus} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RadiologyBooking;
