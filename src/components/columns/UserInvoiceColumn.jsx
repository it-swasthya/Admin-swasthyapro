// utils/invoiceTableColumns.js

export const getInvoiceTableColumns = () => [
  {
    accessorKey: "id",
    header: "Invoice ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
{
  accessorKey: "booking_id",
  header: "Booking ID",
  Cell: ({ row }) =>
    row.original.booking_id ||
    row.original.radiology_booking_id ||
    "N/A",
  size: 150,
},
  {
    accessorKey: "payment_id",
    header: "Payment ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "invoice_type",
    header: "Invoice Type",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 130,
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "N/A",
    size: 180,
  },
  {
    accessorKey: "billing_name",
    header: "Billing Name",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 160,
  },
  {
    accessorKey: "billing_phone",
    header: "Billing Phone",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 140,
  },
  {
    accessorKey: "billing_address",
    header: "Billing Address",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 200,
  },
  {
    accessorKey: "state",
    header: "State",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 120,
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    Cell: ({ cell }) =>
      cell.getValue() !== null && cell.getValue() !== undefined
        ? `₹${cell.getValue()}`
        : "N/A",
    size: 120,
  },
];
