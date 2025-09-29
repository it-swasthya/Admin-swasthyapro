import { Typography } from "@mui/material";

export const getPaymentTableColumns = (showTestsPopup) => [
  {
    accessorKey: "id",
    header: "Payment ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 140,
  },
  {
    accessorKey: "invoice_id",
    header: "Invoice ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 140,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "N/A",
    size: 180,
  },
  {
    accessorKey: "email",
    header: "Email",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 200,
  },
  {
    accessorKey: "name",
    header: "Name",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 180,
  },
  {
    accessorKey: "tests",
    header: "Tests Count",
    Cell: ({ cell, row }) => (
      <Typography
        variant="body2"
        sx={{ color: "blue", cursor: "pointer" }}
        onClick={() => showTestsPopup(row.original)}
      >
        <strong>Tests:</strong>{" "}
        {Array.isArray(cell.getValue()) ? cell.getValue().length : 0}{" "}
        {Array.isArray(cell.getValue()) && cell.getValue().length > 0 && "▼"}
      </Typography>
    ),
    size: 140,
  },
  {
    accessorKey: "packages",
    header: "Packages",
    Cell: ({ cell }) => {
      const packages = cell.getValue();
      return Array.isArray(packages) && packages.length > 0
        ? packages.map((p) => p.name).join(", ")
        : "N/A";
    },
    size: 220,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    Cell: ({ cell }) =>
      cell.getValue() !== undefined ? `₹${cell.getValue()}` : "N/A",
    size: 100,
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 130,
  },
];
