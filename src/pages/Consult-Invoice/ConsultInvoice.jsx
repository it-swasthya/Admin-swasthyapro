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

     

    
      const spdocInvoices = allInvoices.filter((inv) => {
        const id = inv?.id?.toString().trim().toUpperCase();
        return id && id.startsWith("SPDOC");
      });

    

     
      setInvoices(spdocInvoices);

    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Consult Invoices"));
    getInvoices();
  }, []);

  const column = getInvoiceTableColumns(getInvoices);

  return (
    <TableComponent
      columns={column}
      data={invoices} 
      loading={loading} 
      flattenRow={flattenConsultInvoiceRow}
      filename={"consult-invoice-file"}
    />
  );
};

export default ConsultInvoiceTable;