import React, { useState, useMemo } from "react";
import { TextField, Button, Typography, Chip, Box, Card } from "@mui/material";

const MobileViewQuery = ({ data, handleShowForm }) => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredData = useMemo(() => {
    let filtered = [...data];
    const lowerSearch = search.trim().toLowerCase();

    if (lowerSearch) {
      filtered = filtered.filter((item) => {
        const createdAt = new Date(item.createdAt)
          .toLocaleString()
          .toLowerCase();
        return (
          item.name?.toLowerCase().includes(lowerSearch) ||
          item.email?.toLowerCase().includes(lowerSearch) ||
          item.phone?.toLowerCase().includes(lowerSearch) ||
          item.query?.toLowerCase().includes(lowerSearch) ||
          item.status?.toLowerCase().includes(lowerSearch) ||
          item.seen?.toString().toLowerCase().includes(lowerSearch) ||
          item.remarks?.toLowerCase().includes(lowerSearch) ||
          item.assignedTo?.toLowerCase().includes(lowerSearch) ||
          createdAt.includes(lowerSearch)
        );
      });
    }

    if (startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((item) => new Date(item.createdAt) <= end);
    }

    return filtered;
  }, [data, search, startDate, endDate]);

  return (
    <div
      className="max-w-full mx-auto bg-white shadow-lg rounded-lg"
      style={{ marginTop: "-10px", flexDirection: "column", height: "100%" }}
    >
      <div className="mb-2 flex justify-between items-center flex-wrap gap-2 p-2">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 200 }}
        />
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 145 }}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 145 }}
        />
      </div>

      <Box sx={{ pb: 7 }}>
        {filteredData.map((row) => (
          <Card
            key={row.id}
            sx={{ mb: 3, p: 3, boxShadow: 4, borderRadius: 4 }}
          >
            <Typography variant="h6" fontWeight={700}>
              {row.name}{" "}
              <span style={{ fontWeight: 400, fontSize: "14px" }}>
                ({row.User_id ? "User" : "Guest"})
              </span>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {new Date(row.createdAt).toLocaleString()}
            </Typography>

            <Typography variant="body2">
              <strong>Email:</strong> {row.email || "N/A"}
            </Typography>

            <Typography variant="body2">
              <strong>Phone:</strong> {row.phone || "Not Provided"}
            </Typography>

            <Typography variant="body2">
              <strong>Query:</strong> {row.query || "Not Provided"}
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">
                <strong>Status:</strong>
              </Typography>
              <Chip
                label={row.status}
                size="small"
                color={
                  row.status === "open"
                    ? "success"
                    : row.status === "closed"
                      ? "error"
                      : "default"
                }
                sx={{ height: 20, borderRadius: 10 }}
              />
            </Box>

            <Typography variant="body2">
              <strong>Seen:</strong> {row.seen ? "Yes" : "No"}
            </Typography>

            <Typography variant="body2">
              <strong>Remarks:</strong> {row.remarks || "No remarks"}
            </Typography>

            <Typography variant="body2">
              <strong>Assigned To:</strong> {row.assignedTo || "Not Assigned"}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleShowForm(row)}
              sx={{ mt: 1, borderRadius: "20px", textTransform: "none" }}
            >
              Update
            </Button>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export { MobileViewQuery };
