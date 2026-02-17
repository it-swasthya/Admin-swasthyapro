import { useState } from "react";
import { Box, Tabs, Tab, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import DoctorTable from "../table/DoctorTable";
import HospitalTable from "../table/HospitalTable";
import CreateDoctorDialog from "../../pages/consultation/CreateDoctorDialog";
import CreateHospitalDialog from "../../pages/consultation/CreateHospitalDialog";

export default function CreateAppointment() {
  const [tab, setTab] = useState(0);
  const [openDoctor, setOpenDoctor] = useState(false);
  const [openHospital, setOpenHospital] = useState(false);

  const handleOpen = () => {
    if (tab === 0) {
      setOpenDoctor(true);
    } else {
      setOpenHospital(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 4,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Doctor & Hospital Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            fontWeight: 600,
          }}
        >
          {tab === 0 ? "Create Doctor" : "Create Hospital"}
        </Button>
      </Box>

      {/* Styled Tabs Container */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          // borderRadius: 3,
          // backgroundColor: "#ffffff",
          // border: "1px solid #e2e8f0",
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          TabIndicatorProps={{
            style: {
              height: 3,
              borderRadius: 3,
            },
          }}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
              minHeight: 48,
            },
          }}
        >
          {/* Slider Tabs */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              width: 320,
              backgroundColor: "#e2e8f0",
              borderRadius: "12px",
              p: 0.5,
            }}
          >
            {/* Sliding Background */}
            <Box
              sx={{
                position: "absolute",
                top: 4,
                left: tab === 0 ? 4 : "50%",
                width: "50%",
                height: "calc(100% - 8px)",
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />

            {/* Doctors Button */}
            <Box
              onClick={() => setTab(0)}
              sx={{
                flex: 1,
                textAlign: "center",
                py: 1.2,
                zIndex: 1,
                cursor: "pointer",
                fontWeight: 600,
                color: tab === 0 ? "#0f172a" : "#64748b",
                transition: "0.3s",
              }}
            >
              Doctors
            </Box>

            {/* Hospitals Button */}
            <Box
              onClick={() => setTab(1)}
              sx={{
                flex: 1,
                textAlign: "center",
                py: 1.2,
                zIndex: 1,
                cursor: "pointer",
                fontWeight: 600,
                color: tab === 1 ? "#0f172a" : "#64748b",
                transition: "0.3s",
              }}
            >
              Hospitals
            </Box>
          </Box>
        </Tabs>
      </Paper>

      {/* Table Section */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
        }}
      >
        {tab === 0 && <DoctorTable />}
        {tab === 1 && <HospitalTable />}
      </Box>

      {/* Popups */}
      <CreateDoctorDialog
        open={openDoctor}
        handleClose={() => setOpenDoctor(false)}
      />

      <CreateHospitalDialog
        open={openHospital}
        handleClose={() => setOpenHospital(false)}
      />
    </Box>
  );
}
