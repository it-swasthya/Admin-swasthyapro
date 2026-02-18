import { useEffect, useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import {
  fetchDoctorById,
  fetchDoctors,
} from "../../components/doctorandHospital";
import Swal from "sweetalert2";

/* ================= SweetAlert MUI Fix ================= */
const swalWithMuiFix = Swal.mixin({
  backdrop: true,
  didOpen: (popup) => {
    popup.parentElement.style.zIndex = 2000;
  },
});

export default function AppointmentForm({
  onSubmit,
  loading,
  open,
  setOpen // 👈 pass dialog open state from parent
}) {
  const [doctors, setDoctors] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      doctorId: "",
      hospitalId: "",
      centerId: "",
      date: "",
      timeSlot: "",
      
    },
  });

  const selectedDoctorId = useWatch({
    control,
    name: "doctorId",
  });

  /* ================= Reset Form When Dialog Closes ================= */

  useEffect(() => {
    if (!open) {
      reset();
      setDoctorDetails(null);
    }
  }, [open, reset]);

  /* ================= Load Doctors ================= */

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        setDoctors(data || []);
      } catch (error) {
        swalWithMuiFix.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load doctors.",
        });
      }
    };

    loadDoctors();
  }, []);

  /* ================= Load Doctor Details ================= */

  useEffect(() => {
    const loadDoctorDetails = async () => {
      if (!selectedDoctorId) {
        setDoctorDetails(null);
        return;
      }

      try {
        const data = await fetchDoctorById(selectedDoctorId);

        if (data) {
          setDoctorDetails(data);
          setValue("hospitalId", "");
          setValue("centerId", "");
        }
      } catch (error) {
        swalWithMuiFix.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load doctor details.",
        });
      }
    };

    loadDoctorDetails();
  }, [selectedDoctorId, setValue]);

  const doctorHospitals = doctorDetails?.hospitals || [];
  const doctorCenters = doctorDetails?.centers || [];

  /* ================= Submit Handler ================= */

  const submitHandler = async (data) => {
    const confirm = await swalWithMuiFix.fire({
      title: "Confirm Appointment?",
      text: "Do you want to schedule this appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Schedule",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (!confirm.isConfirmed) return;

    try {
      await onSubmit?.(data);

      // Non-blocking toast (better UX)
      swalWithMuiFix.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Appointment Scheduled Successfully",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      reset();
      setDoctorDetails(null);
      setOpen(false);

    } catch (error) {
      swalWithMuiFix.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to schedule appointment.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Patient Name */}
      <Controller
        name="name"
        control={control}
        rules={{ required: "Patient name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Patient Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />

      {/* Doctor */}
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
            margin="normal"
            error={!!errors.doctorId}
            helperText={errors.doctorId?.message}
          >
            {doctors.length === 0 ? (
              <MenuItem disabled>No doctors available</MenuItem>
            ) : (
              doctors.map((doc) => (
                <MenuItem key={doc.doctor_id} value={String(doc.doctor_id)}>
                  {doc.name}
                </MenuItem>
              ))
            )}
          </TextField>
        )}
      />

      {/* Hospital */}
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
            margin="normal"
            disabled={!doctorDetails}
            error={!!errors.hospitalId}
            helperText={errors.hospitalId?.message}
          >
            {doctorHospitals.length === 0 ? (
              <MenuItem disabled>No hospitals available</MenuItem>
            ) : (
              doctorHospitals.map((hos, index) => (
                <MenuItem key={index} value={hos.id || hos.name}>
                  {hos.name}
                </MenuItem>
              ))
            )}
          </TextField>
        )}
      />

      {/* Center */}
      <Controller
        name="centerId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Select Center"
            fullWidth
            margin="normal"
            disabled={!doctorDetails}
          >
            {doctorCenters.length === 0 ? (
              <MenuItem disabled>No centers available</MenuItem>
            ) : (
              doctorCenters.map((center, index) => (
                <MenuItem key={index} value={center.id || center.name}>
                  {center.name}
                </MenuItem>
              ))
            )}
          </TextField>
        )}
      />

      {/* Date */}
      <Controller
        name="date"
        control={control}
        rules={{ required: "Date is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
          />
        )}
      />

      {/* Time Slot */}
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
            margin="normal"
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

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting || loading}
      >
        {isSubmitting || loading
          ? "Scheduling..."
          : "Schedule Appointment"}
      </Button>
    </form>
  );
}
