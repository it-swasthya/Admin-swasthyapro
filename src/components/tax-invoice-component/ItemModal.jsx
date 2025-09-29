import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ItemsModal = ({ open, handleClose, items }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Invoice Items</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {items && items.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Emp Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>HSN/SAC</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate (₹)</TableCell>
                <TableCell>Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.employeeName}</TableCell>
                  <TableCell>{item.empCode}</TableCell>
                  <TableCell>{item.desc}</TableCell>
                  <TableCell>{item.hsnSac}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.qty * item.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography>No items found</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ItemsModal;
