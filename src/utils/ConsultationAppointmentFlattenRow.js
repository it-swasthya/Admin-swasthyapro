const flattenConsultationAppointmentRow = (item) => ({
  appointment_id: item.appointment_id ?? "N/A",
  user_id: item.user_id ?? "Guest",
  user_name: `${item.User?.first_name ?? ""} ${item.User?.last_name ?? ""}`.trim() || "N/A",
  user_email:item?.User?.email ?? "N/A",
  user_contact:item?.User?.contact ?? "N/A",
  user_age: item.User?.age ?? "N/A",
  user_gender: item.User?.gender ?? "N/A",

 /* ---------------- DOCTOR ---------------- */
  doctor_name: item.doctor_allotted ?? "N/A",
  doctor_speciality: item.speciality ?? "N/A",
  doctor_qualification: item.Doctor?.qualification ?? "N/A",
  doctor_registration: item.Doctor?.registration ?? "N/A",

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

  /* ---------------- PAYMENT ---------------- */
  doctor_fee: item.doctor_fee ?? 0,
  platform_fee: item.platform_fee ?? 0,
  gst: item.gst ?? 0,
  total_amount: item.total_amount ?? 0,
  payment_mode: item.payment_mode ?? "N/A",
  payment_status: item.payment_status ?? "N/A",

  send_invoice: item.send_invoice,
  createdAt: item.createdAt ?? null,
});



export default flattenConsultationAppointmentRow; 

