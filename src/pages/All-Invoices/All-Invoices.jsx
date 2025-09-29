import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InvoiceTable from "../user-invoices/UserInvoices";
import TaxInvoiceTable from "../tax-invoices/Tax-invoices-table";

const AllInvoices = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Tabs and Button in a single row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Invoices" />
          <Tab label="Tax Invoices" />
        </Tabs>

        <button
          onClick={() => navigate("/generate-invoices")}
          className="h-[40px] sm:h-auto bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
        >
          + Create Invoice
        </button>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <InvoiceTable />}
        {tabIndex === 1 && <TaxInvoiceTable />}
      </Box>
    </Box>
  );
};

export default AllInvoices;
