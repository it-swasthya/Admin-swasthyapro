import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Box,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";

const AddCouponForm = () => {
  const [formData, setFormData] = useState({
    coupon_name: "",
    discount_percentage: "",
    discount_rupee: "",
    amount_range_from: "",
    amount_range_to: "",
    active: true,
    valid_from: "",
    valid_to: "",
    category: "",
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Add Coupon"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      coupon_name,
      discount_percentage,
      discount_rupee,
      amount_range_from,
      amount_range_to,
      valid_from,
      valid_to,
      category,
    } = formData;

    if (
      !coupon_name ||
      !discount_percentage ||
      !discount_rupee ||
      !amount_range_from ||
      !amount_range_to ||
      !valid_from ||
      !valid_to ||
      !category
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://api.swasthyapro.com/api/coupons/add-coupon",
        formData
      );
      Swal.fire({
        icon: "success",
        title: "Coupon Added",
        text: response.data?.message || "Coupon created successfully!",
      });

      setFormData({
        coupon_name: "",
        discount_percentage: "",
        discount_rupee: "",
        amount_range_from: "",
        amount_range_to: "",
        active: true,
        valid_from: "",
        valid_to: "",
        category: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Adding Coupon",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          padding: 4,
          background: "#f9f9f9",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Add New Coupon
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Coupon Name"
                name="coupon_name"
                value={formData.coupon_name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (%)"
                name="discount_percentage"
                type="number"
                value={formData.discount_percentage}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (₹)"
                name="discount_rupee"
                type="number"
                value={formData.discount_rupee}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount Range From (₹)"
                name="amount_range_from"
                type="number"
                value={formData.amount_range_from}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount Range To (₹)"
                name="amount_range_to"
                type="number"
                value={formData.amount_range_to}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valid From"
                name="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Valid To"
                name="valid_to"
                type="datetime-local"
                value={formData.valid_to}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #4b6cb7, #182848)",
                  color: "white",
                  fontWeight: "bold",
                  paddingY: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    background: "linear-gradient(90deg, #3556a2, #101b3d)",
                  },
                }}
              >
                Submit Coupon
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCouponForm;
