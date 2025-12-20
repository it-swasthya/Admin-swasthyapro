import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import UserDetailModal from "../../components/user-info-modal/UserDetailsModal.jsx";
import { getOrderTableColumns } from "../../components/columns/UserOrderColumn";
import TableComponent from "../../components/table/Table";
import { userOrderFlattenRow } from "../../utils/UserOrderFlattenRow.js";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { changeNavValue } from "../../Redux/reducer.js";
import UserFamilyAccordion from "../../components/userFamilyDetails/UserFamilDetails.jsx";
import { CloseOutlined } from "@mui/icons-material";
import UserReportUplaod from "../../components/user-report-upload-modal/UserReportUploadModal.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import OrderCardMObile from "../../mobile-components/user-orders/MobileViewUsersOrders.jsx";
const OrderExportTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [uploadReportModalOpen, setUploadReportModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const handleFamilyInfoClick = (user) => {
    setSelectedUser(user);
    setFamilyModalOpen(true);
  };
  const [openMethodStatus, setMethodStatus] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter orders when dates change
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt); // or order.bookDate if you prefer
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true;
      });
      setFilteredOrders(filtered);
    }
  }, [startDate, endDate, orders]);

  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      Swal.fire({
        title: "Loading Orders...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch("https://api.swasthyapro.com/api/book/all-user");
      const data = await res.json();

      const formatted = (data.testBookings || []).map((order) => {
        const testNames = order.Cart.testNames ? order.Cart.testNames : [];
        return {
          ...order,
          displayName: `${order.User.first_name} ${order.User.last_name}`,
          displayDate:
            new Date(order.scheduled_date).toLocaleDateString() || "N/A",
          report: order.report || null,
          bookDate: new Date(order.createdAt).toLocaleString() || "N/A",
          totalPrice: order.Cart.totalPrice || "N/A",
          testNamesText: testNames.join(", ") || "N/A",
          testNamesArray: testNames || "N/A",
          paymentMethod: order.Payment?.payment_method || "N/A",
          paymentStatus: order.Payment?.payment_status || "N/A",
          email: order.User.email || "N/A",
          dmlName: order.dml_person || "N/A",
          dmlEmail: order.dmail_email || "N/A",
          emailBody: order.email_body || "N/A",
          coupon: order.coupon || "N/A",
          timeslot: order.timeslot || "N/A",
          reschedule:
            order.rescheduled_date !== null
              ? new Date(order.rescheduled_date).toLocaleString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "Not Rescheduled",
        };
      });

      setOrders(formatted);
      setFilteredOrders(formatted);
      Swal.close();
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("User Orders"));
    fetchOrders();
  }, []);

  const handleInfo = (order) => {
    setSelectedOrder(order);
    setInfoModalOpen(true);
  };

  const handleUserReportUpload = (user) => {
    setSelectedUser(user);
    setUploadReportModalOpen(true);
  };

  const handleEditPayment = (order) => {
    setSelectedOrder(order);
    setMethodStatus(true);
  };

  const handleMarkReportShared = async (order, status) => {
    const result = await Swal.fire({
      title: `Mark as ${status ? "Shared" : "Unshared"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(
        "https://api.swasthyapro.com/api/report/mark-report-shared",
        {
          booking_id: order.booking_id,
          status,
        }
      );
      Swal.fire(
        "Success",
        `Marked as ${status ? "Shared" : "Unshared"}`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", err?.message || "Update failed", "error");
    } finally {
      fetchOrders();
    }
  };

  const showTestsPopup = (tests) => {
    try {
      const testList =
        Array.isArray(tests) && tests.length
          ? tests
              .map(
                (test, index) =>
                  `<li><strong>${index + 1}</strong> - ${test}</li>`
              )
              .join("")
          : "<li>No test data available.</li>";

      Swal.fire({
        title: `Test Names`,
        html: `<ol style="text-align: left; padding-left: 1rem;">${testList}</ol>`,
        confirmButtonText: "Close",
        width: "40rem",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Unable to parse test names.",
        icon: "error",
      });
    }
  };

  const columns = getOrderTableColumns({
    onInfoClick: handleInfo,
    onEditPaymentClick: handleEditPayment,
    onReportShareClick: handleMarkReportShared,
    getOrders: fetchOrders,
    showTests: showTestsPopup,
    onFamilyClick: handleFamilyInfoClick,
    handleUserReportUpload,
  });

  const updatePaymentMethod = async () => {
    setMethodStatus(false);
    const mergeIdsArray = [
      ...selectedOrder.Cart.testIds,
      ...selectedOrder.Cart.packageIds,
    ];
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const updatePaymentResponse = await axios.post(
        "https://api.swasthyapro.com/api/book/payment/update-cod",
        {
          payment_id: selectedOrder.payment_id,
          mode: selectedPaymentMethod,
        }
      );

      Swal.fire({
        text: "Status updated",
        icon: "success",
        timer: 1000,
      });
      fetchOrders();

      if (updatePaymentResponse.status === 200) {
        const cartResponse = await axios.post(
          "https://api.swasthyapro.com/api/cart/get-cart-tests",
          {
            test_ids: mergeIdsArray.map((test) => test),
          }
        );
        const mergeCartItems = [
          ...cartResponse.data.corporate_package,
          ...cartResponse.data.corporate_test,
        ];

        // Prepare test data
        const testData = mergeCartItems.map((data) => ({
          price: Number(data.market_price_range || data.market_price),
          test_name: data.test_name || data.package_name,
          quantity: 1,
          discount: Number(data.discount_percentage),
          net_price: Number(
            data.after_discount_price || data.swasthyapro_price
          ), // already discounted price
        }));

        // Calculate subtotal (before discount)
        const subtotal = testData
          .reduce((sum, test) => sum + (test.price || 0), 0)
          .toFixed(2);

        // Total discount = subtotal - sum of net prices
        const totalNetPrice = testData
          .reduce((sum, test) => sum + (test.net_price || 0), 0)
          .toFixed(2);

        const total_discount = (subtotal - totalNetPrice).toFixed(2);

        // Grand total should be sum of net prices
        const grand_total = totalNetPrice;

        // Create invoice
        const createInvoiceResponse = await axios.post(
          "https://api.swasthyapro.com/api/invoice/create-invoice",
          {
            payment_id: selectedOrder.Payment.payment_id,
            user_id: selectedOrder.User.User_id,
            booking_id: selectedOrder.booking_id,
            dmlCharges: selectedOrder.dml_charges || 0,
          }
        );

        await axios.post(
          "https://api.swasthyapro.com/api/invoice/gen-invoice",
          {
            invoice_no: createInvoiceResponse.data.invoice.id,
            date: new Date().toISOString().split("T")[0],
            customer_name: selectedOrder.User.first_name,
            customer_id: selectedOrder.User.User_id,
            customer_gstn: "NA",
            billing_details: testData,
            subtotal,
            total_discount,
            gst_percentage: "NA",
            gst: "NA",
            grand_total:
              Number(grand_total) + Number(selectedOrder.dml_charges) || 0,
            payment_made:
              Number(grand_total) + Number(selectedOrder.dml_charges) || 0,
            payment_status: "Paid",
            account_no: "NA",
            ifsc: "NA",
            bank_name: "NA",
            visit_type: "NA",
            dmlCharges: selectedOrder.dml_charges || 0,
          }
        );

         await  axios.post('https://api.swasthyapro.com/api/invoice/send-invoice-whatsapp',{
        "to": "91"+selectedOrder.User.contact,
        "invoice_no": createInvoiceResponse.data.invoice.id,
        "customer_name": selectedOrder.User.first_name,
        "email": selectedOrder.User.email,
            })

        const sendInvoice = await axios.post(
          "https://api.swasthyapro.com/api/invoice/send-invoice",
          {
            email: selectedOrder.User.email,
            invoice_no: createInvoiceResponse.data.invoice.id,
            customer_name: selectedOrder.User.first_name,
          }
        );
        Swal.fire({
          text: "Status updated",
          icon: "success",
          timer: 1000,
        });
        fetchOrders();
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        text: "Something went wrong",
        icon: "error",
        timer: 1000,
      });
    } finally {
      Swal.close();
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label style={{ marginRight: "8px", fontWeight: 500 }}>From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <label style={{ marginRight: "8px", fontWeight: 500 }}>To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {(startDate || endDate) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredOrders(orders);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isMdDown ? (
        <OrderCardMObile
          orders={orders}
          filteredOrders={filteredOrders}
          showTestsPopup={showTestsPopup}
          handleEditPayment={handleEditPayment}
          handleUserReportUpload={handleUserReportUpload}
        />
      ) : (
        <TableComponent
          columns={columns}
          data={filteredOrders}
          flattenRow={userOrderFlattenRow}
          filename={"user-order-file"}
        />
      )}

      {selectedOrder && (
        <UserDetailModal
          isOpen={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          user={selectedOrder}
        />
      )}

      <Dialog
        open={familyModalOpen}
        onClose={() => setFamilyModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedUser?.displayName || "User Info"}
          <IconButton
            aria-label="close"
            onClick={() => setFamilyModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <UserFamilyAccordion
              userData={selectedUser}
              row={selectedUser}
              getOrders={fetchOrders}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openMethodStatus} onClose={() => setMethodStatus(false)}>
        <DialogTitle>Edit Payment Method</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              label="Payment Method"
            >
              {[
                "UPI",
                "Credit Card",
                "Debit Card",
                "Net Banking",
                "Cash",
                "EMI",
                "COD - Cash",
                "COD - Paytm",
                "COD - UPI",
              ].map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMethodStatus(false)}>Cancel</Button>
          <Button onClick={updatePaymentMethod} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadReportModalOpen}
        onClose={() => setUploadReportModalOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setUploadReportModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <UserReportUplaod
              userData={selectedUser}
              getOrders={fetchOrders}
              onClose={() => setUploadReportModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderExportTable;
