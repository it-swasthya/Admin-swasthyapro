// utils/orderTableColumns.js
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FileUp, Info, User } from "lucide-react";
import OrderStatusCell from "../OrderStatusCell";
export const getOrderTableColumns = ({
  onInfoClick,
  onEditPaymentClick,
  onReportShareClick,
  getOrders,
  showTests,
  onFamilyClick,
  handleUserReportUpload,
}) => [
  {
    accessorKey: "booking_id",
    header: "Order ID",
    size: 140,
  },
  {
    accessorKey: "displayName",
    header: "Name",
    size: 200,
    Cell: ({ row }) => <>{row.original.displayName}</>,
  },
  {
    header: "User Family",
    Cell: ({ row }) => (
      <>
        <Tooltip title="User Family">
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            onClick={() => onFamilyClick(row.original.assigned_members)}
          >
            <User size={20} />
          </IconButton>
        </Tooltip>
      </>
    ),
  },

  {
    header: "Info",
    id: "info",
    size: 80,
    Cell: ({ row }) => (
      <Tooltip title="User Info">
        <IconButton onClick={() => onInfoClick(row.original)}>
          <Info size={18} />
        </IconButton>
      </Tooltip>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Amount",
    Cell: ({ cell }) => `₹${cell.getValue()}`,
  },
  // {
  //   accessorKey: "amount_paid",
  //   header: "Amount Paid",
  //   Cell: ({ cell }) => `₹${cell.getValue()}`,
  // },
   {
    accessorKey: "amount_paid",
    header: "Amount Paid",
    Cell: ({ row }) => `₹${row.original.paymentStatus.toLowerCase() === "successful" ? row.original.Payment.amount : 0}`,
  },
  {
    accessorKey: "coupon",
    header: "Coupon",
  },
  {
    accessorKey: "bookDate",
    header: "Book Date",
  },
  {
    accessorKey: "displayDate",
    header: "Scheduled Date",
  },
  {
    accessorKey: "timeslot",
    header: "Time Slot",
  },
  {
    accessorKey: "testNamesArray",
    header: "Test(s)",
    Cell: ({ row }) => {
      return (
        <>
          <Button onClick={() => showTests(row.original.testNamesArray)}>
            {row.original.testNamesArray.length}{" "}
            {row.original.testNamesArray.length > 0 && "▼"}
          </Button>
        </>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    Cell: ({ row }) => {
      const method = row.original.paymentMethod;
      const pending = row.original.paymentStatus.toLowerCase() === "pending";
      return (
        <>
          {method}
          {method?.toLowerCase() === "cash" && pending && (
            <Tooltip title="Edit method">
              <IconButton
                size="small"
                onClick={() => onEditPaymentClick(row.original)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    Cell: ({ cell }) => {
      const status = cell.getValue()?.toLowerCase();
      let color = "default";
      if (status === "successful") color = "success";
      else if (status === "pending") color = "warning";
      else if (status === "failed") color = "error";
      else if (status === "refunded") color = "info";
      return <Chip label={status} color={color} size="small" />;
    },
  },

  {
    header: "Status",
    id: "status",

    Cell: ({ row }) => (
      <OrderStatusCell order={row.original} getOrders={getOrders} />
    ),
  },

  {
    header: "Upload Report",
    Cell: ({ row }) =>
      row.original.report_shared ? (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: "#e6f4ea",
            color: "#2e7d32",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "10px",
            minWidth: 60,
            textAlign: "center",
            border: `1px solid #a5d6a7`,
          }}
        >
          Report Shared
        </Box>
      ) : row.original.sample_collected &&
        row.original.sample_received_by_lab &&
        row.original.dml_assigned ? (
        <>
          <Tooltip title="Upload report">
            <IconButton
              size="small"
              sx={{ ml: 1 }}
              onClick={() => handleUserReportUpload(row.original)}
            >
              <FileUp size={20} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <IconButton size="small" sx={{ ml: 1 }} disabled>
          <FileUp size={20} />
        </IconButton>
      ),
  },
  {
    header: "Report Shared",
    id: "report_share",
    Cell: ({ row }) => (
      <Checkbox
        variant="outlined"
        size="small"
        disabled={
          (!row.original.dml_assigned &&
            !row.original.sample_collected &&
            !row.original.sample_received_by_lab) ||
          row.original.report_shared
        }
        checked={row.original.report_shared}
        onChange={() => onReportShareClick(row.original)}
      >
        {row.original.report_shared ? "Shared" : "Mark Shared"}
      </Checkbox>
    ),
  },
  {
    accessorKey: "dmlName",
    header: "DML-Name",
  },
  {
    accessorKey: "dmlEmail",
    header: "DML-Email(s)",
  },
  {
    accessorKey: "emailBody",
    header: "Email Body",
  },
  {
    accessorKey: "reschedule",
    header: "Reschedule Date",
  },
];
