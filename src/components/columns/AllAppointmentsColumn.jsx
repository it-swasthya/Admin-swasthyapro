import { Button, Chip,  Modal, Box, Typography, } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { SendIcon } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { buildConsultInvoicePayload, SendConsultInvoicePayload } from "../../utils/GenerateConsultInvoice";
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




{
  accessorKey: "send_invoice",
  header: "Send Invoice",
  size: 140,

  Cell: ({ row }) => {
    const [loading, setLoading] = useState(false);

    const handleGenerateInvoice = async () => {
      try {
        setLoading(true);

        const payload = buildConsultInvoicePayload(row.original);

        /* ---------- GENERATE ---------- */
        const response = await axios.post(
          "https://api.swasthyapro.com/api/invoice/gen-invoice/consultation",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Invoice generation failed");
        }

        /* ---------- SEND ---------- */
        const invoicePayload = SendConsultInvoicePayload(row.original);

        const sendRes = await axios.post(
          "https://api.swasthyapro.com/api/invoice/send-invoice",
          invoicePayload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (sendRes.status === 200 || sendRes.status === 201) {
          Swal.fire("Success", "Invoice Generated & Sent", "success");
        } else {
          Swal.fire("Warning", "Sending failed", "warning");
        }

      } catch (err) {
        Swal.fire(
          "Error",
          err?.response?.data?.message || "Invoice process failed",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <Tooltip title="Generate & Send Invoice">
        <span>
          <IconButton
            size="small"
            onClick={handleGenerateInvoice}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} thickness={5} />
            ) : (
              <SendIcon fontSize="small" color="blue" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  },
}


];
