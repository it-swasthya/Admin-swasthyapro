import { useEffect, useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import {
  fetchDoctorById,
  fetchDoctors,
} from "../../components/doctorandHospital";
import Swal from "sweetalert2";

/* ================= SweetAlert Fix ================= */
const swalWithMuiFix = Swal.mixin({
  backdrop: true,
  didOpen: (popup) => {
    popup.parentElement.style.zIndex = 2000;
  },
});

export default function AppointmentForm({
  open,
  setOpen,
  selectedUser,
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
      date: "",
      timeSlot: "",
      speciality: "",
      symptoms: "",
      description: "",
      mode: "Online",
    },
  });

  const selectedDoctorId = useWatch({
    control,
    name: "doctorId",
  });

  /* ================= Reset ================= */
  const handleFullReset = () => {
    reset({
      name: "",
      doctorId: "",
      hospitalId: "",
      date: "",
      timeSlot: "",
      speciality: "",
      symptoms: "",
      description: "",
      mode: "Online",
    });
    setDoctorDetails(null);
  };

  useEffect(() => {
    if (!open) handleFullReset();
  }, [open]);

  /* ================= Load Doctors ================= */
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await fetchDoctors();
        setDoctors(data || []);
      } catch {
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
          setValue("speciality", data?.speciality || "");
        }
      } catch {
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

  /* ================= Submit ================= */
  const submitHandler = async (data) => {
    const confirm = await swalWithMuiFix.fire({
      title: "Confirm Appointment?",
      text: "Do you want to schedule this appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Schedule",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      swalWithMuiFix.fire({
        title: "Scheduling...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const userId = selectedUser?.user_id || "USER_3032601333";

      // ✅ Get doctor name (IMPORTANT FIX)
      const selectedDoctor = doctors.find(
        (doc) => String(doc.doctor_id) === String(data.doctorId)
      );

      const payload = {
        doctor_allotted: selectedDoctor?.name || "", // 🔥 FIXED
        appointment_date: data.date,
        time_slot: data.timeSlot,
        speciality: data.speciality,
        symptoms: data.symptoms,
        description: data.description,
        mode: data.mode, // Online / Physical
      };

      console.log("PAYLOAD:", payload);

      const res = await axios.post(
        `https://api.swasthyapro.com/api/appointment/admin/consult/create-appointment/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("RESPONSE:", res.data);

      Swal.close();

      swalWithMuiFix.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Appointment Scheduled Successfully",
        showConfirmButton: false,
        timer: 2500,
      });

      handleFullReset();
      setOpen(false);

    } catch (error) {
      console.error("ERROR:", error);

      Swal.close();

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
          <TextField {...field} select label="Time Slot" fullWidth margin="normal">
            <MenuItem value="09:00 AM">09:00 AM</MenuItem>
            <MenuItem value="10:00 AM">10:00 AM</MenuItem>
            <MenuItem value="11:00 AM">11:00 AM</MenuItem>
            <MenuItem value="02:00 PM">02:00 PM</MenuItem>
            <MenuItem value="04:00 PM">04:00 PM</MenuItem>
          </TextField>
        )}
      />

      {/* Speciality */}
      <Controller
        name="speciality"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Speciality" fullWidth margin="normal" />
        )}
      />

      {/* Symptoms */}
      <Controller
        name="symptoms"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Symptoms" fullWidth margin="normal" />
        )}
      />

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Description" fullWidth margin="normal" multiline rows={3} />
        )}
      />

      {/* Mode */}
      <Controller
        name="mode"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Mode" fullWidth margin="normal">
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Physical">Physical</MenuItem> {/* ✅ UPDATED */}
          </TextField>
        )}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
      </Button>
    </form>
  );
}