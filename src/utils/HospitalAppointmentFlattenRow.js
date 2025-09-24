const HospitalAppointmentflattenRow = (item) => ({
  name: item.name || "Guest",
  disease: item.disease || "N/A",
  mobile: item.mobile || "N/A",
  email: item.email || "N/A",
  city: item.city || "N/A",
  insurance: item.insurance || false,
  adhar_file: item.adhar_file || "N/A",
  pan_file: item.pan_file || "N/A",
  insurance_file: item.insurance_file || "N/A",
  createdAt: item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : "N/A",
  
});

export default HospitalAppointmentflattenRow;
