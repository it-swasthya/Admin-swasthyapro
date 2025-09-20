import {
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateBookingStatusCell = ({ row, getRadiologyBooking }) => {
  const [status, setStatus] = useState(row.booking_status || "");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    if (newStatus === "rescheduled") {
      setOpenDatePicker(true); // open calendar dialog
      return;
    }

    // Normal status update
    await callApi(newStatus);
  };

  const callApi = async (newStatus, date = null) => {
    try {
      Swal.fire({
        title: "Updating booking...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.patch(
        `https://api.swasthyapro.com/api/labs/radiology/${row.id}/status`,
        {
          booking_status: newStatus,
          new_booking_date: date ? dayjs(date).format("YYYY-MM-DD") : null,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Booking updated to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false,
      });
      getRadiologyBooking();
    } catch (err) {
      console.error("Error updating booking status:", err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to update booking status. Please try again.",
      });
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleDate) {
      alert("Please select a date");
      return;
    }
    await callApi("rescheduled", rescheduleDate);
    setOpenDatePicker(false);
  };

  return (
    <>
      {row.booking_status === "cancelled" ||
      row.booking_status === "completed" ? (
        <p>{row.booking_status}</p>
      ) : (
        <Select value={status} onChange={handleChange} size="small" fullWidth>
          <MenuItem value="test booked">Test Booked</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="rescheduled">Rescheduled</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      )}
      <Dialog open={openDatePicker} onClose={() => setOpenDatePicker(false)}>
        <DialogTitle>Reschedule Booking</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Select New Date"
            value={rescheduleDate}
            onChange={(newValue) => setRescheduleDate(newValue)}
            disablePast
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDatePicker(false)}>Cancel</Button>
          <Button onClick={handleConfirmReschedule} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBookingStatusCell;
