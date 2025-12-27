import { useState } from "react";
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableRow, TableHead, Typography } from "@mui/material";
import { Eye } from "lucide-react";

const RemarksPopup = ({ remarks }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="View Remarks">
        <IconButton onClick={handleOpen} size="small">
          <Eye size={18} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Remarks</DialogTitle>
        <DialogContent>
          {remarks && Object.keys(remarks).length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Remark</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(remarks).map(([date, text]) => (
                  <TableRow key={date}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{text}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No remarks available</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemarksPopup;
