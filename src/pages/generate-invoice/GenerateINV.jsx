import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../../Redux/reducer";
import { DeleteIcon } from "lucide-react";
import Swal from "sweetalert2";

const GenerateINV = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeNavValue("Create-INV"));
  }, [dispatch]);

  const [rows, setRows] = useState([
    {
      id: 1,
      employeeName: "",
      empCode: "",
      desc: "",
      hsnSac: "998312",
      qty: 1,
      rate: 0,
    },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceDate: "",
    placeOfSupply: "",
    dueDate: "",
    billTo: "",
    gstin: "",
    clientAddress: "",
  });

  const [useIGST, setUseIGST] = useState(false);
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [igstRate, setIgstRate] = useState(18);

  const handleInvoiceChange = (field, value) => {
    setInvoiceDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        employeeName: "",
        empCode: "",
        desc: "",
        hsnSac: "998312",
        qty: 1,
        rate: 0,
      },
    ]);
  };
  const handleRemoveRow = (id) => {
    if (rows.length === 1) {
      setRows([
        {
          id: 1,
          employeeName: "",
          empCode: "",
          desc: "",
          hsnSac: "998312",
          qty: 1,
          rate: 0,
        },
      ]);
      return;
    }
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Totals
  const totalAmount = rows.reduce((sum, row) => sum + row.qty * row.rate, 0);

  const cgstAmount = useIGST ? 0 : (totalAmount * cgstRate) / 100;
  const sgstAmount = useIGST ? 0 : (totalAmount * sgstRate) / 100;
  const igstAmount = useIGST ? (totalAmount * igstRate) / 100 : 0;

  const totalGST = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = totalAmount + totalGST;
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginTop: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const handleSubmit = async () => {
    // --- Validation ---
    const missingFields = [];

    // Check invoice header fields
    if (!invoiceDetails.invoiceDate) missingFields.push("Invoice Date");
    if (!invoiceDetails.dueDate) missingFields.push("Due Date");
    if (!invoiceDetails.placeOfSupply) missingFields.push("Place of Supply");
    if (!invoiceDetails.billTo) missingFields.push("Bill To");
    if (!invoiceDetails.clientAddress) missingFields.push("Client’s Address");
    if (!invoiceDetails.gstin) missingFields.push("GSTIN");

    // Check rows
    rows.forEach((row, index) => {
      if (!row.employeeName)
        missingFields.push(`Employee Name (Row ${index + 1})`);
      if (!row.empCode) missingFields.push(`Emp. Code (Row ${index + 1})`);
      if (!row.desc) missingFields.push(`Description (Row ${index + 1})`);
      if (!row.hsnSac) missingFields.push(`HSN/SAC (Row ${index + 1})`);
      if (!row.qty || row.qty <= 0)
        missingFields.push(`Qty (Row ${index + 1})`);
      if (!row.rate || row.rate <= 0)
        missingFields.push(`Rate (Row ${index + 1})`);
    });

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Required Fields",
        html: `<ul style="text-align:left; line-height:1.6; color:#444">
              ${missingFields.map((f) => `<li>• ${f}</li>`).join("")}
             </ul>`,
      });
      return;
    }

    // --- If all good, show loading ---
    Swal.fire({
      title: "Submitting Invoice...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // const payload = {
      //   supplier: {
      //     name: "SwasthyaPro",
      //     address: "D 90 LAJPAT NAGAR1 NEW DELHI-110024",
      //     gstin: "07CAYPR5470F1Z0",
      //     pan: "CAYPR5470F",
      //     email: ["account@swasthyapro.com", "info@swasthyapro.com"],
      //     phone: "7838109906",
      //   },
      //   invoice: {
      //     number: "SP/2025/010",
      //     date: invoiceDetails.invoiceDate,
      //     placeOfSupply: invoiceDetails.placeOfSupply,
      //     dueDate: invoiceDetails.dueDate,
      //   },
      //   billTo: {
      //     name: invoiceDetails.billTo,
      //     address: invoiceDetails.clientAddress,
      //     gstin: invoiceDetails.gstin,
      //   },
      //   items: rows.map((row) => ({
      //     employeeName: row.employeeName,
      //     empCode: row.empCode,
      //     desc: row.desc,
      //     hsnSac: row.hsnSac,
      //     qty: row.qty,
      //     rate: row.rate,
      //   })),
      //   bank: {
      //     accountName: "SwasthyaPro",
      //     bankName: "HDFC Bank",
      //     accountNo: "123456789012",
      //     ifsc: "HDFC0001234",
      //     upi: "swasthyapro@upi",
      //   },
      //   declaration:
      //     "We declare that this invoice shows the actual price of the services rendered and that all particulars are true and correct.",
      //   contentDisposition: "inline",
      // };

      const payload = {
        invoice: {
          number: "TAXINV1",
          date: invoiceDetails.invoiceDate,
          placeOfSupply: invoiceDetails.placeOfSupply,
          dueDate: invoiceDetails.dueDate,
        },

        billTo: {
          name: invoiceDetails.billTo,
          address: invoiceDetails.clientAddress,
          gstin: invoiceDetails.gstin,
        },

        items: rows.map((row) => ({
          employeeName: row.employeeName,
          empCode: row.empCode,
          desc: row.desc,
          hsnSac: row.hsnSac,
          qty: row.qty,
          rate: row.rate,
        })),

        taxes: {
          cgst:!useIGST ?cgstRate : null,
          sgst:!useIGST ? sgstRate : null,
          igst:useIGST ? igstRate : null,
          totalGst: totalGST || 0,
        },
      };

      const res = await fetch(
        "https://api.swasthyapro.com/api/invoice/tax-invoices/generate-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf, application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const ct = res.headers.get("content-type") || "";

      // Case 1: proper PDF stream
      if (ct.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setInvoiceDetails({
          invoiceDate: "",
          placeOfSupply: "",
          dueDate: "",
          billTo: "",
          gstin: "",
          clientAddress: "",
        });
        setRows([
          {
            id: 1,
            employeeName: "",
            empCode: "",
            desc: "",
            hsnSac: "998312",
            qty: 1,
            rate: 0,
          },
        ]);

        Swal.fire({
          icon: "success",
          title: "Invoice Submitted!",
          text: "Invoice has been successfully created.",
        });
        window.open(url);
        return;
      }

      // Case 2: JSON with base64 or %PDF text
      const json = await res.json();
      let blob;

      if (json.data) {
        const s = json.data.trim();
        if (s.startsWith("%PDF-")) {
          blob = new Blob([s], { type: "application/pdf" });
        } else {
          // base64 fallback
          const byteChars = atob(s);
          const byteArray = new Uint8Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
          }
          blob = new Blob([byteArray], { type: "application/pdf" });
        }
      }

      // setInvoiceDetails({
      //   invoiceDate: "",
      //   placeOfSupply: "",
      //   dueDate: "",
      //   billTo: "",
      //   gstin: "",
      //   clientAddress: "",
      // });
      // setRows([
      //   {
      //     id: 1,
      //     employeeName: "",
      //     empCode: "",
      //     desc: "",
      //     hsnSac: "998312",
      //     qty: 1,
      //     rate: 0,
      //   },
      // ]);
 
      Swal.fire({
        icon: "success",
        title: "Invoice Submitted!",
        text: "Invoice has been successfully created.",
      });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting the invoice.",
      });
    }
  };

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      {/* <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Invoice</h2> */}

      {/* Invoice Header Section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>
            Invoice Date
          </label>
          <input
            type="date"
            value={invoiceDetails.invoiceDate}
            onChange={(e) => handleInvoiceChange("invoiceDate", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>Due Date</label>
          <input
            type="date"
            value={invoiceDetails.dueDate}
            onChange={(e) => handleInvoiceChange("dueDate", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", color: "#555" }}>
            Place of Supply
          </label>
          <input
            type="text"
            placeholder="Delhi / ETC"
            value={invoiceDetails.placeOfSupply}
            onChange={(e) =>
              handleInvoiceChange("placeOfSupply", e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontWeight: "600", color: "#555" }}>Bill To</label>
          <input
            type="text"
            value={invoiceDetails.billTo}
            onChange={(e) => handleInvoiceChange("billTo", e.target.value)}
            style={{ ...inputStyle, fontWeight: "600" }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontWeight: "600", color: "#555" }}>
            Client’s Address
          </label>
          <textarea
            rows={3}
            value={invoiceDetails.clientAddress}
            onChange={(e) =>
              handleInvoiceChange("clientAddress", e.target.value)
            }
            placeholder="Enter client’s address"
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ fontWeight: "600", color: "#555" }}>GSTIN</label>
          <input
            type="text"
            value={invoiceDetails.gstin}
            onChange={(e) => handleInvoiceChange("gstin", e.target.value)}
            placeholder="Enter GST Number"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Table Section */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f6f8", textAlign: "center" }}>
              {[
                "S. No.",
                "Employee Name",
                "Emp. Code",
                "Desc",
                "HSN/SAC",
                "Rate (₹)",
                "Qty",
                "Amount (₹)",
                "Action",
              ].map((head) => (
                <th
                  key={head}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="text"
                    value={row.employeeName}
                    onChange={(e) =>
                      handleChange(row.id, "employeeName", e.target.value)
                    }
                    style={inputStyle}
                  />
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="text"
                    value={row.empCode}
                    onChange={(e) =>
                      handleChange(row.id, "empCode", e.target.value)
                    }
                    style={inputStyle}
                  />
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="text"
                    value={row.desc}
                    onChange={(e) =>
                      handleChange(row.id, "desc", e.target.value)
                    }
                    style={inputStyle}
                  />
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="text"
                    value={row.hsnSac}
                    onChange={(e) =>
                      handleChange(row.id, "hsnSac", e.target.value)
                    }
                    style={inputStyle}
                  />
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(row.id, "rate", Number(e.target.value))
                    }
                    style={{ ...inputStyle, width: "90px", textAlign: "right" }}
                  />
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(row.id, "qty", Number(e.target.value))
                    }
                    style={{ ...inputStyle, width: "70px", textAlign: "right" }}
                  />
                </td>

                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <strong>{row.qty * row.rate}</strong>
                </td>
                <td style={{ padding: "10px", border: "1px solid #eee" }}>
                  <button
                    onClick={() => handleRemoveRow(row.id)}
                    // disabled={rows.length === 1}
                    style={{
                      background: "#e53935",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    <DeleteIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: "#fafafa" }}>
              <td
                colSpan="7"
                style={{
                  textAlign: "right",
                  padding: "12px",
                  border: "1px solid #ddd",
                  fontWeight: "600",
                }}
              >
                Total
              </td>
              <td
                style={{
                  padding: "12px",
                  border: "1px solid #ddd",
                  fontWeight: "600",
                }}
              >
                {totalAmount}
              </td>
              <td style={{ border: "1px solid #ddd" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={useIGST}
            onChange={(e) => setUseIGST(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Use IGST (instead of CGST + SGST)
        </label>

        {!useIGST && (
          <div style={{ marginTop: "12px", display: "flex", gap: "20px" }}>
            <div>
              <label>CGST %</label>
              <input
                type="number"
                value={cgstRate}
                onChange={(e) => setCgstRate(Number(e.target.value))}
                style={{
                  width: "80px",
                  marginLeft: "8px",
                  border: "1px solid #ccc", // darker grey
                  padding: "4px 6px",
                  borderRadius: "4px",
                }}
              />
              <span> → ₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div>
              <label>SGST %</label>
              <input
                type="number"
                value={sgstRate}
                onChange={(e) => setSgstRate(Number(e.target.value))}
                style={{
                  width: "80px",
                  marginLeft: "8px",
                  border: "1px solid #ccc", // darker grey
                  padding: "4px 6px",
                  borderRadius: "4px",
                }}
              />
              <span> → ₹{sgstAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {useIGST && (
          <div style={{ marginTop: "12px" }}>
            <label>IGST %</label>
            <input
              type="number"
              value={igstRate}
              onChange={(e) => setIgstRate(Number(e.target.value))}
              style={{
                width: "80px",
                marginLeft: "8px",
                border: "1px solid #ccc", // darker grey
                padding: "4px 6px",
                borderRadius: "4px",
              }}
            />
            <span> → ₹{igstAmount.toFixed(2)}</span>
          </div>
        )}

        <div style={{ marginTop: "16px", fontWeight: "600" }}>
          Total GST: ₹{totalGST.toFixed(2)}
        </div>
        <div style={{ marginTop: "6px", fontWeight: "700", fontSize: "16px" }}>
          Grand Total: ₹{grandTotal.toFixed(2)}
        </div>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <button
          onClick={handleAddRow}
          style={{
            padding: "10px 18px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Row
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 18px",
            background: "#43a047",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
};

export default GenerateINV;
