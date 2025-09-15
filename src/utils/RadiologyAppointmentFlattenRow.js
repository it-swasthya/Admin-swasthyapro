export const RadiologyAppointmentFlattenRow = (appointment) => [
  appointment.id,
  appointment.name,
  appointment.contact,
  appointment.email,
  appointment.department,
  appointment.facility,
  appointment.prescription_file,
  appointment.createdAt,
];
