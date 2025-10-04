import {
  Button,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

export const getInvoiceTableColumns = ({
  handleOpenItemsModal,
  handleOpenGstModal,
  handleDelete,
  changeINVstatus,
}) => [
  {
    accessorKey: "invoice_id",
    header: "Invoice ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 140,
  },
  {
    accessorKey: "invoice_date",
    header: "Invoice Date",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "N/A",
    size: 140,
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : "N/A",
    size: 140,
  },
  {
    accessorKey: "place_of_supply",
    header: "Place of Supply",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "bill_to_name",
    header: "Bill To",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "bill_to_address",
    header: "Address",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 200,
  },
  {
    accessorKey: "bill_to_gstin",
    header: "GSTIN",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 160,
  },
  {
    accessorKey: "employee_items",
    header: "Items",
    Cell: ({ row }) => (
      <Tooltip title="View Items" arrow>
        <IconButton
          size="small"
          onClick={() => handleOpenItemsModal(row.original.employee_items)}
        >
          <InfoOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
    ),
    size: 100,
  },
  {
    accessorKey: "gst",
    header: "GST Details",
    Cell: ({ row }) => (
      <Tooltip title="View GST" arrow>
        <IconButton size="small" onClick={() => handleOpenGstModal(row.original)}>
          <InfoOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
    ),
    size: 130,
  },
  {
    accessorKey: "subtotal",
    header: "Subtotal",
    Cell: ({ cell }) => (cell.getValue() ? `₹${cell.getValue()}` : "N/A"),
    size: 120,
  },
  {
    accessorKey: "total",
    header: "Total",
    Cell: ({ cell }) => (cell.getValue() ? `₹${cell.getValue()}` : "N/A"),
    size: 120,
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ row }) => {
      const status = row.original.status || "Pending";
      const isApproved = status === "approved";
      const isCancelled = status === "cancelled";

      return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: isApproved
                ? "green"
                : isCancelled
                ? "red"
                : "text.secondary",
              fontWeight: 600,
            }}
          >
            {status?.toUpperCase()}
          </Typography>
          { !isCancelled && (
            <>
             
              <Tooltip title="Cancel">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => changeINVstatus(row.original)}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
    size: 160,
  },
  {
    header: "Delete",
    Cell: ({ row }) => (
      <Tooltip title="Delete Invoice">
        <IconButton
          color="error"
          size="small"
          onClick={() => handleDelete(row.original)}
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    ),
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleString() : "N/A",
    size: 180,
  },
];
