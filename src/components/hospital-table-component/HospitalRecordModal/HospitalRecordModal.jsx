import React from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Link,
} from "@mui/material";

const HospitalRecordsModal = ({
  open,
  handleClose,
  loading,
  patient,
  records = [],
  onUpdateRecord,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          width: "80%",
          maxWidth: 900,
          mx: "auto",
          my: "5%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Hospital Records for{" "}
          <strong>{patient?.name || "Unknown Patient"}</strong>
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        ) : !records?.length ? (
          <Typography>No hospital records found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Hospital Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Report</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Admit Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Discharge Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.hospital_name || "N/A"}</TableCell>

                    {/* ✅ Make report clickable if it looks like a URL */}
                    <TableCell>
                     {record.report && record.report !== "NA" ? (
  <Link
    href={record.report}
    target="_blank"
    rel="noopener noreferrer"
    underline="hover"
    sx={{ color: "primary.main", fontWeight: 500 }}
  >
    View Report
  </Link>
) : (
  "N/A"
)}
                    </TableCell>

                    <TableCell>
                      {record.admit_date
                        ? new Date(record.admit_date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      {record.discharge_Date
                        ? new Date(record.discharge_Date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell
                      sx={{
                        color:
                          record.status === "admitted"
                            ? "green"
                            : record.status === "discharged"
                            ? "blue"
                            : "gray",
                      }}
                    >
                      {record.status || "N/A"}
                    </TableCell>

                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ fontSize: "0.7rem", py: 0, px: 1 }}
                          onClick={() => onUpdateRecord?.(record)}
                        >
                          Update
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HospitalRecordsModal;
