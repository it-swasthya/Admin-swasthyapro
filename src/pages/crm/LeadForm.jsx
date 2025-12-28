import { useState, useMemo, useEffect } from "react";
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
import debounce from "lodash/debounce";

const ASSIGNED_TO_OPTIONS = [
  "Sunil Gupta",
  "Vivek Gupta",
  "Amrit Kaur"
];

const LeadForm = () => {
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================= */
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [form, setForm] = useState({
    user: null,
    department: "",
    cases: "",
    priority: "",
    assignedTo: []
  });

  const [remarks, setRemarks] = useState({});
  const [remarkText, setRemarkText] = useState("");
  const [remarkDate, setRemarkDate] = useState("");

  /* =========================
     API CALL
  ========================= */
  const fetchUsers = async (query) => {
    if (!query || query.length < 2) {
      setUsers([]);
      return;
    }

    try {
      setLoadingUsers(true);

      const res = await axios.get(
        "https://api.swasthyapro.com/api/user/search/details",
        { params: { name: query } }
      );

      const mapped = (res.data?.users || []).map((u) => ({
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
    } catch (err) {
      console.error("User search failed", err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  /* =========================
     DEBOUNCED FUNCTION
  ========================= */
  const debouncedSearch = useMemo(
    () => debounce(fetchUsers, 500),
    []
  );

  /* =========================
     CLEANUP (VERY IMPORTANT)
  ========================= */
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  /* =========================
     ADD REMARK
  ========================= */
  const addRemark = () => {
    if (!remarkText || !remarkDate) {
      Swal.fire("Missing Data", "Remark & date required", "warning");
      return;
    }

    const key = new Date(remarkDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    setRemarks((prev) => ({ ...prev, [key]: remarkText }));
    setRemarkText("");
    setRemarkDate("");
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user) {
      Swal.fire("Error", "Please select a user", "warning");
      return;
    }

    const payload = {
      user_id: form.user.id,
      department: form.department,
      cases: form.cases,
      priority: form.priority,
      assignedTo: form.assignedTo,
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
      Swal.fire("Error", "Failed to create lead", "error");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        Create Lead
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* USER SEARCH */}
        <Box mb={3}>
          <Autocomplete
            options={users}
            loading={loadingUsers}
            value={form.user}
            onInputChange={(e, value) => debouncedSearch(value)}
            onChange={(e, value) =>
              setForm({ ...form, user: value })
            }
            isOptionEqualToValue={(opt, val) => opt.id === val.id}
            getOptionLabel={(option) => option?.name || ""}
            noOptionsText="Type at least 2 characters"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search User"
                placeholder="Start typing name..."
              />
            )}
          />
        </Box>

        {/* USER DETAILS */}
        {form.user && (
          <Box
            mb={3}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2
            }}
          >
            <TextField label="Email" value={form.user.email} disabled />
            <TextField label="Contact" value={form.user.contact} disabled />
            <TextField label="Gender" value={form.user.gender} disabled />
          </Box>
        )}

        {/* DEPARTMENT */}
        <Box mb={3}>
          <TextField
            select
            fullWidth
            label="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          >
            <MenuItem value="pathology">Pathology</MenuItem>
            <MenuItem value="radiology">Radiology</MenuItem>
            <MenuItem value="hospital">Hospital</MenuItem>
            <MenuItem value="cghs">CGHS</MenuItem>
          </TextField>
        </Box>


        {/* CASE */}
        <Box mb={3}>
          <TextField
            fullWidth
            label="Case Type"
            value={form.cases}
            onChange={(e) =>
              setForm({ ...form, cases: e.target.value })
            }
          />
        </Box>

        {/* PRIORITY */}
        <Box mb={3}>
          <TextField
            select
            fullWidth
            label="Priority"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </TextField>
        </Box>

       {/* ASSIGNED TO */}
        <Box mb={3}>
          <Autocomplete
            multiple
            options={ASSIGNED_TO_OPTIONS}
            value={form.assignedTo}
            onChange={(e, value) =>
              setForm({ ...form, assignedTo: value })
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Assigned To" />
            )}
          />
        </Box>

        {/* REMARKS */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            type="date"
            value={remarkDate}
            onChange={(e) => setRemarkDate(e.target.value)}
          />
          <TextField
            fullWidth
            label="Remark"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
          />
          <Button variant="outlined" onClick={addRemark}>
            Add
          </Button>
        </Box>

        <Box mb={3}>
          {Object.entries(remarks).map(([d, r]) => (
            <Chip key={d} label={`${d}: ${r}`} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        {/* ACTIONS */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={() => navigate("/lead-crm")}>Cancel</Button>
          <Button type="submit" variant="contained">
            Submit Lead
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default LeadForm;
