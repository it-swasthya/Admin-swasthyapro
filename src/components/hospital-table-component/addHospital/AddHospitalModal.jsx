import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const AddHospitalModal = ({ open, handleClose, onSubmit }) => {
  const [hospitalName, setHospitalName] = useState("");
  const [admitDate, setAdmitDate] = useState(dayjs());

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ hospitalName, admitDate: admitDate.format("YYYY-MM-DD") });
    handleClose();
    setHospitalName('')
    
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          Add Hospital Details
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Hospital Name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            fullWidth
            required
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Admit Date"
              value={admitDate}
              onChange={(newValue) => setAdmitDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>

          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddHospitalModal;
