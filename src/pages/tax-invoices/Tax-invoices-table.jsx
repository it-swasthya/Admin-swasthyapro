import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import TableComponent from "../../components/table/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { changeNavValue } from "../../Redux/reducer";
import { useTheme, useMediaQuery } from "@mui/material";
import { getInvoiceTableColumns } from "../../components/columns/Tax-invoice-column";
import flattenInvoiceRow from "../../utils/Tax-invoice-flatten";
import ItemsModal from "../../components/tax-invoice-component/ItemModal";
import GstModal from "../../components/tax-invoice-component/GstModal";

const TaxInvoiceTable = () => {
  const dispatch = useDispatch();
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [openItemsModal, setOpenItemsModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [openGstModal, setOpenGstModal] = useState(false);
  const [selectedGst, setSelectedGst] = useState(null);

  const handleOpenGstModal = (gstData) => {
    setSelectedGst(gstData);
    setOpenGstModal(true);
  };

  const handleCloseGstModal = () => {
    setSelectedGst(null);
    setOpenGstModal(false);
  };

  const getTaxInvoiceData = async () => {
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await axios.get(
        "https://api.swasthyapro.com/api/invoice/tax-invoice/all-inv"
      );
      setInvoices(response.data.data);
    } catch (err) {
      setError("Error fetching Invoices");
      console.error("Error fetching users:", err);
    } finally {
      Swal.close();
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Tax-INV"));
    getTaxInvoiceData();
  }, [dispatch]);

  const handleOpenItemsModal = (items) => {
    setSelectedItems(items || []);
    setOpenItemsModal(true);
  };

  const handleCloseItemsModal = () => {
    setSelectedItems([]);
    setOpenItemsModal(false);
  };

  const changeINVstatus = async (inv, newStatus = "cancelled") => {
  try {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to mark this invoice as ${newStatus.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d33",
    });

    if (!confirmResult.isConfirmed) {
      return; 
    }

    Swal.fire({
      title: "Updating Status...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.patch(
      `https://api.swasthyapro.com/api/invoice/tax-invoices/${inv.invoice_id}/status`,
      { status: newStatus }
    );

    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Invoice status has been updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      getTaxInvoiceData()
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  } catch (err) {
    console.error("Error updating invoice status:", err);

    let errorMsg = "Something went wrong. Please try again later.";
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMsg,
    });
  }
};

 const handleDelete = async (inv) => {
  try {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the invoice.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmResult.isConfirmed) {
      return; 
    }

    Swal.fire({
      title: "Deleting Invoice...",
      text: "Please wait while we remove the invoice.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await axios.delete(
      `https://api.swasthyapro.com/api/invoice/tax-invoices/delete/${inv.invoice_id}`
    );
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The invoice has been successfully deleted.",
        timer: 2000,
        showConfirmButton: false,
      });
      getTaxInvoiceData()
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while deleting the invoice.",
      });
    }
  } catch (err) {
    console.error("Error deleting invoice:", err);

    let errorMsg = "Something went wrong. Please try again later.";
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message;
    }

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMsg,
    });
  }
};

  const column = getInvoiceTableColumns({
    handleOpenItemsModal,
    handleOpenGstModal,
      handleDelete,
  changeINVstatus,
  });

  return (
    <>
      <TableComponent
        columns={column}
        data={invoices}
        flattenRow={flattenInvoiceRow}
        filename={"Tax-invoice file"}
      />

      <ItemsModal
        open={openItemsModal}
        handleClose={handleCloseItemsModal}
        items={selectedItems}
      />
      <GstModal
        open={openGstModal}
        handleClose={handleCloseGstModal}
        gstData={selectedGst}
      />
    </>
  );
};

export default TaxInvoiceTable;
