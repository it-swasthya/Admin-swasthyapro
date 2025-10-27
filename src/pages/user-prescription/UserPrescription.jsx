import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import axios from "axios";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import TableComponent from "../../components/table/Table";
import { changeNavValue } from "../../Redux/reducer";
import { getPrescriptionTableColumns } from "../../components/columns/UserPrescriptionColumn";
import flattenPrescriptionRow from "../../utils/UserPrescriptionFllatenRow";
import MobileViewPrescription from "../../mobile-components/user-prescription/MobileViewPrescription";
import UserDetailsModalForPrescription from "../../components/user-info-modal/UserInfoModalForPrescription,";

const ViewPrescription = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [openQueryUpdateForm, setOpenQueryUpdateForm] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const [status, setStatus] = useState();
  const [seen, setSeen] = useState();
  const [remarks, setRemarks] = useState();
  const [row, setRow] = useState();
  const [selectedDetails, setSelectedDetails] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://api.swasthyapro.com/api/prescription/prescriptions"
      );
      setUsers(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Prescription"));
    fetchUsers();
  }, []);

  const handleShowForm = (row) => {
    setRow(row);
    setRemarks(row.remarks || "");
    setSeen(row.seen || false);
    setOpenQueryUpdateForm(true);
  };

  const handleDetailsClick = (detailsObj) => {
    setSelectedDetails(detailsObj);
    setOpenDetailsModal(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        `https://api.swasthyapro.com/api/prescription/update-status/${row.id}`,
        { status, remarks: remarks || null, seen }
      );

      if (response.status === 200) {
        Swal.fire({ title: "Status Updated", icon: "success" });
        await fetchUsers();
      }
      setOpenQueryUpdateForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  const column = getPrescriptionTableColumns(handleShowForm, handleDetailsClick);

  return (
    <>
      {isMobile ? (
        <MobileViewPrescription users={users} handleShowForm={handleShowForm} handleSubmit={handleSubmit} />
      ) : (
        <TableComponent columns={column} data={users} flattenRow={flattenPrescriptionRow} filename={"user-prescription-file"} />
      )}

      {/* Update Status Modal */}
      {openQueryUpdateForm && (
        <Modal open={openQueryUpdateForm} onClose={() => setOpenQueryUpdateForm(false)}>
          <Box sx={{ ...modalStyle }}>
            <Typography variant="h6" gutterBottom>Update Status</Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value={"open"}>Open</MenuItem>
                <MenuItem value={"testbooked"}>Book Test</MenuItem>
                <MenuItem value={"closed"}>Close</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={seen === true}
                  onChange={(e) => setSeen(e.target.checked ? true : false)}
                />
              }
              label={seen ? "Seen" : "Not Seen"}
            />


            <TextField label="Remarks" fullWidth margin="normal" value={remarks} onChange={(e) => setRemarks(e.target.value)} />

            <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={() => setOpenQueryUpdateForm(false)} color="secondary">Cancel</Button>
              <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Details Modal */}
      {/* <Modal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)}>
        <Box sx={{ ...modalStyle, width: 350 }}>
          <Typography variant="h6" mb={2}>User Details</Typography>

          <Typography><b>Email:</b> {selectedDetails.email}</Typography>
          <Typography><b>Contact:</b> {selectedDetails.contact}</Typography>
          <Typography><b>Gender:</b> {selectedDetails.gender}</Typography>
          <Typography><b>Age:</b> {selectedDetails.age}</Typography>
          <Typography><b>Address:</b> {selectedDetails.address}</Typography>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={() => setOpenDetailsModal(false)}>Close</Button>
          </Box>
        </Box>
      </Modal> */}
      <UserDetailsModalForPrescription
  open={openDetailsModal}
  onClose={() => setOpenDetailsModal(false)}
  selectedDetails={selectedDetails}
/>

    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  p: 3,
  borderRadius: 2,
  boxShadow: 24,
};

export default ViewPrescription;