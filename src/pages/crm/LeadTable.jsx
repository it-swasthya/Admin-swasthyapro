import React, { useEffect, useState } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import TableComponent from "../../components/table/Table";
import { getLeadTableColumns } from "../../components/columns/LeadTableColumns";
import flattenLeadRow from "../../utils/FlattenLeadRow";
import { changeNavValue } from "../../Redux/reducer";

const LeadTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.swasthyapro.com/api/query/lead/get-lead"
      );
      setLeads(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Leads"));
    getLeads();
  }, []);

  const columns = getLeadTableColumns();

  return (
    <TableComponent
      columns={columns}
      data={leads}
      flattenRow={flattenLeadRow}
      filename={"lead-table"}
      loading={loading}
    />
  );
};

export default LeadTable;
