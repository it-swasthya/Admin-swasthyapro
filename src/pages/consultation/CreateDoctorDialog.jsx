import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { addDoctor } from "../../components/doctorandHospital";

/* ================= SweetAlert MUI Fix ================= */
const swalWithMuiFix = Swal.mixin({
  backdrop: true,
  didOpen: (popup) => {
    popup.parentElement.style.zIndex = 2000; // Above MUI Dialog (1300)
  },
});

export default function CreateDoctorDialog({ open, handleClose }) {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      specialty: "",
      registrationNumber: "",
      experience: "",
      email: "",
      contactNumber: "",
      hospitals: [{ name: "" }],
    },
  });

  const {
    fields: hospitalFields,
    append: appendHospital,
    remove: removeHospital,
  } = useFieldArray({
    control,
    name: "hospitals",
  });

  /* ================= Submit ================= */

  const onSubmit = async (data) => {
     console.log("onSubmit called", data);
    const result = await swalWithMuiFix.fire({
      title: "Are you sure?",
      text: "Do you want to register this doctor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Register",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const payload = {
        ...data,
        experience: Number(data.experience),
      };

       console.log(payload);

      await addDoctor(payload);

       console.log("API Success");

      handleClose();
      reset();

      setTimeout(() => {
        swalWithMuiFix.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Doctor Registered Successfully",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }, 300);

    } catch (error) {
      swalWithMuiFix.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Doctor Registration
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Doctor name is required" }}
              render={({ field }) => (
                <TextField {...field} label="Doctor Name" fullWidth />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="specialty"
              control={control}
              rules={{ required: "Specialty is required" }}
              render={({ field }) => (
                <TextField {...field} label="Specialty" fullWidth />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="registrationNumber"
              control={control}
              rules={{ required: "Registration number is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Medical Registration Number"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="experience"
              control={control}
              rules={{ required: "Experience is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Experience (Years)"
                  type="number"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Controller
              name="contactNumber"
              control={control}
              rules={{
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10 digit number",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contact Number"
                  type="tel"
                  fullWidth
                />
              )}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Associated Hospitals
          </Typography>

          {hospitalFields.map((item, index) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Controller
                name={`hospitals.${index}.name`}
                control={control}
                rules={{ required: "Hospital name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Hospital ${index + 1}`}
                    fullWidth
                  />
                )}
              />

              {hospitalFields.length > 1 && (
                <IconButton
                  onClick={() => removeHospital(index)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={() => appendHospital({ name: "" })}
            sx={{ mb: 2 }}
          >
            Add Hospital
          </Button>

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register Doctor"}
            </Button>
          </DialogActions>

        </form>
      </DialogContent>
    </Dialog>
  );
}
