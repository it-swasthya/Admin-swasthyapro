import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../../Redux/reducer";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

import axios from "axios";
import Swal from "sweetalert2";
import TableComponent from "../../components/table/Table";
import { getHospitalAppointmentTableColumns } from "../../components/columns/HospitalAppointmentColumn";
import HospitalAppointmentflattenRow from "../../utils/HospitalAppointmentFlattenRow";
import AddHospitalModal from "../../components/hospital-table-component/addHospital/AddHospitalModal";
import HospitalRecordsModal from "../../components/hospital-table-component/HospitalRecordModal/HospitalRecordModal";
import UpdateHospitalRecordModal from "../../components/hospital-table-component/updateRecord/UpdateRecord";

const API_URL =
  "https://api.swasthyapro.com/api/appointment/hospital-record";

const HospitalAppointmentTable = () => {
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seletectedAppointment, setSelectedAppointment] = useState();
  const [hospitalModalOpen, setHospitalModalOpen] = useState(false);
  const [openHospitalRecord, setOpenHospitalRecord] = useState(false);
  const [records, setRecords] = useState([]);
    const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const showLoader = () => {
    Swal.fire({
      title: "Loading appointments…",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const closeLoaderIfOpen = () => {
    if (Swal.isVisible() && Swal.isLoading()) {
      Swal.close();
    }
  };

  const getHospitalAppointment = useCallback(async (signal) => {
    try {
      setLoading(true);
      showLoader();
      const res = await axios.get(API_URL, { signal });
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setAppointment(list);
    } catch (err) {
      if (axios.isCancel?.(err) || err?.name === "CanceledError") return;

      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while fetching appointments.";

      await Swal.fire({
        icon: "error",
        title: "Failed to load",
        text: apiMsg,
        confirmButtonText: "OK",
      });

      setAppointment([]);
    } finally {
      setLoading(false);
      closeLoaderIfOpen();
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getHospitalAppointment(controller.signal);
    dispatch(changeNavValue("Hospital-Appointment"));
    return () => {
      controller.abort();
      closeLoaderIfOpen();
    };
  }, [dispatch, getHospitalAppointment]);

  const onAddHospital = (row) => {
    setSelectedAppointment(row);
    setHospitalModalOpen(true);
  };

  const handleViewHospitalRecordsModal = async (row) => {
        setSelectedAppointment(row);
    setOpenHospitalRecord(true);
          setRecords(row.Hospital_records);

   
  };

  const addHospital = async ({ admitDate, hospitalName }) => {
    try {
      Swal.fire({
        title: "Please wait...",
        text: "Creating      admission...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        "https://api.swasthyapro.com/api/appointment/ipd/create-appointment",
        {
          appointment_id: seletectedAppointment.id,
          hospital_name: hospitalName,
          admit_date: admitDate,
        }
      );
      if (response.status === 201) {
        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Hospital added successfully!",
          text: "The admission record has been created.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Failed to add hospital",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleUpdateRecord = (record) => {

    setSelectedRecord(record);
    setOpenHospitalRecord(false)
    setUpdateOpen(true);
  };

// };

  const columns = getHospitalAppointmentTableColumns({
    onAddHospital,
    handleViewHospitalRecords:handleViewHospitalRecordsModal,
  });

  return (
    <>
      <TableComponent
        columns={columns}
        data={Array.isArray(appointment) ? appointment : []}
        flattenRow={HospitalAppointmentflattenRow}
        filename={"Hospital-Appointments"}
        loading={loading}
      />
      <AddHospitalModal
        open={hospitalModalOpen}
        handleClose={() => setHospitalModalOpen(false)}
        onSubmit={addHospital}
      />
      <HospitalRecordsModal
        open={openHospitalRecord}
        handleClose={() => setOpenHospitalRecord(false)}
        loading={loading}
        patient={seletectedAppointment}
        records={records}
        onUpdateRecord={(record) => handleUpdateRecord(record)} // 👈 add this
      />
       {selectedRecord && (
        <UpdateHospitalRecordModal
          open={updateOpen}
          handleClose={() => setUpdateOpen(false)}
          record={selectedRecord}
          getHospitalAppointment={getHospitalAppointment}
        />
      )}
    </>
  );
};

export default HospitalAppointmentTable;
