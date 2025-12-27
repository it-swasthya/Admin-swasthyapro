import { Button, IconButton, Tooltip, Chip } from "@mui/material";
import { Eye } from "lucide-react";
import RemarksPopup from "../../pages/crm/RemarksPopup";

export const getLeadTableColumns = () => [
  // {
  //   accessorKey: "lead_id",
  //   header: "Lead ID",
  //   Cell: ({ cell }) => (
  //     <span style={{ color: "#222427ff" }}>{cell.getValue() || "N/A"}</span>
  //   ),
  //   size: 180,
  // },
  {
    accessorKey: "user_id",
    header: "User ID",
    Cell: ({ cell }) => (
      <span style={{ color: "#555", fontFamily: "monospace" }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: "department",
    header: "Department",
    Cell: ({ cell }) => (
      <Chip
        label={cell.getValue() || "N/A"}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ fontWeight: 500 }}
      />
    ),
    size: 120,
  },
  {
    accessorKey: "cases",
    header: "Case Type",
    Cell: ({ cell }) => (
      <span style={{ color: "#050a0fff", fontWeight: 500 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }) => {
      const val = cell.getValue();
      const color =
        val === "Open" ? "#388e3c" : val === "Closed" ? "#d32f2f" : "#1976d2";
      return <span style={{ color, fontWeight: 600 }}>{val || "N/A"}</span>;
    },
    size: 120,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    Cell: ({ cell }) => {
      const val = cell.getValue();
      let color = "#1976d2"; // default blue
      if (val === "High") color = "#388e3c";
      else if (val === "Medium") color = "#fbc02d";
      else if (val === "Urgent") color = "#90561dff";
      else if (val === "Critical") color = "#d32f2f";

      return (
        <Chip
          label={val || "N/A"}
          size="small"
          sx={{
            fontWeight: 600,
            color: "#fff",
            backgroundColor: color,
          }}
        />
      );
    },
    size: 120,
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return Array.isArray(value)
        ? value.map((v, i) => (
            <Chip
              key={i}
              label={v}
              size="small"
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))
        : "N/A";
    },
    size: 180,
  },
  {
    accessorKey: "markedAs",
    header: "Seen",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600, color: "#f57c00" }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 100,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    Cell: ({ cell }) => <RemarksPopup remarks={cell.getValue()} />,
    size: 180,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    Cell: ({ cell }) =>
      cell.getValue()
        ? new Date(cell.getValue()).toLocaleString()
        : "N/A",
    size: 180,
  },
];
