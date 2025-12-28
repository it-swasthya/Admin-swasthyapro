import { useState } from "react";
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
  Box,
  Chip
} from "@mui/material";
import { Eye, Plus } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RemarksPopup = ({ remarks = {}, lead_id }) => {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(null);
  const [text, setText] = useState("");
  const [localRemarks, setLocalRemarks] = useState(remarks);
  const [loading, setLoading] = useState(false);

  const handleAddRemark = async () => {
    if (!date || !text) return alert("Date and remark required");

    const formattedDate = dayjs(date).format("DD MMM YYYY");

    try {
      setLoading(true);

      await axios.post(
        `https://api.swasthyapro.com/api/query/leads/add-remark/${lead_id}`,
        { date: formattedDate, text },
        { headers: { "Content-Type": "application/json" } }
      );

      setLocalRemarks(prev => ({
        ...prev,
        [formattedDate]: text,
      }));

      setShowForm(false);
      setDate(null);
      setText("");

    } catch (err) {
      alert("Failed to add remark");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="View Remarks">
        <IconButton onClick={() => setOpen(true)} size="small">
          <Eye size={18} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          Lead Remarks
          <Button
            size="small"
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => setShowForm(!showForm)}
          >
            Add
          </Button>
        </DialogTitle>

        <DialogContent>
          {showForm && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={2} mb={3}>
                <DatePicker
                  label="Remark Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />

                <TextField
                  label="Remark"
                  multiline
                  rows={2}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  size="small"
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={handleAddRemark}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Remark"}
                </Button>
              </Stack>

              <Divider />
            </LocalizationProvider>
          )}

          <Stack spacing={1.5} mt={2}>
            {Object.keys(localRemarks).length > 0 ? (
              Object.entries(localRemarks).map(([date, text]) => (
                <Box
                  key={date}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid #eee",
                    backgroundColor: "#fafafa"
                  }}
                >
                  <Chip
                    label={date}
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="body2">
                    {text}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                No remarks added yet
              </Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemarksPopup;