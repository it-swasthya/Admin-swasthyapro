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
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useDispatch } from "react-redux";
import { changeNavValue } from "../Redux/reducer";
import { DeleteIcon } from "lucide-react";
import Swal from "sweetalert2";
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
};
const LabsTable = () => {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [newLabName, setNewLabName] = useState("");
  const [category, setCategory] = useState("");

  const [adding, setAdding] = useState(false);

  const handleAddLab = () => {
    if (!newLabName.trim()) return;

    setAdding(true);
    axios
      .post("https://api.swasthyapro.com/api/labs/add-lab", {
        lab_name: newLabName,
        category,
      })
      .then(() => {
        Swal.fire("Success", "Lab added successfully.", "success"); 
        setNewLabName("");
        setOpenModal(false);
        // Refresh labs
        return axios.get("https://api.swasthyapro.com/api/labs/get-all-lab");
      })
      .then((res) => {
        const data = res.data.data || [];
        setLabs(data);
        setFilteredLabs(data);
      })
      .catch((err) => {
        console.error("Add lab error:", err);
        Swal.fire("Error", "Failed to add lab.", "error"); // ✅ Optional error alert
      })
      .finally(() => setAdding(false));
  };

  useEffect(() => {
    dispatch(changeNavValue("Labs"));
    setLoading(true);
    axios
      .get("https://api.swasthyapro.com/api/labs/get-all-lab")
      .then((res) => {
        const data = res.data.data || [];
        setLabs(data);
        setFilteredLabs(data);
      })
      .catch((err) => {
        console.error("Error fetching labs:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = labs.filter((lab) =>
      [lab.id, lab.lab_name, lab.createdAt, lab.updatedAt].some((field) =>
        field?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredLabs(filtered);
    setPage(0);
  }, [searchQuery, labs]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    const escapedQuery = escapeRegExp(query);
    let regex;
    try {
      regex = new RegExp(`(${escapedQuery})`, "gi");
    } catch (error) {
      return text;
    }

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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This Lab will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `https://api.swasthyapro.com/api/labs/delete-lab/${id}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          Swal.fire("Deleted!", "Lab deleted successfully.", "success");

          // ✅ Refresh labs
          const response = await axios.get(
            "https://api.swasthyapro.com/api/labs/get-all-lab"
          );
          const data = response.data.data || [];
          setLabs(data);
          setFilteredLabs(data);
        } else {
          throw new Error();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete the Lab.", "error");
      }
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap justify-between gap-2 p-2">
            <TextField
              label="Search labs"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ maxWidth: 300 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{ height: 40, background: "#4b6cb7" }}
              onClick={() => setOpenModal(true)}
            >
              Add Lab
            </Button>
          </div>

          <>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 600,
                overflowY: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                  scrollBehavior: "smooth",
                },
                "-ms-overflow-style": "none",
                "scrollbar-width": "none",
              }}
            >
              <Table stickyHeader sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow sx={{ height: 40 }}>
                    {[
                      "Lab ID",
                      "Lab Name",
                      "Category",
                      "Created At",
                      "Updated At",
                      "Actions",
                    ].map((head, i) => (
                      <TableCell
                        key={i}
                        align="center"
                        sx={{
                          background:
                            "linear-gradient(90deg, #4b6cb7, #182848)",
                          color: "white",
                          fontWeight: "bold",
                          paddingY: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLabs.length === 0 ? (
                    <TableRow sx={{ height: 36 }}>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                      >
                        No labs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLabs
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((lab, index) => (
                        <TableRow key={index}  sx={{ height: 36 , backgroundColor:lab.category=="Pathalogy"?"#FEF08A" : "#BFDBFE" }}>
                          <TableCell
                            align="center"
                            sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                          >
                            {highlightMatch(lab.id, searchQuery)}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                          >
                            {highlightMatch(lab.lab_name, searchQuery)}
                          </TableCell>
                           <TableCell
                            align="center"
                            sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                          >
                            {highlightMatch(lab.category, searchQuery)}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                          >
                            {highlightMatch(
                              new Date(lab.createdAt).toLocaleString(),
                              searchQuery
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ paddingY: "4px", fontSize: "0.85rem" }}
                          >
                            {highlightMatch(
                              new Date(lab.updatedAt).toLocaleString(),
                              searchQuery
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ py: 0.5, fontSize: "0.75rem" }}
                          >
                            {/* <Button
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
                      </Button> */}
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDelete(lab.id)}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredLabs.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>

          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Add New Lab</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Lab Name"
                fullWidth
                variant="standard"
                value={newLabName}
                onChange={(e) => setNewLabName(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Category"
                fullWidth
                variant="standard"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)} disabled={adding}>
                Cancel
              </Button>
              <Button
                onClick={handleAddLab}
                disabled={adding || !newLabName.trim()}
              >
                {adding ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default LabsTable;
