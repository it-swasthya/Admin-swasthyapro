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
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";

const CouponTable = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.swasthyapro.com/api/coupons/all-coupon"
      );
      setCoupons(response.data || []);
      setFilteredCoupons(response.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load",
        text: "Could not fetch coupons. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Coupon Table"));
    fetchCoupons();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = coupons.filter((coupon) =>
      Object.values(coupon).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredCoupons(filtered);
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

  const handleDelete = async (couponId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the coupon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://api.swasthyapro.com/api/coupons/delete-coupon/${couponId}`
        );
        fetchCoupons();
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: response.data?.message || "Coupon deleted successfully.",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text:
            error.response?.data?.message ||
            "Could not delete coupon. Try again.",
        });
      }
    }
  };
  const handleEdit = async (coupon) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Coupon",
      width: 400, // Smaller width
      showCancelButton: true,
      confirmButtonText: "Update",
      customClass: {
        popup: "rounded-md",
      },
      html: `
      <style>
        .swal2-field-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        .swal2-field-group label {
          font-size: 12px;
          margin-bottom: 2px;
          font-weight: 500;
          color: #333;
        }
        .swal2-input {
          height: 30px !important;
          padding: 2px 8px;
          font-size: 13px;
        }
        .swal2-checkbox-group {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
      </style>

      <div class="swal2-field-group">
        <label for="edit_coupon_name">Coupon Name</label>
        <input id="edit_coupon_name" class="swal2-input" value="${coupon.coupon_name}" />
      </div>

      <div class="swal2-field-group">
        <label for="edit_discount">Discount (%)</label>
        <input id="edit_discount" class="swal2-input" type="number" value="${coupon.discount_percentage}" />
      </div>

      <div class="swal2-field-group">
        <label for="edit_category">Category</label>
        <input id="edit_category" class="swal2-input" value="${coupon.category}" />
      </div>

      <div class="swal2-field-group">
        <label for="edit_valid_from">Valid From</label>
        <input id="edit_valid_from" class="swal2-input" type="datetime-local" value="${coupon.valid_from.slice(0, 16)}" />
      </div>

      <div class="swal2-field-group">
        <label for="edit_valid_to">Valid To</label>
        <input id="edit_valid_to" class="swal2-input" type="datetime-local" value="${coupon.valid_to.slice(0, 16)}" />
      </div>

      <div class="swal2-checkbox-group">
        <input id="edit_active" type="checkbox" ${coupon.active ? "checked" : ""} />
        <label for="edit_active">Active</label>
      </div>
    `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("edit_coupon_name").value.trim();
        const discount = parseInt(
          document.getElementById("edit_discount").value
        );
        const category = document.getElementById("edit_category").value.trim();
        const valid_from = document.getElementById("edit_valid_from").value;
        const valid_to = document.getElementById("edit_valid_to").value;
        const active = document.getElementById("edit_active").checked;

        if (!name || isNaN(discount) || !category || !valid_from || !valid_to) {
          Swal.showValidationMessage("All fields must be filled correctly.");
          return false;
        }

        return {
          coupon_name: name,
          discount_percentage: discount,
          category,
          valid_from,
          valid_to,
          active,
        };
      },
    });
    if (formValues) {
      try {
        const response = await axios.put(
          `https://api.swasthyapro.com/api/coupons/edit-coupon/${coupon.id}`,
          formValues
        );
        Swal.fire(
          "Updated!",
          response.data?.message || "Coupon updated successfully",
          "success"
        );
        fetchCoupons();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update coupon",
          "error"
        );
      }
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="max-w-full mx-auto p-4">
      <div className="mb-2 flex justify-start">
        <TextField
          label="Search Coupons"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: 300 }}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          minWidth: 800,
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" },
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
          <Table stickyHeader aria-label="coupon table" sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow>
                {[
                  "Coupon ID",
                  "Name",
                  "Discount (%)",
                  "Discount (₹)",
                  "Amount Range From (₹)",
                  "Amount Range To (₹)",
                  "Active",
                  "Category",
                  "Valid From",
                  "Valid To",
                  "Created At",
                  "Action",
                ].map((head, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #4b6cb7, #182848)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      padding: "6px 8px",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 2 }}>
                    <span className="text-gray-500 text-sm">
                      No coupons found.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((coupon, index) => (
                    <TableRow hover key={index}>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(coupon.id, searchQuery)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(coupon.coupon_name, searchQuery)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          `${coupon.discount_percentage}%`,
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          `₹${coupon.discount_rupee}`,
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          `₹${coupon.amount_range_from}`,
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          `₹${coupon.amount_range_to}`,
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          coupon.active ? "Yes" : "No",
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(coupon.category, searchQuery)}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          new Date(coupon.valid_from).toLocaleDateString(),
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          new Date(coupon.valid_to).toLocaleDateString(),
                          searchQuery
                        )}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        {highlightMatch(
                          new Date(coupon.createdAt).toLocaleString(),
                          searchQuery
                        )}
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{ py: 0.5, fontSize: "0.75rem" }}
                      >
                        <Tooltip title="Edit Coupon">
                          <IconButton
                            onClick={() => handleEdit(coupon)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Coupon">
                          <IconButton
                            onClick={() => handleDelete(coupon.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCoupons.length}
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
    </div>
  );
};

export default CouponTable;
