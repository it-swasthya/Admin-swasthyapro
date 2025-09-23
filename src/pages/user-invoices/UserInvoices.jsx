import React, { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import { getInvoiceTableColumns } from "../../components/columns/UserInvoiceColumn";
import TableComponent from "../../components/table/Table";
import flattenInvoiceRow from "../../utils/UsersInvoicesFlattenRow";
import { changeNavValue } from "../../Redux/reducer";
import { useNavigate } from "react-router-dom";

// import { changeNavValue } from "../Redux/reducer";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate()
  const dispatch = useDispatch();

  const getInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.swasthyapro.com/api/invoice/get-invoices"
      );
      setInvoices(response.data?.invoices || []);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("User Invoices"));
    getInvoices();
  }, []);

  const column = getInvoiceTableColumns();

  return (
    <>
      
      <TableComponent
      columns={column}
      data={invoices}
      flattenRow={flattenInvoiceRow}
      filename={"user-invoice-file"}
    /></>
    
  );
};

export default InvoiceTable;
