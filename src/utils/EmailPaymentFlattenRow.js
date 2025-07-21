// utils/flattenPaymentRow.js

const flattenPaymentRow = (payment) => ({
  Payment_ID: payment.id || 'N/A',
  Invoice_ID: payment.invoice_id || 'N/A',
  Date: payment.createdAt
    ? new Date(payment.createdAt).toLocaleString()
    : 'N/A',
  Email: payment.email || 'N/A',
  Name: payment.name || 'N/A',
  Tests_Count: Array.isArray(payment.tests) ? payment.tests.length : 0,
  Packages: Array.isArray(payment.packages)
    ? payment.packages.map((p) => p.name).join(', ')
    : 'N/A',
  Amount: payment.amount !== undefined ? `₹${payment.amount}` : 'N/A',
  Payment_Method: payment.payment_method || 'N/A',
  Payment_Status: payment.payment_status || 'N/A',
});

export default flattenPaymentRow;
