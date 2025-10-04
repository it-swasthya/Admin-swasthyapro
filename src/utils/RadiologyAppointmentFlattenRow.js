export const RadiologyAppointmentFlattenRow = (appointment) => [
  appointment.id || "N/A",
  appointment.name || "N/A",
  appointment.contact || "N/A",
  appointment.email || "N/A",
  appointment.department || "N/A",
  appointment.facility || "N/A",
  Array.isArray(appointment.prescription_file)
    ? appointment.prescription_file.join(", ")
    : typeof appointment.prescription_file === "object" && appointment.prescription_file !== null
      ? JSON.stringify(appointment.prescription_file)
      : appointment.prescription_file || "N/A",

  appointment.createdAt || "N/A",
];
