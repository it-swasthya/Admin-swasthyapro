import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Typography,
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem ,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import _ from "lodash";

import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import AddParameterModal from "../components/AddParamter.modal";
import axios from "axios";
import { LabCustomModal } from "../components/LabPricesShowModal";
import { Eye } from "lucide-react";
import {decryptEncryptedData} from "../utils/DecodeFormatData"

// Table column definitions
const columns = [ 
   { id: "test_id", label: "Test ID", minWidth: 150 },
  { id: "test_name", label: "Test Name", minWidth: 150 },
  { id: "facility_name", label: "Facility Name", minWidth: 150 },
  { id: "market_price", label: "Market Price", minWidth: 100, align: "right" },
  {
    id: "after_discount_price",
    label: "Discount Price",
    minWidth: 120,
    align: "right",
  },
  { id: "test_details", label: "Details", align: "center" },
  { id: "total_parameters", label: "Parameters", align: "center" },
    { id: "TestLabPrices", label: "Test Lab Prices", align: "center" },

  { id: "parameters", label: "Add Parameters", align: "center" },
  { id: "labs", label: "Add Test to Labs", align: "center" },

  { id: "actions", label: "Actions", minWidth: 150 },
];

const highlightMatch = (text, query) => {
  if (!query || !text) return text;
  const parts = String(text).split(
    new RegExp(`(${_.escapeRegExp(query)})`, "gi")
  );
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        style={{
          background: "linear-gradient(90deg, #f7971e, #ffd200)",
          color: "#000",
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

export default function StickyHeadTable() {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("after_discount_price");
  const [paramModalOpen, setParamModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState(null);
  const location = useLocation();

  const handleAddParams = (testId) => {
    setSelectedTest(testId);
    setParamModalOpen(true);
  };

  const [searchTerm, setSearchTerm] = React.useState("");
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [selectedTests, setSelectedTests] = React.useState([]);
  const [preSelectedIds, setPreSelectedIds] = React.useState([]);
  const [customPage, setCustomPage] = React.useState("");
  const [totalItems, setTotalItems] = React.useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showCheckbox = location.state !== null;
const [openTestModal, setOpenTestModal] = React.useState(false);
const [testForm, setTestForm] = React.useState({
  lab_id: "",
  CPT: "",
  CPRT: "",
});
const [submitting, setSubmitting] = React.useState(false);
const [labOptions, setLabOptions] = React.useState([]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalContent, setModalContent] = React.useState("");



   const fetchData = async () => {
    dispatch(changeNavValue("Tests List"));
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.swasthyapro.com/api/database/page/${page + 1}/limit/${rowsPerPage}?q=${searchTerm}`
      );
      const data = await res.json();
      const decodedData  = await decryptEncryptedData(data)
      setTotalItems(decodedData.totalCount);
      setRows(decodedData.data || []);
      setTotalPages(decodedData.totalPages || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };


const handleTestFormChange = (field, value) => {
  setTestForm((prev) => ({ ...prev, [field]: value }));
};

// Fetch lab list for dropdown
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


const handleSubmitTestLab = () => {
  const payload = {
    ...testForm,
    test_id: selectedTest?.id || null,
    CPT: parseFloat(testForm.CPT),
    CPRT: parseFloat(testForm.CPRT),
  };

  setSubmitting(true);
  axios
    .post("https://api.swasthyapro.com/api/labs/add-test-lab", payload)
    .then((res) => {
      setOpenTestModal(false);
      setTestForm({lab_id: "", CPT: "", CPRT: "" });

      Swal.fire({
        icon: 'success',
        title: 'Test Lab Added',
        text: 'The test lab was added successfully!',
        confirmButtonColor: '#3085d6',
      });
      fetchData()
    })
    .catch((err) => {
      console.error("Error submitting test lab:", err);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'An error occurred while adding the test lab.',
        confirmButtonColor: '#d33',
      });
    })
    .finally(() => {
      setSubmitting(false);
    });
};


 
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedTests")) || [];
    setPreSelectedIds(stored.map((test) => test.id));
    setSelectedTests(stored);
    return () => {
      const allowedRoutes = [location.state?.from];
      const nextPath = window.location.pathname;
      if (!allowedRoutes.includes(nextPath)) {
        localStorage.removeItem("selectedTests");
        localStorage.removeItem("addPackageForm");
      }
    };
  }, []);

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedTests")) || [];
    setSelectedTest(stored);
    fetchData();
  }, [page, rowsPerPage, searchTerm]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const selectTests = () => {
    if (selectedTests.length > 0) {
      const existingTests =
        JSON.parse(localStorage.getItem("selectedTests")) || [];

      const mergedTests = [...existingTests, ...selectedTests];
      const uniqueTests = Array.from(
        new Map(mergedTests.map((test) => [test.testid, test])).values()
      );
      localStorage.setItem("selectedTests", JSON.stringify(uniqueTests));
      navigate(location.state.from, {
        state: { data: location.state.editData },
      });
    } else {
      Swal.fire("No Selection", "Please select at least one test.", "info");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This test will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://api.swasthyapro.com/api/database/delete-test/${id}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setRows((prev) => prev.filter((t) => t.id !== id));
          Swal.fire("Deleted!", "Test deleted successfully.", "success");
        } else {
          throw new Error();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete the test.", "error");
      }
    }
  };

  const showTestDetails = (test) => {
    Swal.fire({
      title: `${test.test_name} Details`,
      html: `${test.test_details ? test.test_details : "No Details Available"}`,
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

  const showParametersDetails = (test) => {
    const testList = Array.isArray(test.TestParameters)
      ? test.TestParameters.map(
          (test, index) =>
            `<li><strong>${index + 1}</strong> - ${test.parameter_name}</li>`
        ).join("")
      : "<li>No test data available.</li>";

    Swal.fire({
      title: `Tests in ${test.test_name}`,
      html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
      confirmButtonText: "Close",
      width: "40rem",
    });
  };

  const handleSort = (id) => {
    if (id !== "test_name") {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSubmitParams = async (params) => {
    const data = {
      test_id: selectedTest.id,
      facility_id: selectedTest.facility_id,
      parameters: params,
    };
    try {
      const resp = await axios.post(
        "https://api.swasthyapro.com/api/parameter/add-parameter",
        data
      );
      if (resp.status == 201) {
        Swal.fire("Added!", "Parameters Added", "success");
      } else {
        Swal.fire("Error", "Failed to add the parameters.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add the parameters.", "error");
      console.log(err);
    }
  };
  const sortedRows = React.useMemo(() => {
    if (rows.length === 0) return [];

    const comparator = (a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (typeof valueA === "number" || !isNaN(valueA)) {
        return parseFloat(valueA) - parseFloat(valueB);
      }

      return valueA.localeCompare(valueB);
    };

    const sortedData = [...rows].sort(comparator);

    if (order === "desc") {
      sortedData.reverse();
    }

    return sortedData;
  }, [rows, order, orderBy]);


const showLabPrices = (tests) => {

    const rows = Array.isArray(tests.TestLabPrices) && tests.TestLabPrices.length > 0
      ? tests.TestLabPrices.map((test, index) => {
          const rowClass = index % 2 === 1 ? "bg-green-100" : "";
          return `
            <tr class="${rowClass}">
              <td class="px-4 py-2 break-words">${test.Lab.lab_name}</td>
              <td class="px-4 py-2 text-center">
                ${test.CPT}
              </td>
              <td class="px-4 py-2 text-center">
                ${test.CPRT}
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

    setModalTitle(`Labs in ${tests.test_name}`);
    setModalContent(tableHTML);
    setModalOpen(true);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search tests"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {showCheckbox && (
          <Button
            variant="outlined"
            size="small"
            sx={{ fontSize: "1rem", py: 0, px: 1 }}
            onClick={selectTests}
          >
            Save Changes
          </Button>
        )}
      </Box>
      {showCheckbox && selectedTests.length > 0 && (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            whiteSpace: "nowrap",
            gap: 1,
            mt: 1,
            pb: 1,
            maxWidth: "100%",
          }}
        >
          {selectedTests.map((test) => (
            <Chip
              key={test.testid}
              label={test.test_name}
              onDelete={() =>
                setSelectedTests((prev) =>
                  prev.filter((t) => t.testid !== test.testid)
                )
              }
              size="small"
              sx={{
                backgroundColor: "#e0f7fa",
                color: "#006064",
                fontWeight: 500,
                flexShrink: 0, // Prevents chips from shrinking
              }}
              deleteIcon={<DeleteIcon fontSize="small" />}
            />
          ))}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 700,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
              scrollBehavior: "smooth",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          <Table stickyHeader aria-label="users table" sx={{ minWidth: 1800 }}>
            <TableHead>
              <TableRow>
                {showCheckbox && (
                  <TableCell
                    align="center"
                    sx={{
                      background: "linear-gradient(90deg, #4b6cb7, #182848)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "3px",
                      borderBottom: "none",
                    }}
                    padding="checkbox"
                  >
                    Add
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "center"}
                    sx={{
                      background: "linear-gradient(90deg, #4b6cb7, #182848)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "3px",
                      borderBottom: "none",
                    }}
                    style={{
                      minWidth: column.minWidth,
                      cursor: column.id !== "actions" ? "pointer" : "default",
                      padding: "10px 8px",
                    }}
                    onClick={() =>
                      column.id !== "actions" &&
                      column.id !== "parameters" &&
                      column.id !== "total_parameters" &&
                      handleSort(column.id)
                    }
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows.length > 0 ? (
                sortedRows.map((row) => (
                  <TableRow hover key={row.id} sx={{ height: 36 }}>
                    {showCheckbox && (
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedTests.some(
                            (test) => test.testid === row.id
                          )}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedTests((prevSelected) =>
                              isChecked
                                ? [
                                    ...prevSelected,
                                    {
                                      testid: row.id,
                                      test_name: row.test_name,
                                    },
                                  ]
                                : prevSelected.filter(
                                    (test) => test.testid !== row.id
                                  )
                            );
                          }}
                        />
                      </TableCell>
                    )}
                      <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      {highlightMatch(row.id, searchTerm)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      {highlightMatch(row.test_name, searchTerm)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      {highlightMatch(row.facility_name, searchTerm)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      ₹{parseFloat(row.market_price).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      ₹{parseFloat(row.after_discount_price).toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      {row.test_details
                        ? highlightMatch(
                            <Tooltip title="View Test Details">
                              <IconButton
                                onClick={() => showTestDetails(row)}
                                size="small"
                                sx={{ p: 0.5 }}
                              >
                                <ExpandMoreIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      {row.TestParameters ? (
                        row.TestParameters.length > 0 ? (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {" "}
                            <Typography
                              sx={{
                                color: "primary.main",
                                cursor: "pointer",
                                mr: 0.5,
                              }}
                              variant="body2"
                            >
                              {highlightMatch(row.TestParameters?.length)}
                            </Typography>
                            <Tooltip title="View Parameters in this Test"></Tooltip>
                            {highlightMatch(
                              <IconButton
                                onClick={() => showParametersDetails(row)}
                                size="small"
                                sx={{ p: 0.5 }}
                              >
                                <ExpandMoreIcon fontSize="small" />
                              </IconButton>
                            )}{" "}
                          </span>
                        ) : (
                          0
                        )
                      ) : (
                        0
                      )}
                    </TableCell>
                      <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                    
                     <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        startIcon={<Eye/>}
                        onClick={() => showLabPrices(row)}
                      >
                        Show Lab Prices
                      </Button>
                    
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        startIcon={<AddIcon />}
                        onClick={() => handleAddParams(row)}
                      >
                        Parameter
                      </Button>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                        startIcon={<AddIcon />}
                        onClick={() => {setSelectedTest(row) ;setOpenTestModal(true)}}
                      >
                        Labs
                      </Button>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ py: 0.5, fontSize: "0.75rem" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(`/edit-tests/${row.id}`, {
                            state: { testData: row },
                          })
                        }
                        sx={{ mr: 1 }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(row.id)}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 0.5, fontSize: "0.75rem" }}
                  >
                    No tests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        px={2}
        py={1}
      >
        <TextField
          label="Go to page"
          type="number"
          size="small"
          value={customPage}
          onChange={(e) => setCustomPage(e.target.value)}
          sx={{ width: 100, mr: 1 }}
          inputProps={{ min: 1, max: totalPages }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            const targetPage = parseInt(customPage) - 1;
            if (
              !isNaN(targetPage) &&
              targetPage >= 0 &&
              targetPage < totalPages
            ) {
              setPage(targetPage);
            } else {
              Swal.fire(
                "Invalid Page",
                `Please enter a number between 1 and ${totalPages}`,
                "warning"
              );
            }
          }}
        >
          Go
        </Button>
      </Box>

      <AddParameterModal
        open={paramModalOpen}
        onClose={() => setParamModalOpen(false)}
        onSubmit={handleSubmitParams}
        selectedTest={selectedTest}
      />
     <Dialog open={openTestModal} onClose={() => setOpenTestModal(false)} fullWidth maxWidth="sm">
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
    <Button onClick={() => setOpenTestModal(false)} disabled={submitting}>Cancel</Button>
    <Button
      variant="contained"
      onClick={handleSubmitTestLab}
      disabled={
        submitting ||
        !testForm.lab_id ||
        !testForm.CPT ||
        !testForm.CPRT
      }
    >
      {submitting ? "Submitting..." : "Submit"}
    </Button>
  </DialogActions>
</Dialog>
  <LabCustomModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        <div dangerouslySetInnerHTML={{ __html: modalContent }} className="prose max-w-none" />
      </LabCustomModal>
    </Paper>
  );
}




