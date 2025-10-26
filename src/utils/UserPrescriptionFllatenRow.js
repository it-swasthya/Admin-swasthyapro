// const flattenPrescriptionRow = (item) => ({
//   name: item.name || 'Guest',
//   contact: item.details || 'N/A',  // <-- saved as 'contact'
//   createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
//   prescription_link: item.prescription_link || 'N/A',
//   status: item.status || 'N/A',
//   seen: item.seen ? 'Seen' : 'Not Seen',
//   remark: item.remarks || 'N/A',
// });

// export default flattenPrescriptionRow;


export default function flattenPrescriptionRow(row) {
  return {
    id: row.User_id,
    name: row.name || 'Guest',
    email: row.details?.email || 'N/A',
    contact: row.details?.contact || 'N/A',
    address: row.details?.address || 'N/A',
    gender: row.details?.gender || 'N/A',
    age: row.details?.age || 'N/A',
    prescription: row.prescription_link || "",
    status: row.status,
    seen: row.seen ? "Seen" : "Not Seen",
    remarks: row.remarks,
    createdAt: row.createdAt,
  };
}

