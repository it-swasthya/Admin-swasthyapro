// import React from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
// };

// const ItemsModal = ({ open, handleClose, items }) => {
//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box sx={style}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6">Invoice Items</Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>

//         {items && items.length > 0 ? (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Employee Name</TableCell>
//                 <TableCell>Emp Code</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>HSN/SAC</TableCell>
//                 <TableCell>Qty</TableCell>
//                 <TableCell>Rate (₹)</TableCell>
//                 <TableCell>Total (₹)</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {items.map((item, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{item.employeeName}</TableCell>
//                   <TableCell>{item.empCode}</TableCell>
//                   <TableCell>{item.desc}</TableCell>
//                   <TableCell>{item.hsnSac}</TableCell>
//                   <TableCell>{item.qty}</TableCell>
//                   <TableCell>{item.rate}</TableCell>
//                   <TableCell>{item.qty * item.rate}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <Typography>No items found</Typography>
//         )}
//       </Box>
//     </Modal>
//   );
// };

// export default ItemsModal;


import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", md: 900 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  maxHeight: "85vh",
  display: "flex",
  flexDirection: "column",
};

const ItemsModal = ({ open, handleClose, items }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Invoice Items
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Scrollable Table */}
        {items && items.length > 0 ? (
          <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee</b></TableCell>
                  <TableCell><b>Emp Code</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>HSN/SAC</b></TableCell>
                  <TableCell align="center"><b>Qty</b></TableCell>
                  <TableCell align="right"><b>Rate (₹)</b></TableCell>
                  <TableCell align="right"><b>Total (₹)</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.employeeName}</TableCell>
                    <TableCell>{item.empCode}</TableCell>
                    <TableCell>{item.desc}</TableCell>
                    <TableCell>{item.hsnSac}</TableCell>
                    <TableCell align="center">{item.qty}</TableCell>
                    <TableCell align="right">
                      ₹{Number(item.rate).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      ₹{(item.qty * item.rate).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center" color="text.secondary">
            No items found
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ItemsModal;
