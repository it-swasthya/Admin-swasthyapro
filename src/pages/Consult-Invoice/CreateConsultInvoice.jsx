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
  const [sending, setSending] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState(null);

  const debounceRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_contact: "",
    user_gender:"",

    doctor_name: "",
    doctor_registraton: "",
    booking_mode: "",

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

  /* ================= USER SEARCH ================= */

  const handleUserSearch = (value) => {
    if (!value || value.length < 2) {
      setUserOptions([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setUserLoading(true);

        const res = await axios.get(
          `https://api.swasthyapro.com/api/user/search/details?name=${value}`,
        );

        setUserOptions(res.data?.users || []);
      } catch (err) {
        console.error("User search error", err);
        setUserOptions([]);
      } finally {
        setUserLoading(false);
      }
    }, 400);
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
      user_gender: value.gender ?? "",
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

  /* ================= GENERATE ================= */

  const handleGenerate = async () => {
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

      if (!formData.user_id) throw new Error("Please select a user");
      if (!formData.user_email?.includes("@"))
        throw new Error("Valid email required");

      const payload = buildConsultInvoicePayload(formData);

      console.log(payload, " payload consult inovoice form");

      const response = await axios.post(
        "https://api.swasthyapro.com/api/invoice/gen-invoice/consultation",
        payload,
      );

      const invoiceId = response?.data?.invoiceId;
      if (!invoiceId) throw new Error("Invoice not generated");

      setGeneratedInvoiceId(invoiceId);

      Swal.fire("Success", "Invoice generated successfully", "success");

      setFormData({
        user_id: "",
        user_name: "",
        user_email: "",
        user_contact: "",
        user_gender:"",

        doctor_name: "",
        registration_number: "",
        booking_mode: "",

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

  /* ================= SEND ================= */

  const handleSend = async () => {
    try {
      setSending(true);

      await axios.post("https://api.swasthyapro.com/api/invoice/send-invoice", {
        invoice_no: generatedInvoiceId,
        email: formData.user_email,
        customer_name: formData.user_name,
      });

      Swal.fire("Success", "Invoice sent successfully", "success");
      setGeneratedInvoiceId(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send invoice", "error");
    } finally {
      setSending(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Box position="relative">
      {/* SEND BUTTON */}
      <Box sx={{ position: "absolute", top: 0, right: 0 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSend}
          disabled={!generatedInvoiceId || sending}
        >
          {sending ? <CircularProgress size={20} /> : "Send Invoice"}
        </Button>
      </Box>

      <Box maxWidth={600} mx="auto" p={3} bgcolor="#fff" borderRadius={2}>
        <Typography variant="h6" mb={2}>
          Generate Consultation Invoice
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* USER SEARCH */}
          <Autocomplete
            options={userOptions}
            loading={userLoading}
            filterOptions={(x) => x}
            getOptionLabel={(option) =>
              `${option.first_name || ""} ${option.last_name || ""}`.trim()
            }
            onInputChange={(e, value) => handleUserSearch(value)}
            onChange={handleUserSelect}
            renderInput={(params) => (
              <TextField {...params} label="Search User" />
            )}
          />

          {/* USER INFO */}
          <TextField label="User ID" value={formData.user_id} disabled />
          <TextField label="Name" value={formData.user_name} disabled />
          <TextField label="Email" value={formData.user_email} disabled />
          <TextField label="Mobile" value={formData.user_contact} disabled />
          <TextField label="Gender" value={formData.user_gender} disabled />


          {/* DOCTOR DETAILS */}
          <TextField
            label="Doctor Name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
          />

          <TextField
            label="Registration Number"
            name="doctor_registraton"
            value={formData.doctor_registraton}
            onChange={handleChange}
          />

          <TextField
            label="Mode of Consultation"
            name="booking_mode"
            value={formData.booking_mode}
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
            name="after_hours_fee"
            label="After Hours Fee"
            type="number"
            value={formData.after_hours_fee}
            onChange={handleChange}
          />
          <TextField
            name="home_visit_fee"
            label="Home Visit Fee"
            type="number"
            value={formData.home_visit_fee}
            onChange={handleChange}
          />
          <TextField
            name="priority_fee"
            label="Priority Fee"
            type="number"
            value={formData.priority_fee}
            onChange={handleChange}
          />
          <TextField
            name="record_fee"
            label="Record Fee"
            type="number"
            value={formData.record_fee}
            onChange={handleChange}
          />
          <TextField
            name="extra_charges"
            label="Extra Charges"
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
            name="payment_mode"
            label="Payment Mode"
            value={formData.payment_mode}
            onChange={handleChange}
          />
          <TextField
            name="payment_status"
            label="Payment Status"
            value={formData.payment_status}
            onChange={handleChange}
          />

          {/* GENERATE */}
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Generate Invoice"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsultInvoiceForm;
