const flattenPrescriptionRow = (item) => ({
  Full_Name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'N/A',
  Contact: item.contact || 'N/A',
  Email: item.email || 'N/A',
  Address: item.address || 'N/A',
  Prescription_Name: item.prescription?.name || 'N/A',
  Date: item.prescription?.createdAt
    ? new Date(item.prescription.createdAt).toLocaleDateString()
    : 'N/A',
  Details: item.prescription?.details || 'N/A',
  Prescription_Link: item.prescription?.prescription_link || 'N/A',
  Status: item.prescription?.status || 'N/A',
  Seen: item.prescription?.seen ? 'Seen' : 'Not Seen',
  Remark: item.prescription?.remarks || 'N/A',
});

export default flattenPrescriptionRow;
