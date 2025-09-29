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

  const column = getInvoiceTableColumns({
    handleOpenItemsModal,
    handleOpenGstModal,
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
