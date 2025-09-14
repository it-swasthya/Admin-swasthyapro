export const RadiologyAppointmentFlattenRow = (appointment) => ({
  id: appointment.id,
  fullName: `${appointment.user?.first_name || ''} ${appointment.user?.last_name || ''}`.trim(),
  contact: appointment.user?.contact || '',
  email: appointment.user?.email || '',
  labName: appointment.lab?.lab_name || '',
  testDetails: appointment.test_name || [], 
  slotTime: appointment.slot_time,
  totalAmount: appointment.total_amount,
  netAmount: appointment.net_amount,
  paymentStatus: appointment.payment_status,
  reportStatus: appointment.report_status,
  createdAt: appointment.createdAt,
});
