export const RadiologyAppointmentFlattenRow = (appointment) => [
  appointment.id,
  appointment.name,
  appointment.contact,
  appointment.email || "N/A",  // fallback to "N/A" if missing
  appointment.department,
  appointment.facility,
  appointment.prescription_file,
  
  appointment.createdAt,
];

