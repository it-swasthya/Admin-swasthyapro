import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateHospitalRecordModal = ({ open, handleClose, record,getHospitalAppointment }) => {
  const [formData, setFormData] = useState({
    appointment_id: record?.appointment_id || "",
    status: record?.status || "discharge",
    report_date: new Date().toISOString().slice(0, 10),
    discharge_Date: record?.discharge_Date
      ? record.discharge_Date.slice(0, 10)
      : "",
    report: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
    handleClose();

  // Show loading SweetAlert
  Swal.fire({
    title: "Updating Record...",
    text: "Please wait while we update the hospital record.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const payload = new FormData();
    payload.append("appointment_id", formData.appointment_id);
    payload.append("status", formData.status);
    payload.append("report_date", formData.report_date);
    payload.append("discharge_Date", formData.discharge_Date);
    if (formData.report) payload.append("report", formData.report);

    const response = await axios.put(
      `https://api.swasthyapro.com/api/appointment/update/${record?.id}`,
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );


    // Show success SweetAlert
    Swal.fire({
      icon: "success",
      title: "Record Updated!",
      text: "Hospital record updated successfully.",
      confirmButtonColor: "#3085d6",
    });
    setFormData({
    appointment_id: "",
    status:  "discharge",
    report_date: new Date().toISOString().slice(0, 10),
    discharge_Date: "",
    report: null,
  })
getHospitalAppointment()
  } catch (error) {
    console.error("❌ Update failed:", error);

    // Show error SweetAlert
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text:
        error.response?.data?.message ||
        "Something went wrong while updating the record.",
      confirmButtonColor: "#d33",
    });
  }
};

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          width: "90%",
          maxWidth: 500,
          mx: "auto",
          my: "5%",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Hospital Record
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Appointment ID"
            name="appointment_id"
            value={formData.appointment_id}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Status"
            name="status"
            select
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="admitted">Admitted</MenuItem>
            <MenuItem value="discharge">Discharge</MenuItem>
            <MenuItem value="followup">Follow Up</MenuItem>
          </TextField>

          <TextField
            label="Report Date"
            name="report_date"
            type="date"
            value={formData.report_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Discharge Date"
            name="discharge_Date"
            type="date"
            value={formData.discharge_Date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />

<Stack direction="row" alignItems="center" spacing={2}>
  <Button variant="outlined" component="label">
    Upload Report
    <input
      type="file"
      hidden
      name="report"
      accept=".pdf,.jpg,.png,.jpeg"
      onChange={handleChange}
    />
  </Button>

  {/* ✅ Show selected file name */}
  {formData.report && (
    <Typography variant="body2" sx={{ fontStyle: "italic", color: "text.secondary" }}>
      {formData.report.name}
    </Typography>
  )}
</Stack>

          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UpdateHospitalRecordModal;
