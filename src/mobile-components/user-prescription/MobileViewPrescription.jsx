import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const MobileViewPrescription = ({ users, handleShowForm }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const trimmedQuery = searchQuery.trim();

  const filteredUsers = users.filter((user) => {
    if (!user.Prescriptions?.length) return false;
    if (!trimmedQuery) return true;

    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return (
      fullName.includes(trimmedQuery) ||
      user.contact?.toString().includes(trimmedQuery) ||
      user.email?.toLowerCase().includes(trimmedQuery) ||
      user.address?.toLowerCase().includes(trimmedQuery)
    );
  });

  const flattenedPrescriptions = filteredUsers.flatMap((user) =>
    user.Prescriptions.map((prescription) => ({
      ...user,
      prescription,
    }))
  );

  return (
    <div className="max-w-full mx-auto lg:shadow-lg rounded-lg lg:bg-white p-4 lg:mb-0 mb-12">
      <TextField
        label="Search users"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ maxWidth: 300, mb: 2 }}
        value={searchQuery}
        onChange={handleSearch}
      />

      <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, py: 2 }}>
        {flattenedPrescriptions.length > 0 ? (
          flattenedPrescriptions.map((item, index) => (
            <Card
              key={index}
              elevation={3}
              sx={{
                mb: 3,
                borderRadius: 3,
                transition: "0.3s",
                '&:hover': {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.first_name} {item.last_name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Typography variant="body2"><strong>Contact:</strong> {item.contact}</Typography>
                  <Typography variant="body2"><strong>Email:</strong> {item.email}</Typography>
                  <Typography variant="body2"><strong>Address:</strong> {item.address}</Typography>
                  <Typography variant="body2"><strong>Prescription:</strong> {item.prescription.name}</Typography>
                  <Typography variant="body2"><strong>Date:</strong> {new Date(item.prescription.createdAt).toLocaleDateString()}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {item.prescription.status}</Typography>
                  <Typography variant="body2"><strong>Seen:</strong> {item.prescription.seen ? "Seen" : "Not Seen"}</Typography>
                  <Typography variant="body2"><strong>Remark:</strong> {item.prescription.remarks || "N/A"}</Typography>
                </Box>
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                    onClick={() => handleShowForm(item.prescription)}
                  >
                    Update
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{
              mt: 5,
              py: 5,
              border: "1px dashed #ccc",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            No Prescription Available
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default MobileViewPrescription;
