import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";


const StatusFormModal = ({ open, onClose, row, getQueries }) => {
  const [status, setStatus] = useState(row.status ? row.status : "open");
  const [seen, setSeen] = useState(row.seen ? row.seen : false);
  const [remarks, setRemarks] = useState(row.remarks ? row.remarks : "");
  const [assignTo, setAssignTo] = useState(row.assignedTo ? row.assignTo : "");

  const handleSubmit = async () => {
    const formData = {
      status,
      seen,
      remarks,
      assignTo,
    };
    try {
      const response = await axios.put(
        `https://api.swasthyapro.com/api/query/update-fields/${row.id}`,
        {
          status: formData.status.toLowerCase() || null,
          seen: formData.seen,
          remarks: formData.remarks || null,
          assignedTo: formData.assignTo || null,
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Status Updated",
          icon: "success",
        });
        await getQueries();
      }
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="change-status-modal"
      aria-describedby="change-status-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%",
            sm: "80%",
            md: 600,
          },
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 },
          border: "1px solid #333",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Update Status {row.name}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="testbook">Book Test</MenuItem>
            <MenuItem value="closed">Close</MenuItem>
            <MenuItem value="follow up">Follow Up</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={seen}
              onChange={(e) => setSeen(e.target.checked)}
            />
          }
          sx={{ color: "text.primary" }}
          label="Seen"
        />

        <TextField
          label="Remarks"
          fullWidth
          margin="normal"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <TextField
          label="Assign To"
          fullWidth
          margin="normal"
          value={assignTo}
          onChange={(e) => setAssignTo(e.target.value)}
        />

        <Box
          mt={2}
          display="flex"
          justifyContent="flex-end"
          flexWrap="wrap"
          gap={1}
        >
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StatusFormModal;
