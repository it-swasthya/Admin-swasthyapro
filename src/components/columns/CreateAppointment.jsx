import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";

import DoctorTable from "../table/DoctorTable";
import HospitalTable from "../table/HospitalTable";
import { fetchDoctors, fetchHospitals } from "../doctorandHospital";

export default function CreateAppointment() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  /* ================= React Hook Form ================= */
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      doctorId: "",
      hospitalId: "",
      date: "",
      timeSlot: "",
    },
  });

  /* ================= Fetch Data ================= */
  useEffect(() => {
    fetchDoctors()
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Doctor fetch error:", err));

    fetchHospitals()
      .then((res) => res.json())
      .then((data) => setHospitals(data))
      .catch((err) => console.error("Hospital fetch error:", err));
  }, []);

  /* ================= Submit ================= */
  const onSubmit = async (data) => {
    try {
      console.log("Appointment Data:", data);

      // 🔥 Call your API here
      // await createAppointmentAPI(data);

      reset();
      setOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Appointment Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Appointment
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Doctor Appointments" />
        <Tab label="Hospital Appointments" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <DoctorTable />}
        {tab === 1 && <HospitalTable />}
      </Box>

      {/* ================= PROFESSIONAL POPUP ================= */}
      {/* ================= REGISTRATION STYLE POPUP ================= */}
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      padding: 0,
    },
  }}
>
  <DialogContent sx={{ p: 0 }}>

    {/* Top Section */}
    <Box
      sx={{
        textAlign: "center",
        px: 4,
        pt: 4,
        pb: 2,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        Create Appointment
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Fill in the details below to schedule visit
      </Typography>
    </Box>

    {/* Form Section */}
    <Box sx={{ px: 4, pb: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Patient Name */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Patient name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Patient Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Box>

        {/* Doctor */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="doctorId"
            control={control}
            rules={{ required: "Doctor is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select Doctor"
                fullWidth
                error={!!errors.doctorId}
                helperText={errors.doctorId?.message}
              >
                {doctors.map((doc) => (
                  <MenuItem key={doc.id} value={doc.id}>
                    {doc.name} ({doc.speciality})
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        {/* Hospital */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="hospitalId"
            control={control}
            rules={{ required: "Hospital is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Select Hospital"
                fullWidth
                error={!!errors.hospitalId}
                helperText={errors.hospitalId?.message}
              >
                {hospitals.map((hos) => (
                  <MenuItem key={hos.id} value={hos.id}>
                    {hos.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

        {/* Date */}
        <Box sx={{ mb: 3 }}>
          <Controller
            name="date"
            control={control}
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
        </Box>

        {/* Time Slot */}
        <Box sx={{ mb: 4 }}>
          <Controller
            name="timeSlot"
            control={control}
            rules={{ required: "Time slot is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Time Slot"
                fullWidth
                error={!!errors.timeSlot}
                helperText={errors.timeSlot?.message}
              >
                <MenuItem value="09:00 AM">09:00 AM</MenuItem>
                <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                <MenuItem value="02:00 PM">02:00 PM</MenuItem>
                <MenuItem value="04:00 PM">04:00 PM</MenuItem>
              </TextField>
            )}
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.4,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
          </Button>

          <Button
            fullWidth
            sx={{ mt: 1.5, textTransform: "none" }}
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>

  </DialogContent>
</Dialog>

    </Box>
  );
}
