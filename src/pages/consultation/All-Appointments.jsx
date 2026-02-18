// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TableComponent from "../../components/table/Table";
// import flattenConsultationAppointmentRow from "../../utils/ConsultationAppointmentFlattenRow";
// import { getConsultationTableColumns } from "../../components/columns/AllAppointmentsColumn";
// import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";
// import { changeNavValue } from "../../Redux/reducer";

// const ConsultationAllAppointmentTable = () => {
//     // console.log(flattenConsultationAppointmentRow,"@@@@@@@");
//     // console.log(getConsultationTableColumns,"!!!!!!!!");
    
    
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();      
 

// const fetchAppointments = async () => {
//   try {
//     setLoading(true);
//     const res = await axios.get(
//       "https://api.swasthyapro.com/api/appointment/admin/consult/list"
//     );
//     // console.log(res , "res list");
    

//     const flatData = (res?.data?.allAppointments || []).map(
//       flattenConsultationAppointmentRow
//     );
    
//     // console.log(flatData,"sdhsj");

    

//     setAppointments(flatData);
//   } catch (err) {
//     Swal.fire("Error", "Failed to fetch appointments", "error");
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     dispatch(changeNavValue("consultation"));
    

//     fetchAppointments();
   
    
//   }, []);


//   // console.log(Array.isArray(appointments," appointmemt res")); 
  

//   const handleUpdate = (row) => {
//     console.log("Update", row);
//   };

//   const handleDelete = (row) => {
//     console.log("Delete", row);
//   };

//   const columns = getConsultationTableColumns(
//     handleUpdate,
//     handleDelete
//   );

//   return (
//   <TableComponent
//   columns={columns}
//   data={appointments}
//   filename="all-consult-appointments"
//   loading={loading}
//   />

//   );
// };

// export default ConsultationAllAppointmentTable;


import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import TableComponent from "../../components/table/Table";
import flattenConsultationAppointmentRow from "../../utils/ConsultationAppointmentFlattenRow";
import { getConsultationTableColumns } from "../../components/columns/AllAppointmentsColumn";
import { changeNavValue } from "../../Redux/reducer";
import AppointmentForm from "./AppointmentForm";


const ConsultationAllAppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  /* ================= Fetch Appointments ================= */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.swasthyapro.com/api/appointment/admin/consult/list"
      );

      const flatData = (res?.data?.allAppointments || []).map(
        flattenConsultationAppointmentRow
      );

      setAppointments(flatData);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("consultation"));
    fetchAppointments();
  }, []);

  /* ================= Create Appointment ================= */
  const handleCreateAppointment = async (formData) => {
    try {
      setFormLoading(true);

      await axios.post(
        "https://api.swasthyapro.com/api/appointment/admin/consult/create",
        formData
      );

      Swal.fire("Success", "Appointment created successfully", "success");

      setOpen(false);        
      fetchAppointments();   
    } catch (error) {
      Swal.fire("Error", "Failed to create appointment", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = (row) => {
    console.log("Update", row);
  };

  const handleDelete = (row) => {
    console.log("Delete", row);
  };

  const columns = getConsultationTableColumns(
    handleUpdate,
    handleDelete
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="semi-bold">
          All Consultation Appointments
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Create Appointment
        </Button>
      </Box>

      {/* ================= TABLE ================= */}
      <TableComponent
        columns={columns}
        data={appointments}
        filename="all-consult-appointments"
        loading={loading}
      />

      {/* ================= POPUP ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogContent>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Create Appointment
          </Typography>

          <AppointmentForm
            onSubmit={handleCreateAppointment}
            setOpen={setOpen}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsultationAllAppointmentTable;
