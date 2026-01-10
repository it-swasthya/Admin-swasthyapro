




import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import TableComponent from "../../components/table/Table";
import { getLeadTableColumns } from "../../components/columns/LeadTableColumns";
import flattenLeadRow from "../../utils/FlattenLeadRow";
import { changeNavValue } from "../../Redux/reducer";
import Swal from "sweetalert2";

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
      Swal.fire("Error", "Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("Leads"));
    getLeads();
  }, []);

  // =========================
  // UPDATE LEAD WITH DROPDOWN
  // =========================
 const handleUpdate = async (lead) => {
  const { lead_id, status, deal_done, priority, markedAs } = lead;

  const { value: formValues } = await Swal.fire({
    title: "Update Lead",
    html: `
      <div style="
        display:flex;
        flex-direction:column;
        gap:14px;
        text-align:left;
        padding-top:10px;
      ">
        <div>
          <label style="font-size:13px;font-weight:600;">Status</label>
          <select id="swal-status" style="
            width:100%;
            padding:10px;
            border-radius:6px;
            border:1px solid #ccc;
            margin-top:4px;
          ">
            <option value="Open" ${status === "Open" ? "selected" : ""}>Open</option>
            <option value="Closed" ${status === "Closed" ? "selected" : ""}>Closed</option>
          </select>
        </div>

        <div>
          <label style="font-size:13px;font-weight:600;">Priority</label>
          <select id="swal-priority" style="
            width:100%;
            padding:10px;
            border-radius:6px;
            border:1px solid #ccc;
            margin-top:4px;
          ">
            <option value="High" ${priority === "High" ? "selected" : ""}>High</option>
            <option value="Medium" ${priority === "Medium" ? "selected" : ""}>Medium</option>
            <option value="Urgent" ${priority === "Urgent" ? "selected" : ""}>Urgent</option>
            <option value="Critical" ${priority === "Critical" ? "selected" : ""}>Critical</option>
          </select>
        </div>

         <div>
          <label style="font-size:13px;font-weight:600;"> Deal Done</label>
          <select id="swal-deal_done" style="
            width:100%;
            padding:10px;
            border-radius:6px;
            border:1px solid #ccc;
            margin-top:4px;
          ">
          <option value="No" ${deal_done === "no" ? "selected" : ""}>No</option>
          <option value="Yes" ${deal_done === "yes" ? "selected" : ""}>Yes</option>
            
          </select>
        </div>

        <div>
          <label style="font-size:13px;font-weight:600;">Seen Status</label>
          <select id="swal-markedAs" style="
            width:100%;
            padding:10px;
            border-radius:6px;
            border:1px solid #ccc;
            margin-top:4px;
          ">
            <option value="Seen" ${markedAs === "Seen" ? "selected" : ""}>Seen</option>
            <option value="Unseen" ${markedAs === "Unseen" ? "selected" : ""}>Unseen</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Update",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#1976d2",
    cancelButtonColor: "#9e9e9e",
    focusConfirm: false,
    preConfirm: () => ({
      status: document.getElementById("swal-status").value,
      priority: document.getElementById("swal-priority").value,
      markedAs: document.getElementById("swal-markedAs").value,
      deal_done:document.getElementById("swal-deal_done").value,
    }),
  });

  if (formValues) {
    try {
      await axios.put(
        `https://api.swasthyapro.com/api/query/lead/update-lead/${lead_id}`,
        formValues
      );
      Swal.fire("Updated", "Lead updated successfully", "success");
      getLeads();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update lead", "error");
    }
  }
};


  // =========================
  // DELETE LEAD
  // =========================
  const handleDelete = async (lead) => {
    const { lead_id } = lead;
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the lead permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `https://api.swasthyapro.com/api/query/lead/delete-lead/${lead_id}`
        );
        Swal.fire("Deleted!", "Lead has been deleted.", "success");
        getLeads();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete lead", "error");
      }
    }
  };

  const columns = getLeadTableColumns(handleUpdate, handleDelete);

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
