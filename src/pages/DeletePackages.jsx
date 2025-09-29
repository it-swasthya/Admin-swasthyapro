import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Typography,
  Tooltip,
  IconButton,
  Button,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { Eye } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { LabCustomModal } from "../components/LabPricesShowModal";
import { decryptEncryptedData } from "../utils/DecodeFormatData";
import { routesToObfuscated } from "../utils/RoutesKey";

const DeletePackages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPackage, setSelectedPackage] = React.useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [openTestModal, setOpenTestModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [labOptions, setLabOptions] = useState([]);

  const [testForm, setTestForm] = useState({
    lab_id: "",
    CPT: "",
    CPRT: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  React.useEffect(() => {
    if (openTestModal && labOptions.length === 0) {
      axios
        .get("https://api.swasthyapro.com/api/labs/get-all-lab")
        .then((res) => {
          const data = res.data.data || [];
          setLabOptions(data);
        })
        .catch((err) => {
          console.error("Error fetching lab options:", err);
        });
    }
  }, [openTestModal, labOptions.length]);

  const handleTestFormChange = (field, value) => {
    setTestForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitTestLab = () => {
    const payload = {
      ...testForm,
      test_id: selectedPackage?.id || null,
      CPT: parseFloat(testForm.CPT),
      CPRT: parseFloat(testForm.CPRT),
    };

    setSubmitting(true);
    axios
      .post("https://api.swasthyapro.com/api/labs/add-test-lab", payload)
      .then((res) => {
        setOpenTestModal(false);
        setTestForm({ lab_id: "", CPT: "", CPRT: "" });
        Swal.fire({
          icon: "success",
          title: "Test Lab Added",
          text: "The test lab was added successfully!",
          confirmButtonColor: "#3085d6",
        });
        fetchData();
      })
      .catch((err) => {
        console.error("Error submitting test lab:", err);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: "An error occurred while adding the test lab.",
          confirmButtonColor: "#d33",
        });
      })
      .finally(() => {
        setSubmitting(false);
        setOpenTestModal(false);
      });
  };

  useEffect(() => {
    dispatch(changeNavValue("Manage Packages"));
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(
        `https://api.swasthyapro.com/api/database/${routesToObfuscated["get-packages"]}`
      );
      const data = await response.json();
      const decodedData = await decryptEncryptedData(data);
      const finalList = Array.isArray(decodedData.data) ? decodedData.data : [];

      setPackages(finalList);
      setFilteredPackages(finalList);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to fetch packages. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This package will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://api.swasthyapro.com/api/database/delete-package/${id}`,
          {
            method: "DELETE",
          }
        );

        if (res.ok) {
          Swal.fire("Deleted!", "The package has been deleted.", "success");
          const updated = packages.filter((pkg) => pkg.id !== id);
          setPackages(updated);
          setFilteredPackages(updated);
        } else {
          Swal.fire("Error", "Failed to delete the package.", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    const filtered = packages.filter((pkg) =>
      Object.values(pkg).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredPackages(filtered);
    setPage(0);
  };
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
  };

  const highlightMatch = (text) => {
    if (!searchTerm || !text) return text;
    const escapedQuery = escapeRegExp(searchTerm);

    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return String(text)
      .split(regex)
      .map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={index}
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

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedPackages = [...filteredPackages].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setFilteredPackages(sortedPackages);
  };

  const showTestsPopup = (pkg) => {
    const testList = Array.isArray(pkg.test_data)
      ? pkg.test_data
          .map(
            (test, index) =>
              `<li><strong>${index + 1}</strong> - ${test.test_name}</li>`
          )
          .join("")
      : "<li>No test data available.</li>";

    Swal.fire({
      title: `Tests in ${pkg.package_name}`,
      html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
      confirmButtonText: "Close",
      width: "40rem",
    });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to page 0 after changing rows per page
  };

  const showPackageDetails = (pkg) => {
    Swal.fire({
      title: `${pkg.package_name} Details`,
      html: `${pkg.test_details ? pkg.test_details : "No Details Available"}`,
      confirmButtonText: "Close",
      width: "40rem",
      customClass: {
        popup: "swal2-professional",
        title: "swal2-title",
        content: "swal2-content",
        confirmButton: "swal2-confirm",
      },
    });
  };

  const showLabPrices = (pkg) => {
    const rows =
      Array.isArray(pkg.TestLabPrices) && pkg.TestLabPrices.length > 0
        ? pkg.TestLabPrices.map((pacakge, index) => {
            const rowClass = index % 2 === 1 ? "bg-green-100" : "";
            return `
            <tr class="${rowClass}">
              <td class="px-4 py-2 break-words">${pacakge.Lab.lab_name}</td>
              <td class="px-4 py-2 text-center">
                ${pacakge.CPT}
              </td>
              <td class="px-4 py-2 text-center">
                ${pacakge.CPRT}
              </td>
            </tr>`;
          }).join("")
        : `<tr><td colspan="3" class="text-gray-600 text-sm py-4 text-center">No Lab Price Available</td></tr>`;
    const tableHTML = `
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 text-left">Lab Name</th>
            <th class="px-4 py-2 text-center whitespace-nowrap">CPT</th>
             <th class="px-4 py-2 text-center whitespace-nowrap">CPRT</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    setModalTitle(`Labs in ${pkg.package_name}`);
    setModalContent(tableHTML);
    setModalOpen(true);
  };
  return (
    <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <TextField
          label="Search packages"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ maxWidth: 300 }}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading packages...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 500,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
              scrollBehavior: "smooth",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <Table
            stickyHeader
            aria-label="packages table"
            sx={{ minWidth: 2000 }}
          >
            <TableHead>
              <TableRow>
                {[
                  "ID",
                  "Package",
                  "Type",
                  "Market Price (₹)",
                  "Discount (%)",
                  "Price (₹)",
                  "Package lab price",
                  "Add Package to Labs",
                  "Tests",
                  "Details",
                  "Date",
                  "Actions",
                ].map((label, idx) => (
                  <TableCell
                    key={label}
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #4b6cb7, #182848)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      paddingY: "4px",
                      borderBottom: "none",
                      cursor:
                        label === "Market Price (₹)" || label === "Price (₹)"
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => {
                      if (label === "Market Price (₹)")
                        handleSort("market_price");
                      if (label === "Price (₹)")
                        handleSort("after_discount_price");
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {label}
                      {(label === "Market Price (₹)" ||
                        label === "Price (₹)") &&
                        sortConfig.key ===
                          (label === "Market Price (₹)"
                            ? "market_price"
                            : "after_discount_price") &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUpward fontSize="small" />
                        ) : (
                          <ArrowDownward fontSize="small" />
                        ))}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredPackages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pkg) => (
                  <TableRow hover key={pkg.id}>
                    <TableCell
                      align="center"
                      sx={{ py: 0.2, fontSize: "0.875rem" }}
                    >
                      {highlightMatch(pkg.id)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.2, fontSize: "0.875rem" }}
                    >
                      {highlightMatch(pkg.package_name)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.2, fontSize: "0.875rem" }}
                    >
                      {highlightMatch(pkg.Package_type)}
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      ₹{highlightMatch(pkg.market_price)}
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      {highlightMatch(pkg.discount_percentage)}%
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      ₹{highlightMatch(pkg.after_discount_price)}
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        startIcon={<Eye />}
                        onClick={() => showLabPrices(pkg)}
                      >
                        Show Lab Prices
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setOpenTestModal(true);
                        }}
                      >
                        Labs
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      {pkg.test_data?.length > 0 ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "primary.main",
                              cursor: "pointer",
                              mr: 0.5,
                            }}
                            variant="body2"
                          >
                            {highlightMatch(pkg.test_data?.length)}
                          </Typography>
                          <Tooltip title="View Tests in this packages">
                            <IconButton
                              onClick={() => showTestsPopup(pkg)}
                              size="small"
                              sx={{ p: 0.5 }}
                            >
                              <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </span>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      {pkg.test_details ? (
                        <Tooltip title="View Package Details">
                          <IconButton
                            size="small"
                            onClick={() => showPackageDetails(pkg)}
                            sx={{ p: 0.5 }}
                          >
                            <ExpandMoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {highlightMatch("N/A")}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 0.2, fontSize: "0.875rem" }}>
                      {highlightMatch(pkg.creation_date)}
                    </TableCell>
                    <TableCell
                      sx={{ py: 0.2, fontSize: "0.75rem" }}
                      align="right"
                    >
                      <button
                        onClick={() =>
                          navigate(`/edit-packages/${pkg.id}`, {
                            state: { packageData: pkg },
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-400 text-white font-semibold text-xs px-2 py-0.5 mr-1 border border-blue-700 hover:border-blue-500 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="bg-red-500 hover:bg-red-400 text-white font-semibold text-xs px-2 py-0.5 border border-red-700 hover:border-red-500 rounded"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPackages.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={openTestModal}
        onClose={() => setOpenTestModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Test to Lab</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Select Lab Name"
            fullWidth
            margin="normal"
            value={testForm.lab_id}
            onChange={(e) => handleTestFormChange("lab_id", e.target.value)}
          >
            <MenuItem value="">-- Select Lab --</MenuItem>
            {labOptions.map((lab) => (
              <MenuItem key={lab.id} value={lab.id}>
                {lab.lab_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="CPT"
            type="number"
            fullWidth
            margin="normal"
            value={testForm.CPT}
            onChange={(e) => handleTestFormChange("CPT", e.target.value)}
          />
          <TextField
            label="CPRT"
            type="number"
            fullWidth
            margin="normal"
            value={testForm.CPRT}
            onChange={(e) => handleTestFormChange("CPRT", e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenTestModal(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitTestLab}
            disabled={
              submitting || !testForm.lab_id || !testForm.CPT || !testForm.CPRT
            }
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <LabCustomModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        <div
          dangerouslySetInnerHTML={{ __html: modalContent }}
          className="prose max-w-none"
        />
      </LabCustomModal>
    </div>
  );
};

export default DeletePackages;
