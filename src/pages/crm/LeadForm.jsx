import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Autocomplete,
  MenuItem
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

const labelStyle = {
  color: "#070d14ff",
  fontWeight: 300,
  "&.Mui-focused": { color: "#0d47a1" }
};

const LeadForm = () => {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [form, setForm] = useState({
    user: null,
    department: "",
    cases: "",
    assignedTo: []
  });

  const [remarkText, setRemarkText] = useState("");
  const [remarkDate, setRemarkDate] = useState("");
  const [remarks, setRemarks] = useState({});

  /* =========================
     SEARCH USERS (API)
  ========================= */
  const searchUsers = async (value) => {
    setSearchText(value);

    if (!value || value.length < 2) {
      setUsers([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.swasthyapro.com/api/user/search/details?name=${value}`
      );

      if (res.data?.users) {
        const mapped = res.data.users.map((u) => ({
          id: u.User_id,
          name:
            u.Full_name ||
            u.full_name ||
            `${u.first_name || ""} ${u.last_name || ""}`.trim(),
          email: u.email || "",
          contact: u.contact || "",
          gender: u.gender || ""
        }));

        setUsers(mapped);
      }
    } catch (err) {
      console.error("User search failed", err);
    }
  };

  /* =========================
     ADD REMARK WITH CUSTOM DATE
  ========================= */
  const addRemark = () => {
    if (!remarkText.trim()) return;
    if (!remarkDate) {
      Swal.fire("Missing Date", "Please select a date for the remark", "warning");
      return;
    }

    const formattedDate = new Date(remarkDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    setRemarks((prev) => ({
      ...prev,
      [formattedDate]: remarkText
    }));

    setRemarkText("");
    setRemarkDate("");
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user) {
      Swal.fire("Missing User", "Please select a user", "warning");
      return;
    }

    const payload = {
      user_id: form.user.id,
      department: form.department,
      cases: form.cases,
      assignedTo: form.assignedTo,
      priority: form.priority,
      remarks
    };

    try {
      await axios.post(
        "https://api.swasthyapro.com/api/query/lead/add-lead",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire("Success", "Lead created successfully", "success");
      navigate("/lead-crm");
    } catch (err) {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 750, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        Create Lead
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* USER SEARCH */}
        <Box mb={3}>
          <Autocomplete
            options={users}
            value={form.user}
            onInputChange={(e, value) => searchUsers(value)}
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            getOptionLabel={(option) => `${option.name}`}
            onChange={(e, value) => setForm({ ...form, user: value })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search User"
                placeholder="Type name..."
                required
                InputLabelProps={{ sx: labelStyle }}
              />
            )}
          />
        </Box>

        {/* USER DETAILS */}
        {form.user && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mb: 3
            }}
          >
            <TextField label="Email" value={form.user.email} disabled />
            <TextField label="Contact No" value={form.user.contact} disabled />
            <TextField label="Gender" value={form.user.gender} disabled />
          </Box>
        )}

        {/* DEPARTMENT */}
        <Box mb={3}>
          <TextField
            select
            label="Department"
            fullWidth
            required
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            InputLabelProps={{ sx: labelStyle }}
          >
            <MenuItem value="pathology">Pathology</MenuItem>
            <MenuItem value="radiology">Radiology</MenuItem>
            <MenuItem value="hospital">Hospital</MenuItem>
            <MenuItem value="cghs">CGHS</MenuItem>
          </TextField>
        </Box>
        <Box mb={3}>
          <TextField
            select
            label="Priority"
            fullWidth
            required
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            InputLabelProps={{ sx: labelStyle }}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
        </Box>

        {/* CASE TYPE */}
        <Box mb={3}>
          <TextField
            label="Case Type"
            fullWidth
            required
            value={form.cases}
            onChange={(e) => setForm({ ...form, cases: e.target.value })}
            InputLabelProps={{ sx: labelStyle }}
          />
        </Box>

        {/* ASSIGNED TO */}
        <Box mb={3}>
          <Autocomplete
            multiple
            options={["Sunil Gupta", "Vivek Gupta", "Amrit Kaur"]} 
            value={form.assignedTo}
            onChange={(event, newValue) =>
              setForm({ ...form, assignedTo: newValue }) 
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  key={option}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assigned To"
                placeholder="Select users"
                InputLabelProps={{ sx: labelStyle }}
              />
            )}
          />
        </Box>


        {/* REMARKS */}
        <Box mb={2} display="flex" gap={2} alignItems="center">
          <TextField
            type="date"
            value={remarkDate}
            onChange={(e) => setRemarkDate(e.target.value)}
            InputLabelProps={{ sx: labelStyle }}
          />
          <TextField
            label="Add Remark"
            fullWidth
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
          />

          <Button size="large" variant="outlined" onClick={addRemark}>
            +Add
          </Button>
        </Box>

        <Box mt={2} mb={3}>
          {Object.entries(remarks).map(([date, text]) => (
            <Chip key={date} label={`${date}: ${text}`} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        {/* ACTIONS */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate("/lead-crm")}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit Lead
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default LeadForm;
