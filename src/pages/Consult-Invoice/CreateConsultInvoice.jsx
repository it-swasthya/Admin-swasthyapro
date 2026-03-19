import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { buildConsultInvoicePayload } from "../../utils/GenerateConsultInvoice";

const ConsultInvoiceForm = () => {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const debounceRef = useRef(null); // ✅ debounce control

  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_contact: "",

    doctor_name: "",
    doctor_fee: "",
    platform_fee: "",
    gst: "",
    total_amount: "",

    after_hours_fee: "",
    home_visit_fee: "",
    priority_fee: "",
    record_fee: "",
    extra_charges: "",

    payment_mode: "",
    payment_status: "",
  });

  /* ================= USER SEARCH (DEBOUNCED) ================= */

  const handleUserSearch = (value) => {
    if (!value || value.length < 2) {
      setUserOptions([]);
      return;
    }

    // 🧠 Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setUserLoading(true);

        const res = await axios.get(
          `https://api.swasthyapro.com/api/user/search/details?name=${value}`,
        );

        console.log("SEARCH RESPONSE 👉", res.data);

        // ✅ FIX: correct key is users
        setUserOptions(res.data?.users || []);
      } catch (err) {
        console.error("User search error", err);
        setUserOptions([]);
      } finally {
        setUserLoading(false);
      }
    }, 400); // ⏱ 400ms debounce
  };

  /* ================= SELECT USER ================= */

  const handleUserSelect = (event, value) => {
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      user_id: value.User_id || "",
      user_name: `${value.first_name || ""} ${value.last_name || ""}`,
      user_email: value.email || "",
      user_contact: value.contact || "",
    }));
  };

  /* ================= CALCULATION ================= */

  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    
    const doctorFee = Number(updated.doctor_fee) || 0;
    const platformFee = Number(updated.platform_fee) || 0;

    const addOnTotal =
      Number(updated.after_hours_fee || 0) +
      Number(updated.home_visit_fee || 0) +
      Number(updated.priority_fee || 0) +
      Number(updated.record_fee || 0) +
      Number(updated.extra_charges || 0);

    const subtotal = doctorFee + platformFee + addOnTotal;

    const gstAmount = Number(updated.gst) || 0;

    const total = subtotal + gstAmount;

    updated.total_amount = total.toFixed(2);

    setFormData(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const confirm = await Swal.fire({
      title: "Generate Invoice?",
      text: "Proceed with invoice generation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);

      if (!formData.user_id) {
        throw new Error("Please select a user");
      }

      if (!formData.user_email?.includes("@")) {
        throw new Error("Valid email required");
      }

      const payload = buildConsultInvoicePayload(formData);

      const response = await axios.post(
        "https://api.swasthyapro.com/api/invoice/gen-invoice/consultation",
        payload,
      );

      const invoiceId = response?.data?.invoiceId;

      if (!invoiceId) throw new Error("Invoice not generated");

      await axios.post("https://api.swasthyapro.com/api/invoice/send-invoice", {
        invoice_no: invoiceId,
        email: formData.user_email,
        customer_name: formData.user_name,
      });

      Swal.fire("Success", "Invoice generated & sent", "success");

      // ✅ reset form
      setFormData({
        user_id: "",
        user_name: "",
        user_email: "",
        user_contact: "",
        doctor_name: "",
        doctor_fee: "",
        platform_fee: "",
        gst: "",
        total_amount: "",
        after_hours_fee: "",
        home_visit_fee: "",
        priority_fee: "",
        record_fee: "",
        extra_charges: "",
        payment_mode: "",
        payment_status: "",
      });
    } catch (err) {
      console.error(err);

      Swal.fire("Error", err?.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Box maxWidth={600} mx="auto" p={3} bgcolor="#fff" borderRadius={2}>
      <Typography variant="h6" mb={2}>
        Generate Consultation Invoice
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {/* 🔍 SEARCH USER */}
        <Autocomplete
          options={userOptions}
          loading={userLoading}
          filterOptions={(x) => x}
          getOptionLabel={(option) => {
            const name =
              `${option.first_name || ""} ${option.last_name || ""}`.trim();
            return name ;
          }}
          isOptionEqualToValue={(option, value) =>
            option.User_id === value.User_id
          }
          onInputChange={(e, value) => handleUserSearch(value)}
          onChange={handleUserSelect}
          noOptionsText={userLoading ? "Searching..." : "No users found"}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search User (min 2 chars)"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {userLoading && <CircularProgress size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* USER INFO */}
        <TextField label="User ID" value={formData.user_id} disabled />
        <TextField label="Name" value={formData.user_name} disabled />
        <TextField label="Email" value={formData.user_email} disabled />
        <TextField label="Mobile" value={formData.user_contact} disabled />

         <TextField
          label="Doctor Name"
          name="doctor_name"
          type="text"
          value={formData.doctor_name}
          onChange={handleChange}
        />

        {/* FEES */}
        <TextField
          label="Doctor Fee"
          name="doctor_fee"
          type="number"
          value={formData.doctor_fee}
          onChange={handleChange}
        />
        <TextField
          label="Platform Fee"
          name="platform_fee"
          type="number"
          value={formData.platform_fee}
          onChange={handleChange}
        />
        <TextField
          label="GST Amount"
          name="gst"
          type="number"
          value={formData.gst}
          onChange={handleChange}
        />

        {/* ADDONS */}
        <Typography variant="subtitle1">Add-On Charges</Typography>

        <TextField
          label="After Hours Fee"
          name="after_hours_fee"
          type="number"
          value={formData.after_hours_fee}
          onChange={handleChange}
        />
        <TextField
          label="Home Visit Fee"
          name="home_visit_fee"
          type="number"
          value={formData.home_visit_fee}
          onChange={handleChange}
        />
        <TextField
          label="Priority Fee"
          name="priority_fee"
          type="number"
          value={formData.priority_fee}
          onChange={handleChange}
        />
        <TextField
          label="Record Fee"
          name="record_fee"
          type="number"
          value={formData.record_fee}
          onChange={handleChange}
        />
        <TextField
          label="Extra Charges"
          name="extra_charges"
          type="number"
          value={formData.extra_charges}
          onChange={handleChange}
        />

        {/* TOTAL */}
        <TextField
          label="Total Amount"
          value={formData.total_amount}
          disabled
        />

        {/* PAYMENT */}
        <TextField
          label="Payment Mode"
          name="payment_mode"
          value={formData.payment_mode}
          onChange={handleChange}
        />
        <TextField
          label="Payment Status"
          name="payment_status"
          value={formData.payment_status}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Generate & Send Invoice"}
        </Button>
      </Box>
    </Box>
  );
};

export default ConsultInvoiceForm;
