// utils/invoiceTableColumns.js

import { useEffect } from "react";
import Swal from "sweetalert2";

export const getInvoiceTableColumns = (getInvoices) => [

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
  size: 150,

  muiTableBodyCellProps: ({ row }) => ({
    sx: {
      backgroundColor:
        row.original.invoice_type === "Cancelled"
          ? "#ffe6e6"
          : "inherit",
      color:
        row.original.invoice_type === "Cancelled"
          ? "#b30000"
          : "inherit",
      fontWeight:
        row.original.invoice_type === "Cancelled"
          ? 600
          : "normal",
    },
  }),

  Cell: ({ cell, row }) => {
    const value = cell.getValue() || "Standard";
    const invoiceId = row.original.id;

    const handleChange = async (e) => {
      const newValue = e.target.value;

      // 🔥 Confirmation Alert
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Change invoice type to ${newValue}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      });

      if (!result.isConfirmed) {
        return; // stop if user cancels
      }

      try {
        const response = await fetch(
          `https://api.swasthyapro.com/api/invoice/update-invoice-type/${invoiceId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoice_type: newValue,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update invoice");
        }

        // 🔄 Refresh table
        await getInvoices();

        // ✅ Success Alert
        Swal.fire({
          title: "Updated!",
          text: "Invoice type updated successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

      } catch (error) {
        console.error("Update error:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to update invoice type.",
          icon: "error",
        });
      }
    };

    return (
      <select value={value} onChange={handleChange}>
        <option value="Standard">Standard</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    );
  },
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
