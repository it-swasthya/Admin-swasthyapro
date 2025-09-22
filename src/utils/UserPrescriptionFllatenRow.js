const flattenPrescriptionRow = (item) => ({
  name: item.name || 'Guest',
  contact: item.details || 'N/A',  // <-- saved as 'contact'
  createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
  prescription_link: item.prescription_link || 'N/A',
  status: item.status || 'N/A',
  seen: item.seen ? 'Seen' : 'Not Seen',
  remark: item.remarks || 'N/A',
});

export default flattenPrescriptionRow;
