import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InvoiceTable from "../user-invoices/UserInvoices";
import TaxInvoiceTable from "../tax-invoices/Tax-invoices-table";
import ConsultInvoiceTable from "../Consult-Invoice/ConsultInvoice";

const AllInvoices = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Tabs + Buttons Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 3,
          gap: 2,
        }}
      >
        {/* LEFT: Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Invoices" />
          <Tab label="Tax Invoices" />
          <Tab label="Consult Invoices" />
        </Tabs>

        {/* RIGHT: Buttons Group */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            width: { xs: "100%", sm: "auto" },
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/generate-consult-invoices")}
            className="h-[40px] bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
          >
            + Create Consult Invoice
          </button>

          <button
            onClick={() => navigate("/generate-invoices")}
            className="h-[40px] bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
          >
            + Create Invoice
          </button>
        </Box>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <InvoiceTable />}
        {tabIndex === 1 && <TaxInvoiceTable />}
        {tabIndex === 2 && <ConsultInvoiceTable />}
      </Box>
    </Box>
  );
};

export default AllInvoices;
