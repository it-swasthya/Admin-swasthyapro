import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
  Divider,
  Typography,
  TextareaAutosize,
} from "@mui/material";

const AddParameterModal = ({ open, onClose, onSubmit, selectedTest }) => {
  const [fields, setFields] = useState("");

  const handleChange = (value) => {
    setFields(value);
  };

  const handleSubmit = () => {
    onSubmit(fields);
    onClose();
    setFields("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          alignItems="center"
          textAlign="center"
        >
          <Typography variant="h6" color="primary">
            Add Parameters For
          </Typography>
          <Box display="flex" gap={2}>
            <Chip
              label={`Test: ${selectedTest?.test_name?.toUpperCase()}`}
              variant="outlined"
              sx={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                backgroundColor: "primary.main",
                color: "white",
                px: 1,
              }}
            />
            <Chip
              label={`Facility: ${selectedTest?.facility_name?.toUpperCase()}`}
              variant="outlined"
              sx={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                backgroundColor: "secondary.main",
                color: "white",
                px: 1,
              }}
            />
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="subtitle1" color="textDanger">
            Enter parameters : Enter Data In CSV format
          </Typography>
          <TextareaAutosize
            minRows={6}
            value={fields}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g., Hemoglobin ,WBC ,Platelets..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddParameterModal;
