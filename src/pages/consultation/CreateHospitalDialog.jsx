import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Typography,
  Box,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2";
import { addHospital } from "../../components/doctorandHospital";

/* ================= SweetAlert Z-Index Fix (Clean Way) ================= */

const swalWithMuiFix = Swal.mixin({
  backdrop: true,
  allowOutsideClick: false,
  didOpen: (popup) => {
    if (popup?.parentElement) {
      popup.parentElement.style.zIndex = 2000; // Above MUI Dialog (1300)
    }
  },
});

export default function CreateHospitalDialog({ open, handleClose }) {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      registrationNumber: "",
      type: "",
      contactNumber: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      centers: [{ name: "" }],
    },
  });

  /* ================= Centers Dynamic ================= */

  const {
    fields: centerFields,
    append: appendCenter,
    remove: removeCenter,
  } = useFieldArray({
    control,
    name: "centers",
  });

  /* ================= Submit ================= */

  const onSubmit = async (data) => {
    //  Confirmation Alert
    const result = await swalWithMuiFix.fire({
      title: "Are you sure?",
      text: "Do you want to register this hospital?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Register",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const payloadData = {
        name: data.name.trim(),
        registrationNumber: data.registrationNumber.trim(),
        type: data.type,
        contactNumber: data.contactNumber.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        pincode: data.pincode.trim(),
        centers: data.centers
          ?.filter((c) => c.name && c.name.trim() !== "")
          .map((c) => ({
            name: c.name.trim(),
          })),
      };

      await addHospital(payloadData);

      // ✅ Close dialog smoothly
      handleClose();
      reset();

      // ✅ Success Toast (Non-blocking)
      setTimeout(() => {
        swalWithMuiFix.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Hospital Registered Successfully",
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
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Hospital Registration
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Hospital Name */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Hospital name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Hospital Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Registration Number */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="registrationNumber"
              control={control}
              rules={{ required: "Registration number is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Hospital Registration Number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Type */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Hospital type is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Hospital Type"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="GOVT">Government</MenuItem>
                  <MenuItem value="PRIVATE">Private</MenuItem>
                  <MenuItem value="TRUST">Trust</MenuItem>
                </TextField>
              )}
            />
          </Box>

          {/* Contact */}
          <Box sx={{ mb: 2 }}>
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
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Contact Number"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Email */}
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
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Address */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Address"
                  multiline
                  rows={2}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* City */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* State */}
          <Box sx={{ mb: 2 }}>
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Pincode */}
          <Box sx={{ mb: 3 }}>
            <Controller
              name="pincode"
              control={control}
              rules={{
                required: "Pincode is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter valid 6 digit pincode",
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Pincode"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>

          {/* Centers */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Hospital Centers / Branches
          </Typography>

          {centerFields.map((item, index) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              <Controller
                name={`centers.${index}.name`}
                control={control}
                rules={{ required: "Center name is required" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={`Center ${index + 1}`}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              {centerFields.length > 1 && (
                <IconButton
                  onClick={() => removeCenter(index)}
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
            onClick={() => appendCenter({ name: "" })}
            sx={{ mb: 2 }}
          >
            Add Center
          </Button>

          {/* Actions */}
          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button onClick={handleClose} color="inherit" disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={18} /> : null
              }
            >
              {loading ? "Submitting..." : "Register Hospital"}
            </Button>
          </DialogActions>

        </form>
      </DialogContent>
    </Dialog>
  );
}
