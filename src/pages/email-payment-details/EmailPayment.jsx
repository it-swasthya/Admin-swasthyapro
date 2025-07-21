import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery, useTheme } from "@mui/material";

import TableComponent from "../../components/table/Table";

import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import flattenPaymentRow from "../../utils/EmailPaymentFlattenRow";
import { getPaymentTableColumns } from "../../components/columns/EmailPaymentColumn";
import { changeNavValue } from "../../Redux/reducer";

const PaymentsTable = () => {
  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Payments by email"));
    setLoading(true);
    axios
      .get("https://api.swasthyapro.com/api/payments/email-payments")
      .then((res) => {
        const data = res.data.data || [];
        setInvoices(data);
      })
      .catch((err) => {
        console.error("Error fetching payment data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showTestsPopup = (data) => {
    console.log(data);
    const testList = Array.isArray(data.tests)
      ? data.tests
          .map(
            (test, index) =>
              `<li><strong>${index + 1}: ${test.name} - </strong>₹${test.price}</li>`
          )
          .join("")
      : "<li>No test data available.</li>";

    Swal.fire({
      title: `Tests booked by ${data.name}`,
      html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
      confirmButtonText: "Close",
      width: "40rem",
    });
  };

  const column = getPaymentTableColumns(showTestsPopup);

  return (
    <>
      <TableComponent
        columns={column}
        data={invoices}
        flattenRow={flattenPaymentRow}
        filename={"user-payment-by-email-file"}
      />
    </>
  );
};

export default PaymentsTable;
