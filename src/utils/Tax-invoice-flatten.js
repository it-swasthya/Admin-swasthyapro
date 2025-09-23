// utils/flattenInvoiceRow.js

const flattenInvoiceRow = (invoice) => ({
  Invoice_ID: invoice.invoice_id || 'N/A',
  Invoice_Date: invoice.invoice_date
    ? new Date(invoice.invoice_date).toLocaleDateString()
    : 'N/A',
  Due_Date: invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString()
    : 'N/A',
  Place_of_Supply: invoice.place_of_supply || 'N/A',
  Bill_To_Name: invoice.bill_to_name || 'N/A',
  Bill_To_Address: invoice.bill_to_address || 'N/A',
  Bill_To_GSTIN: invoice.bill_to_gstin || 'N/A',
  Items: Array.isArray(invoice.employee_items) && invoice.employee_items.length > 0
    ? invoice.employee_items
        .map(
          (item) =>
            `${item.employeeName} (${item.empCode}) - ${item.desc} - Qty: ${item.qty} @ ₹${item.rate}`
        )
        .join(' | ')
    : 'N/A',
  Subtotal: invoice.subtotal ? `₹${invoice.subtotal}` : 'N/A',
  CGST: invoice.cgst_amount ? `₹${invoice.cgst_amount}` : 'N/A',
  SGST: invoice.sgst_amount ? `₹${invoice.sgst_amount}` : 'N/A',
  IGST: invoice.igst_amount ? `₹${invoice.igst_amount}` : 'N/A',
  Total: invoice.total ? `₹${invoice.total}` : 'N/A',
  Created_At: invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleString()
    : 'N/A',
  Updated_At: invoice.updatedAt
    ? new Date(invoice.updatedAt).toLocaleString()
    : 'N/A',
});

export default flattenInvoiceRow;
