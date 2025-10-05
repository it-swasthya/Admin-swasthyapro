export const RadiologyBookingFlattenRow = (booking) => ({
  id: booking.id || "N/A",
  user_id: booking.user_id || "N/A",
  fullName:
    `${booking.user?.first_name || ""} ${booking.user?.last_name || ""}`.trim() || "N/A",
  contact: booking.user?.contact || "N/A",
  email: booking.user?.email || "N/A",
  labName: booking.lab?.lab_name || "N/A",
  
  testDetails: JSON.stringify(booking.test_name),
  slotTime: booking.slot_time || "N/A",
  additional_discount: booking.additional_discount
    ? "₹" + booking.additional_discount
    : "N/A",
  totalAmount: booking.total_amount ? "₹" + booking.total_amount : "N/A",
  netAmount: booking.net_amount ? "₹" + booking.net_amount : "N/A",
  paymentStatus: booking.payment_status || "N/A",
  paymentMethod: booking.payment_method || "N/A",
  booking_status: booking.booking_status || "N/A",
  rescheduled_date: booking.rescheduled_date
    ? new Date(booking.rescheduled_date).toLocaleDateString()
    : "N/A",
  reportStatus: booking.report_shared ? "Yes" : "No",
  booking_date: booking.booking_date || "N/A",
});
