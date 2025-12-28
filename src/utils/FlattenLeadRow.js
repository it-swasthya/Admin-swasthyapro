// const flattenLeadRow = (lead) => ({
//   Lead_ID: lead.lead_id || "N/A",
//   User_ID: lead.user_id || "N/A",
  
//   Department: lead.department || "N/A",
//   Case_Type: lead.cases || "N/A",
//   Status: lead.status || "N/A",
//   Assigned_To: Array.isArray(lead.assignedTo)
//     ? lead.assignedTo.join(", ")
//     : "N/A",
//   Seen_Status: lead.markedAs || "N/A",
//   Remarks: lead.remarks
//     ? Object.entries(lead.remarks)
//         .map(([date, remark]) => `${date}: ${remark}`)
//         .join(" | ")
//     : "N/A",
//   Created_At: lead.createdAt
//     ? new Date(lead.createdAt).toLocaleString()
//     : "N/A",
// });

// export default flattenLeadRow;



const flattenLeadRow = (lead) => {
  const employee = lead.employee || {};

  const fullName =
    [employee.first_name, employee.last_name].filter(Boolean).join(" ") ||
    "N/A";

  return {
    Lead_ID: lead.lead_id || "N/A",

    User_ID: lead.user_id || "N/A",

    Employee_Name: fullName,
    Employee_Contact: employee.contact || "N/A",

    Department: lead.department || "N/A",
    Case_Type: lead.cases || "N/A",
    Status: lead.status || "N/A",
    Deal: lead.deal_done || "N/A",

    Assigned_To: Array.isArray(lead.assignedTo)
      ? lead.assignedTo.join(", ")
      : "N/A",

    Seen_Status: lead.markedAs || "N/A",

    Remarks:
      lead.remarks && typeof lead.remarks === "object"
        ? Object.entries(lead.remarks)
            .map(([date, remark]) => `${date}: ${remark}`)
            .join(" | ")
        : lead.remarks || "N/A",

    Created_At: lead.createdAt
      ? new Date(lead.createdAt).toLocaleString()
      : "N/A",
  };
};

export default flattenLeadRow;
