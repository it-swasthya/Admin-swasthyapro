import React, { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../../components/table/Table";
import flattenConsultationAppointmentRow from "../../utils/ConsultationAppointmentFlattenRow";
import { getConsultationTableColumns } from "../../components/columns/AllAppointmentsColumn";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../../Redux/reducer";

const ConsultationAllAppointmentTable = () => {
    // console.log(flattenConsultationAppointmentRow,"@@@@@@@");
    // console.log(getConsultationTableColumns,"!!!!!!!!");
    
    
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
 

const fetchAppointments = async () => {
  try {
    setLoading(true);
    const res = await axios.get(
      "https://api.swasthyapro.com/api/appointment/admin/consult/list"
    );
    console.log(res);
    

    const flatData = (res?.data?.allAppointments || []).map(
      flattenConsultationAppointmentRow
    );
    console.log(flatData,"sdhsj");
    

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


  console.log(Array.isArray(appointments," appointmemt res")); 
  

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
   <TableComponent
  columns={columns}
  data={appointments}
  filename="all-consult-appointments"
  loading={loading}
/>

  );
};

export default ConsultationAllAppointmentTable;
