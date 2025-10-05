import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const UpdateBookingStatusCell = ({ row, getRadiologyBooking }) => {
  const [status, setStatus] = useState(row.booking_status || "");
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

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
    setOpenDatePicker(false)
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
          time_slot: selectedTimeSlot || null,
        }
      );

    if(newStatus === 'rescheduled'){
        await axios.post(
        "https://api.swasthyapro.com/api/mail/send-reschedule-mail",
        {
          userName: row.fullName || null,
          userEmail: row.email,
          orderId: row.id,
          oldDate: row.rescheduled_date !== "N/A" ? row.rescheduled_date : row.booking_date,
          oldTime: row.slotTime,
          newDate: dayjs(date).format("YYYY-MM-DD") || null,
          newTime: selectedTimeSlot,
        }
      );
    }

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

  const timeSlots = [
    "6AM - 8AM",
    "8AM - 10AM",
    "10AM - 12PM",
    "12PM - 2PM",
    "2PM - 4PM",
    "4PM - 6PM",
  ];
  return (
    <>
      {row.booking_status === "cancelled" ||
      row.booking_status === "completed" ? (
        <p>{row.booking_status}</p>
      ) : (
        <Select value={status} onChange={handleChange} size="small" fullWidth>
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="rescheduled">Rescheduled</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      )}
      <Dialog
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{ fontWeight: 600, textAlign: "center", pb: 1, color: "#1976d2" }}
        >
          Reschedule Booking
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select New Date"
              value={rescheduleDate}
              onChange={(newValue) => setRescheduleDate(newValue)}
              disablePast
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>

          {/* Time Slot Selector */}
          <Box mt={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="timeSlot-label">Select Time Slot *</InputLabel>
              <Select
                labelId="timeSlot-label"
                id="timeSlot"
                value={selectedTimeSlot}
                label="Select Time Slot *"
                onChange={(e) => {
                  setSelectedTimeSlot(e.target.value);
                  localStorage.setItem("booking_time_slot", e.target.value);
                }}
              >
                <MenuItem value="">-- Select Time Slot --</MenuItem>
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Button
            onClick={() => setOpenDatePicker(false)}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmReschedule}
            disabled={!rescheduleDate || !selectedTimeSlot}
            sx={{ textTransform: "none", px: 3 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateBookingStatusCell;
