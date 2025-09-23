import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 3,
};

const GstModal = ({ open, handleClose, gstData }) => {
  if (!gstData) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            GST Details
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Tax Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rate (%)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>CGST</TableCell>
              <TableCell>{gstData.cgst_rate || 'N/A'}</TableCell>
              <TableCell>{gstData.cgst_amount ? `₹${gstData.cgst_amount}` : '0.00'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>SGST</TableCell>
              <TableCell>{gstData.sgst_rate || 'N/A'}</TableCell>
              <TableCell>{gstData.sgst_amount ? `₹${gstData.sgst_amount}` : '0.00'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IGST</TableCell>
              <TableCell>{gstData.igst_rate || 'N/A'}</TableCell>
              <TableCell>{gstData.igst_amount ? `₹${gstData.igst_amount}` : '0.00'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default GstModal;
