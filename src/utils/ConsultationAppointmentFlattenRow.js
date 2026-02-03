const flattenConsultationAppointmentRow = (item) => ({
    
  appointment_id: item.appointment_id ?? "N/A",

  user_id: item.user_id ?? "Guest",

   

  user_name: `${item.User?.first_name ?? ""} ${item.User?.last_name ?? ""}`.trim() || "N/A",


  doctor_allotted: item.doctor_allotted ?? "N/A",
  speciality: item.speciality ?? "N/A",
  symptoms: item.symptoms ?? "N/A",
  appointment_date: item.appointment_date ?? "N/A",
  time_slot: item.time_slot ?? "N/A",
  plan_id: item.plan_id ?? "N/A",
  remaining_consult: item.remaining_consult ?? "N/A",
  booking_mode: item.mode ?? "N/A",
  diagnosis: item.diagnosis ?? "N/A",
  doctor_advice: item.doctor_advice ?? "N/A",
  prescription_link: item.prescription_link ?? "N/A",
  status: item.status ?? "N/A",
  createdAt: item.createdAt ?? null,
});



export default flattenConsultationAppointmentRow;

