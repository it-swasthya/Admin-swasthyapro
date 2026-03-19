import { Button, Chip, Modal, Box, Typography, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { SendIcon } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import {
  buildConsultInvoicePayload,
  SendConsultInvoicePayload,
} from "../../utils/GenerateConsultInvoice";
import axios from "axios";

export const getConsultationTableColumns = () => [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 160,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 180,
  },

  {
    accessorKey: "user_name",
    header: "Patient Name",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 180,
  },

  {
    accessorKey: "doctor_allotted",
    header: "Doctor",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 180,
  },

  {
    accessorKey: "speciality",
    header: "Speciality",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 160,
  },

  {
    accessorKey: "symptoms",
    header: "Symptoms",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 160,
  },

  {
    accessorKey: "appointment_date",
    header: "Date",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 130,
  },

  {
    accessorKey: "time_slot",
    header: "Time Slot",
    Cell: ({ cell }) => (
      <Chip
        label={cell.getValue() || "N/A"}
        size="small"
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: 600,
        }}
      />
    ),
    size: 140,
  },

  {
    accessorKey: "plan_id",
    header: "Plan",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 120,
  },
  {
    accessorKey: "booking_mode",
    header: "Booking Mode",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 120,
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 120,
  },

  {
    accessorKey: "prescription_link",
    header: "Prescription",
    Cell: ({ cell }) => {
      const link = cell.getValue();

      return link ? (
        <Tooltip title="View Prescription">
          <IconButton size="small" onClick={() => window.open(link, "_blank")}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <span style={{ fontWeight: 600 }}>N/A</span>
      );
    },
    size: 120,
  },

  {
    accessorKey: "doctor_advice",
    header: "Doctor Advice",
    Cell: ({ cell }) => {
      const advice = cell.getValue();
      const [open, setOpen] = useState(false);

      if (!advice) {
        return <span style={{ fontWeight: 600 }}>N/A</span>;
      }

      return (
        <>
          <Tooltip title="View Doctor Advice">
            <IconButton size="small" onClick={() => setOpen(true)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" mb={2}>
                Doctor Advice
              </Typography>

              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {advice}
              </Typography>
            </Box>
          </Modal>
        </>
      );
    },
    size: 120,
  },

  {
    accessorKey: "remaining_consult",
    header: "Remaining",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>{cell.getValue() || "N/A"}</span>
    ),
    size: 120,
  },

  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }) => {
      const value = cell.getValue();

      const color =
        value === "Completed"
          ? "#2e7d32"
          : value === "Cancelled"
            ? "#d32f2f"
            : "#ed6c02";

      return (
        <Chip
          label={value}
          size="small"
          sx={{ fontWeight: 600, color: "#ffffff", backgroundColor: color }}
        />
      );
    },
    size: 120,
  },

  {
    accessorKey: "createdAt",
    header: "Created On",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "N/A",
    size: 180,
  },

  // {
  //   accessorKey: "send_invoice",
  //   header: "Send Invoice",
  //   size: 140,

  //   Cell: ({ row }) => {
  //     const [loading, setLoading] = useState(false);

  //     const handleGenerateInvoice = async () => {
  //       try {
  //         setLoading(true);

  //         const payload = buildConsultInvoicePayload(row.original);

  //         /* ---------- GENERATE ---------- */
  //         const response = await axios.post(
  //           "https://api.swasthyapro.com/api/invoice/gen-invoice/consultation",
  //           payload,
  //           { headers: { "Content-Type": "application/json" } }
  //         );

  //         if (response.status !== 200 && response.status !== 201) {
  //           throw new Error("Invoice generation failed");
  //         }

  //         /* ---------- SEND ---------- */
  //         const invoicePayload = SendConsultInvoicePayload(row.original);

  //         const sendRes = await axios.post(
  //           "https://api.swasthyapro.com/api/invoice/send-invoice",
  //           invoicePayload,
  //           { headers: { "Content-Type": "application/json" } }
  //         );

  //         if (sendRes.status === 200 || sendRes.status === 201) {
  //           Swal.fire("Success", "Invoice Generated & Sent", "success");
  //         } else {
  //           Swal.fire("Warning", "Sending failed", "warning");
  //         }

  //       } catch (err) {
  //         Swal.fire(
  //           "Error",
  //           err?.response?.data?.message || "Invoice process failed",
  //           "error"
  //         );
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     return (
  //       <Tooltip title="Generate & Send Invoice">
  //         <span>
  //           <IconButton
  //             size="small"
  //             onClick={handleGenerateInvoice}
  //             disabled={loading}
  //           >
  //             {loading ? (
  //               <CircularProgress size={20} thickness={5} />
  //             ) : (
  //               <SendIcon fontSize="small" color="blue" />
  //             )}
  //           </IconButton>
  //         </span>
  //       </Tooltip>
  //     );
  //   },
  // }

 {
  accessorKey: "send_invoice",
  header: "Send Invoice",
  size: 160,

  Cell: ({ row }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
      user_name: row.original.user_name || "",
      user_email: row.original.user_email || "",
      user_contact: row.original.user_contact || "",
      user_age: row.original.user_age || "",
      user_gender: row.original.user_gender || "",

      doctor_name: row.original.doctor_allotted || "",
      doctor_speciality: row.original.speciality || "",
      doctor_qualification: "",
      doctor_registraton: "",

      doctor_fee: "",
      platform_fee: "",
      gst: "",
      total_amount: "",

      // ADD-ONS
      after_hours_fee: "",
      home_visit_fee: "",
      priority_fee: "",
      record_fee: "",
      extra_charges: "",

      payment_mode: "",
      payment_status: "",
    });

    const handleChange = (e) => {
      const updated = { ...formData, [e.target.name]: e.target.value };

      const doctorFee = parseFloat(updated.doctor_fee) || 0;
      const platformFee = parseFloat(updated.platform_fee) || 0;

      const addOnTotal =
        (parseFloat(updated.after_hours_fee) || 0) +
        (parseFloat(updated.home_visit_fee) || 0) +
        (parseFloat(updated.priority_fee) || 0) +
        (parseFloat(updated.record_fee) || 0) +
        (parseFloat(updated.extra_charges) || 0);

      const subtotal = doctorFee + platformFee + addOnTotal;

      // GST as direct input
      const gstAmount = parseFloat(updated.gst) || 0;

      // FINAL TOTAL (safe)
      const total = Math.max(0, subtotal + gstAmount);

      updated.total_amount = total.toFixed(2);

      setFormData(updated);
    };

    const handleSubmit = async () => {
      const confirm = await Swal.fire({
        title: "Send Invoice?",
        text: "Are you sure you want to generate & send invoice?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Send",
        customClass: { container: "swal-high-zindex" },
      });

      if (!confirm.isConfirmed) return;

      try {
        setLoading(true);

        // ✅ VALIDATION
        if (!formData.user_email || !formData.user_email.includes("@")) {
          throw new Error("Valid email is required");
        }

        // ✅ STEP 1: BUILD PAYLOAD (NO invoiceNumber)
        const payload = buildConsultInvoicePayload({
          ...row.original,
          ...formData,
        });

        console.log("GENERATE PAYLOAD 👉", payload);

        // ✅ STEP 2: GENERATE INVOICE
        const response = await axios.post(
          "https://api.swasthyapro.com/api/invoice/gen-invoice/consultation",
          payload
        );

        console.log("INVOICE RESPONSE 👉", response?.data);

        const invoiceId = response?.data?.invoiceId;

        if (!invoiceId) {
          throw new Error("Invoice ID not received from backend");
        }

        // ✅ STEP 3: SEND EMAIL
        const sendPayload = {
          invoice_no: invoiceId,
          email: formData.user_email,
          customer_name: formData.user_name,
        };

        console.log("SEND PAYLOAD 👉", sendPayload);

        const sendRes = await axios.post(
          "https://api.swasthyapro.com/api/invoice/send-invoice",
          sendPayload
        );

        console.log("SEND RESPONSE 👉", sendRes.data);

        if ([200, 201].includes(sendRes.status)) {
          Swal.fire({
            title: "Success",
            text: "Invoice Generated & Sent",
            icon: "success",
            customClass: { container: "swal-high-zindex" },
          });
          setOpen(false);
        } else {
          throw new Error("Send API failed");
        }
      } catch (err) {
        console.error("ERROR 👉", err);

        Swal.fire({
          title: "Error",
          text:
            err?.response?.data?.error ||
            err.message ||
            "Invoice process failed",
          icon: "error",
          customClass: { container: "swal-high-zindex" },
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <Tooltip title="Generate & Send Invoice">
          <IconButton size="small" onClick={() => setOpen(true)}>
            <SendIcon fontSize="small" color="blue" />
          </IconButton>
        </Tooltip>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "#fff",
              boxShadow: 24,
              p: 3,
              borderRadius: 2,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h6" mb={2}>
              Fill Invoice Details
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {/* BASIC */}
              <TextField label="Patient Name" name="user_name" value={formData.user_name} onChange={handleChange} fullWidth />
              <TextField label="Email" name="user_email" value={formData.user_email} onChange={handleChange} fullWidth />
              <TextField label="Mobile Number" name="user_contact" value={formData.user_contact} onChange={handleChange} fullWidth />

              {/* DOCTOR */}
              <TextField label="Doctor Name" name="doctor_name" value={formData.doctor_name} onChange={handleChange} fullWidth />

              {/* FEES */}
              <TextField label="Doctor Fee" name="doctor_fee" type="number" value={formData.doctor_fee} onChange={handleChange} fullWidth />
              <TextField label="Platform Fee" name="platform_fee" type="number" value={formData.platform_fee} onChange={handleChange} fullWidth />
              <TextField label="GST Amount" name="gst" type="number" value={formData.gst} onChange={handleChange} fullWidth />

              {/* ADD-ONS */}
              <Typography variant="subtitle1" mt={2}>
                Add-On Charges (Optional)
              </Typography>

              <TextField label="After Hours Consultation" name="after_hours_fee" type="number" value={formData.after_hours_fee} onChange={handleChange} fullWidth />
              <TextField label="Home Visit Facilitation" name="home_visit_fee" type="number" value={formData.home_visit_fee} onChange={handleChange} fullWidth />
              <TextField label="Priority Slot Booking" name="priority_fee" type="number" value={formData.priority_fee} onChange={handleChange} fullWidth />
              <TextField label="Medical Record Handling" name="record_fee" type="number" value={formData.record_fee} onChange={handleChange} fullWidth />
              <TextField label="Additional Charges" name="extra_charges" type="number" value={formData.extra_charges} onChange={handleChange} fullWidth />

              {/* TOTAL */}
              <TextField label="Total Amount" name="total_amount" value={formData.total_amount} fullWidth disabled />

              {/* PAYMENT */}
              <TextField label="Payment Mode" name="payment_mode" value={formData.payment_mode} onChange={handleChange} fullWidth />
              <TextField label="Payment Status" name="payment_status" value={formData.payment_status} onChange={handleChange} fullWidth />
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>

              <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : "Submit & Send"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  },
}
];
