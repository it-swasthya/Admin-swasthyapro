import { Button, Chip } from "@mui/material";

export const getConsultationTableColumns = (
) => [
  {
    accessorKey: "appointment_id",
    header: "Appointment ID",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 160,
  },
    {
    accessorKey: "user_id",
    header: "User ID",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 180,
  },

  {
    accessorKey: "user_name",
    header: "Patient Name",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 180,
  },

  {
    accessorKey: "doctor_allotted",
    header: "Doctor",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 180,
  },

  {
    accessorKey: "speciality",
    header: "Speciality",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 160,
  },

  {
    accessorKey: "symptoms",
    header: "Symptoms",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 160,
  },

  {
    accessorKey: "appointment_date",
    header: "Date",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
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
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 120,
  },

  {
    accessorKey: "remaining_consult",
    header: "Remaining",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
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
      cell.getValue()
        ? new Date(cell.getValue()).toLocaleString()
        : "N/A",
    size: 180,
  },

 
];
