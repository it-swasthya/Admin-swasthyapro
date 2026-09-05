import { useEffect, useState } from "react";
import { TextField, MenuItem, Button, Autocomplete } from "@mui/material";
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

export default function AppointmentForm({ open, setOpen, selectedUser }) {
  const [doctors, setDoctors] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [patients, setPatients] = useState([]);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      user_id: "",
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
      user_id: selectedUser?.User_id ? String(selectedUser.User_id) : "",
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
    if (!open) {
      handleFullReset();
    } else if (selectedUser?.User_id) {
      // Pre-fill patient when a specific user is passed in
      setValue("user_id", String(selectedUser.User_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedUser]);

  /* ================= Load Patients ================= */
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await axios.get(
          "https://api.swasthyapro.com/api/user/get-user",
        );
        setPatients(res.data.users || []);
        console.log(patients, "users");
      } catch {
        swalWithMuiFix.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load patients.",
        });
      }
    };
    loadPatients();
  }, []);

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
      Swal.fire({
        title: "Scheduling...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Use the PATIENT selected in the form, not the logged-in admin.
      const userId = data.user_id;

      if (!userId) {
        throw new Error("Patient not selected.");
      }

      const selectedDoctor = doctors.find(
        (doc) => String(doc.doctor_id) === String(data.doctorId),
      );

      const payload = {
        doctor_allotted: selectedDoctor?.doctor_name || "",
        appointment_date: data.date,
        time_slot: data.timeSlot,
        speciality: data.speciality,
        symptoms: data.symptoms,
        description: data.description,
        mode: data.mode,
      };

      await axios.post(
        `https://api.swasthyapro.com/api/appointment/admin/consult/create-appointment/${userId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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
      Swal.close();

      console.error(error);

      swalWithMuiFix.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Failed to schedule appointment.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      {/* Patient Name */}
      <Controller
        name="user_id"
        control={control}
        rules={{ required: "Patient is required" }}
        render={({ field }) => (
          <Autocomplete
            options={patients}
            value={
              patients.find(
                (patient) => String(patient.User_id) === String(field.value),
              ) || null
            }
            onChange={(_, value) => {
              field.onChange(value ? String(value.User_id) : "");
            }}
            getOptionLabel={(option) =>
              `${option.first_name || ""} ${option.last_name || ""}`.trim()
            }
            isOptionEqualToValue={(option, value) =>
              option.User_id === value.User_id
            }
            renderOption={(props, option) => (
              <li {...props} key={option.User_id}>
                <div style={{ width: "100%" }}>
                  <div style={{ fontWeight: 600 }}>
                    {option.first_name} {option.last_name}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    📧 {option.email || "N/A"}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    📱 {option.contact ||  "N/A"}
                  </div>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Patient"
                placeholder="Search by name, email or mobile"
                margin="normal"
                fullWidth
                error={!!errors.user_id}
                helperText={errors.user_id?.message}
              />
            )}
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
                  {doc.doctor_name}
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
              doctorHospitals.map((hos) => (
                <MenuItem key={hos.hospital_id} value={String(hos.hospital_id)}>
                  {hos.hospital_name}
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
          <TextField
            {...field}
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        )}
      />

      {/* Mode */}
      <Controller
        name="mode"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Mode" fullWidth margin="normal">
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Physical">Physical</MenuItem>
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
