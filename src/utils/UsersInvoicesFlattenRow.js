// utils/flattenInvoiceRow.js
const flattenInvoiceRow = (invoice) => ({
  Invoice_ID: invoice.id || "N/A",
  User_ID: invoice.user_id || "N/A",
  Booking_ID: invoice.booking_id || invoice.radiology_booking_id || "N/A", // fallback
  Payment_ID: invoice.payment_id || "N/A",
  Invoice_Type: invoice.invoice_type || "N/A",
  Time: invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : '',
  Billing_Name: invoice.billing_name || "N/A",
  Billing_Phone: invoice.billing_phone || "N/A",
  Billing_Address: invoice.billing_address || "N/A",
  Billing_State: invoice.state || "N/A",
  Total_Amount:
    invoice.total_amount !== undefined
      ? `₹${invoice.total_amount}`
      : '₹0',
});

export default flattenInvoiceRow;
