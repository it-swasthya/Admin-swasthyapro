import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

export const getPrescriptionTableColumns = (onUpdateClick, onDetailsClick) => [
 {
  header: "User ID",
  accessorKey: "User_id",
},
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Details",
    accessorKey: "details",
    Cell: ({ row }) => (
      <IconButton
        onClick={() => onDetailsClick(row.original.details)}
        style={{ color: "#1976d2" }}
      >
        <VisibilityIcon />
      </IconButton>
    ),
  },
   {
    accessorKey: "prescription_link",
    header: "Prescription Link",
    Cell: ({ cell }) =>
      cell.getValue() !== "N/A" ? (
        <a
          href={cell.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          View
        </a>
      ) : (
        "N/A"
      ),
    size: 160,
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Seen",
    accessorKey: "seen",
        Cell: ({ cell }) => cell.getValue()? "Seen"  : "Not Seen",

  },
  {
    header: "Action",
    accessorKey: "id",
    Cell: ({ row }) => (
      <IconButton
        onClick={() => onUpdateClick(row.original)}
        style={{ color: "#1976d2" }}
      >
        <EditIcon />
      </IconButton>
    ),
  },
];