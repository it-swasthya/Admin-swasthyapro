import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LeadTable from "./LeadTable";

const AllLeads = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          gap: 2
        }}
      >
        {/* Empty left space to match layout */}
        <Box />

        {/* Create Lead Button */}
        <Button
          variant="contained"
          onClick={() => navigate("/create-lead")}
        >
          + Create Lead
        </Button>
      </Box>

      {/* Lead Table (DEFAULT VIEW) */}
      <Box sx={{ mt: 2 }}>
        <LeadTable />
      </Box>
    </Box>
  );
};

export default AllLeads;
