import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
  useMediaQuery, useTheme, Card, CardContent, Typography, Divider 
} from "@mui/material";

import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import Swal from "sweetalert2";

const PaymentsTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(true);
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Payments by email"));
    setLoading(true);
    axios
      .get("https://api.swasthyapro.com/api/payments/email-payments")
      .then((res) => {
        const data = res.data.data || [];
        setInvoices(data);
        setFilteredInvoices(data);
      })
      .catch((err) => {
        console.error("Error fetching payment data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((inv) => {
      const searchFields = [
        inv.id,
        inv.email,
        inv.name,
        inv.razorpay_payment_id,
        inv.payment_order_id,
        inv.invoice_id,
        inv.payment_method,
        inv.payment_status,
        inv.amount,
        inv.createdAt,
      ];

      return searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredInvoices(filtered);
    setPage(0);
  }, [searchQuery, invoices]);

  const handleDateSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    const sorted = [...filteredInvoices].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return newDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredInvoices(sorted);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const showTestsPopup = (data) => {
    const testList = Array.isArray(data.tests)
      ? data.tests
          .map(
            (test, index) =>
              `<li><strong>${index + 1}: ${test.name} - </strong>₹${test.price}</li>`
          )
          .join("")
      : "<li>No test data available.</li>";

    Swal.fire({
      title: `Tests booked by ${data.name}`,
      html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
      confirmButtonText: "Close",
      width: "40rem",
    });
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|[\]\\]/g, "\\$&");
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={i}
          style={{
            background: "linear-gradient(90deg, #f7b733, #fc4a1a)",
            color: "white",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="mb-2 flex justify-start p-2">
            <TextField
              label="Search orders"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ maxWidth: 300 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-4 pb-12">
            {filteredInvoices.length === 0 ? (
              <Typography variant="body2" align="center" color="textSecondary">
                No invoices found.
              </Typography>
            ) : (
              filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">
                        ID: {highlightMatch(invoice.id || "N/A", searchQuery)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Date:</strong>{" "}
                        {highlightMatch(
                          new Date(invoice.createdAt).toLocaleString() || "N/A",
                          searchQuery
                        )}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Invoice:</strong>{" "}
                        {highlightMatch(invoice.invoice_id || "N/A", searchQuery)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong>{" "}
                        {highlightMatch(invoice.email || "N/A", searchQuery)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong>{" "}
                        {highlightMatch(invoice.name || "N/A", searchQuery)}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "blue", cursor: "pointer" }}
                        onClick={() => showTestsPopup(invoice)}
                      >
                        <strong>Tests:</strong> {invoice.tests.length}{" "}
                        {invoice.tests.length > 0 && "▼"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Packages:</strong>{" "}
                        {highlightMatch(
                          invoice.packages?.map((p) => p.name).join(", ") || "N/A",
                          searchQuery
                        )}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Amount:</strong> ₹
                        {highlightMatch(invoice.amount?.toString() || "0", searchQuery)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Payment Method:</strong>{" "}
                        {highlightMatch(invoice.payment_method || "N/A", searchQuery)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong>{" "}
                        {highlightMatch(invoice.payment_status || "N/A", searchQuery)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
            )}
            </div>
         
        </>
      )}
    </Paper>
  );
};

export default PaymentsTable;
