import { Button } from "@mui/material";

export const getHospitalAppointmentTableColumns = (onUpdateClick) => [
  {
    accessorKey: "name",
    header: "Full Name",
    Cell: ({ cell }) => cell.getValue() || "Guest",
    size: 180,
  },
  {
    accessorKey: "disease",
    header: "Disease",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "email",
    header: "Email",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 200,
  },
  {
    accessorKey: "city",
    header: "City",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 140,
  },
  {
    accessorKey: "insurance",
    header: "Insurance",
    Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
    size: 120,
  },
  {
    accessorKey: "adhar_file",
    header: "Adhar File",
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
    accessorKey: "pan_file",
    header: "PAN File",
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
    accessorKey: "insurance_file",
    header: "Insurance File",
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
    size: 180,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "N/A",
    size: 150,
  },

  //   {
  //     header: "Update Status",
  //     id: "update-status-action",
  //     Cell: ({ row }) => (
  //       <Button
  //         variant="outlined"
  //         size="small"
  //         onClick={() => onUpdateClick(row.original)}
  //         sx={{ fontSize: "0.7rem", py: 0, px: 1 }}
  //       >
  //         Update
  //       </Button>
  //     ),
  //     size: 130,
  //   },
];
