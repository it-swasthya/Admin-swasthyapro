import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInvoiceTableColumns } from "../../components/columns/UserInvoiceColumn";
import TableComponent from "../../components/table/Table";
import flattenInvoiceRow from "../../utils/UsersInvoicesFlattenRow";
import { changeNavValue } from "../../Redux/reducer";
import axios from "axios";
import flattenConsultInvoiceRow from "../../utils/flattenConsultInvoiceRow";

const ConsultInvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]); // NEW
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getInvoices = async () => {
  try {
    setLoading(true);

    const response = await axios.get(
      "https://api.swasthyapro.com/api/invoice/get-invoices"
    );

    const allInvoices = response.data?.invoices || [];

    // FILTER
    const spdocInvoices = allInvoices.filter((inv) =>
      inv.id?.toString().trim().toUpperCase().startsWith("SPDOC")
    );

    console.log("FILTERED 👉", spdocInvoices);

    setInvoices(spdocInvoices);

  } catch (error) {
    console.error("Failed to fetch invoices:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    dispatch(changeNavValue("Consult Invoices")); // optional rename
    getInvoices();
  }, []);

  const column = getInvoiceTableColumns(getInvoices);

  return (
    <TableComponent
      columns={column}
      data={filteredInvoices} // USE FILTERED DATA
      flattenRow={flattenConsultInvoiceRow}
      filename={"consult-invoice-file"}
    />
  );
};

export default ConsultInvoiceTable;