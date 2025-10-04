import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import EditIcon from "@mui/icons-material/Edit";
import UpdateBookingStatusCell from "../user-radiology-bookings/bookinStatusCell/UpdateBookingStatus";
export const getRadiologyBookingColumn = ({
  handleEditPayment,
  getRadiologyBooking,
}) => {
  const TestInfoCell = ({ row }) => {
    const [open, setOpen] = useState(false);
    const tests = JSON.parse(row.original.testDetails) || [];
    return (
      <>
        <IconButton color="primary" size="small" onClick={() => setOpen(true)}>
          <InfoIcon fontSize="small" />
        </IconButton>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Test Details</DialogTitle>
          <DialogContent>
            <List>
              {tests.map((t, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={t.name}
                    secondary={`Price: ₹${t.price}`}
                  />
                  <ListItemText
                    primary={`Netprice: ₹${t.netprice}`}
                    // secondary={`Netprice: ₹${t.netprice}`}
                  />
                  <ListItemText
                    primary={`Discount: ₹${t.discount}`}
                    // secondary={`Discount: ₹${t.discount}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return [
    {
      accessorKey: "id",
      header: "Booking ID",
      size: 160,
    },
    {
      accessorKey: "user_id",
      header: "User ID",
      size: 160,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      size: 180,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      size: 140,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
    },
    {
      accessorKey: "labName",
      header: "Lab Name",
      size: 200,
    },
    {
      header: "Test(s)",
      id: "test-info",
      size: 100,
      Cell: TestInfoCell,
    },
    {
      accessorKey: "slotTime",
      header: "Slot Time",
      size: 160,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      size: 140,
    },
    {
      accessorKey: "netAmount",
      header: "Net Amount",
      size: 140,
    },
    {
      accessorKey: "additional_discount",
      header: "Additional Discount",
      size: 140,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      size: 140,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      Cell: ({ row }) => {
        const status = row.original.paymentStatus?.toUpperCase() || "";
        const pending =
          row.original?.paymentStatus?.toLowerCase() === "pending";

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <span>{status}</span>

            {pending && (
              <Tooltip title="Edit method">
                <IconButton
                  size="small"
                  onClick={() => handleEditPayment(row.original)}
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": { backgroundColor: "darkred" },
                  }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
    {
      accessorKey: "booking_status",
      header: "Booking Status",
      Cell: ({ row }) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UpdateBookingStatusCell
              row={row.original}
              getRadiologyBooking={getRadiologyBooking}
            />
          </LocalizationProvider>
        );
      },
    },

    {
      accessorKey: "reportStatus",
      header: "Report Share",
      size: 140,
    },

    {
      accessorKey: "createdAt",
      header: "Booking Date",
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      size: 160,
    },
    {
      accessorKey: "rescheduled_date",
      header: "Rescheduled Date",
      size: 140,
    },
  ];
};
