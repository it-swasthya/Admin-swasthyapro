import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";

import { changeNavValue } from "../Redux/reducer";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();

  const getInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.swasthyapro.com/api/invoice/get-invoices"
      );
      setInvoices(response.data?.invoices || []);
      setFilteredInvoices(response.data?.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("User Invoices"));
    getInvoices();
  }, []);

  const sortByTime = (direction) => {
    const sorted = [...filteredInvoices].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return direction === "asc" ? timeA - timeB : timeB - timeA;
    });
    setFilteredInvoices(sorted);
  };

  const handleSortClick = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    sortByTime(newDirection);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = invoices.filter((invoice) =>
      Object.values(invoice).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredInvoices(filtered);
    setPage(0);
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div
      className="max-w-full mx-auto lg:bg-white lg:shadow-lg rounded-lg"
      style={{
        marginTop: "-10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="mb-2 flex justify-start p-2">
        <TextField
          label="Search invoices"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: 300 }}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isMobile ? (
        <div className="p-4 space-y-4 pb-20">
          {filteredInvoices.map((invoice, idx) => (
            <Paper
              key={idx}
              className="p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                padding: "16px",
              }}
            >
              <div className="text-lg font-semibold text-gray-900">
                <strong>ID:</strong> {highlightMatch(invoice.id, searchQuery)}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Booking ID:</strong>{" "}
                {highlightMatch(invoice.booking_id, searchQuery)}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Amount:</strong> ₹
                {highlightMatch(invoice.total_amount?.toString(), searchQuery)}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Time:</strong>{" "}
                {new Date(invoice.createdAt).toLocaleString()}
              </div>
            </Paper>
          ))}
        </div>
      ) : (
        <>
          {" "}
          <div style={{ overflowX: "auto", width: "100%" }}>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                flexGrow: 2,
                minWidth: 800,
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "-ms-overflow-style": "none",
                scrollbarWidth: "none",
              }}
            >
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="300px"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 1500 }}
                >
                  <TableHead>
                    <TableRow>
                      {[
                        "Invoice ID",
                        "User ID",
                        "Booking ID",
                        "Payment ID",
                        "Invoice Type",
                        "Time",
                        "Billing Name",
                        "Billing Phone",
                        "Billing Address",
                        "State",
                        "Total Amount",
                      ].map((head, idx) => (
                        <TableCell
                          key={idx}
                          align="center"
                          sx={{
                            background:
                              "linear-gradient(90deg, #4b6cb7, #182848)",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            padding: "3px",
                            borderBottom: "none",
                            cursor: head === "Time" ? "pointer" : "default",
                          }}
                          onClick={
                            head === "Time" ? handleSortClick : undefined
                          }
                        >
                          {head === "Time"
                            ? `${head} ${sortDirection === "asc" ? "▲" : "▼"}`
                            : head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} align="center" sx={{ py: 2 }}>
                          <span className="text-gray-500 text-sm">
                            No invoices found.
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((invoice, index) => (
                          <TableRow hover key={index} sx={{ height: 36 }}>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(invoice.id || "N/A", searchQuery)}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.user_id || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.booking_id || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.payment_id || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.invoice_type || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                new Date(invoice.createdAt).toLocaleString() ||
                                  "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.billing_name || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.billing_phone || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.billing_address || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              {highlightMatch(
                                invoice.billing_state || "N/A",
                                searchQuery
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ py: 0.5, fontSize: "0.75rem" }}
                            >
                              ₹
                              {highlightMatch(
                                invoice.total_amount?.toString() || "0",
                                searchQuery
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredInvoices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              position: "sticky",
              bottom: 0,
              background: "#fff",
              zIndex: 1,
            }}
          />
        </>
      )}
    </div>
  );
};

export default InvoiceTable;
