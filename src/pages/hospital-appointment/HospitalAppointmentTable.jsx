import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../../Redux/reducer";
import axios from "axios";
import Swal from "sweetalert2";
import TableComponent from "../../components/table/Table";
import { getHospitalAppointmentTableColumns } from "../../components/columns/HospitalAppointmentColumn";
import HospitalAppointmentflattenRow from "../../utils/HospitalAppointmentFlattenRow";

const API_URL =
  "https://api.swasthyapro.com/api/appointment/ipd/all-appointment";

const HospitalAppointmentTable = () => { 
  const dispatch = useDispatch();
  const [appointment,setAppointment] = useState([]);
  const [loading,setLoading] = useState(false);

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
      const list = Array.isArray(res?.data?.allIpdAppointment)
        ? res.data.allIpdAppointment
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

  const columns = getHospitalAppointmentTableColumns({});

  return (
    <TableComponent
      columns={columns}
      data={Array.isArray(appointment) ? appointment : []}
      flattenRow={HospitalAppointmentflattenRow}
      filename={"Hospital-Appointments"}
      loading={loading}
    />
  );
};

export default HospitalAppointmentTable;
