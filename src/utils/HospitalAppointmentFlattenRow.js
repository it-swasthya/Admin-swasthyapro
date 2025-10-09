const HospitalAppointmentflattenRow = (item) => ({
  name: item.name || "Guest",
  disease: item.disease || "N/A",
  mobile: item.mobile || "N/A",
  email: item.email || "N/A",
  city: item.city || "N/A",
  insurance: item.insurance || false,
  adhar_file: item.adhar_file || null,
  pan_file: item.pan_file || null,
  insurance_file: item.insurance_file || null,
  createdAt: item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : "N/A",
  
});

export default HospitalAppointmentflattenRow;
