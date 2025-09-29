import React, { useState } from "react";
import { TextField, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { FileUp } from "lucide-react";
import OrderStatusCell from "../../components/OrderStatusCell";

const OrderCardMObile = ({
  orders = [],
  showTestsPopup,
  handleEditPayment,
  handleUserReportUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text
      .toString()
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: "linear-gradient(90deg, #f7b733, #fc4a1a)",
              color: "white",
              padding: "2px 4px",
              borderRadius: "4px",
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
  };

  const filtered = orders.filter((order) => {
    const query = searchQuery.trim().toLowerCase();
    return !query
      ? true
      : [
          order.booking_id,
          order.displayName,
          order.email,
          order.contact,
          order.paymentMethod,
        ]
          .filter(Boolean)
          .some((field) => field.toString().toLowerCase().includes(query));
  });

  return (
    <div className="max-w-full mx-auto p-2">
      <div className="mb-4">
        <TextField
          label="Search orders"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        filtered.map((order, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white shadow-sm p-4 mb-4"
          >
            <div className="flex justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Order ID:{" "}
                  <span className="text-blue-600">
                    {highlightText(order.booking_id, searchQuery)}
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  {highlightText(order.displayName, searchQuery)}
                </p>
              </div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                <span>{order.paymentMethod}</span>
                {order.paymentMethod?.toLowerCase() === "cash" &&
                  order.paymentStatus?.toLowerCase() === "pending" && (
                    <Tooltip title="Edit method">
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleEditPayment(order);
                        }}
                        sx={{ padding: 0 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
              </div>
            </div>

            <div className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1 mb-2">
              <p>
                <span className="font-medium text-gray-500">Email:</span>{" "}
                {highlightText(order.email, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Contact:</span>{" "}
                {highlightText(order.contact, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Amount Paid:</span>{" "}
                ₹{highlightText(order.amount_paid, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Booked Date:</span>{" "}
                {highlightText(order.bookDate, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Scheduled:</span>{" "}
                {highlightText(order.displayDate, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Time Slot:</span>{" "}
                {highlightText(order.timeSlot, searchQuery)}
              </p>
              <p>
                <span className="font-medium text-gray-500">Tests:</span>{" "}
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => showTestsPopup(order.testNamesArray)}
                >
                  {order.testNamesArray?.length} item
                  {order.testNamesArray?.length !== 1 && "s"} ▼
                </span>
              </p>
            </div>

            <div className="border-t border-dashed border-gray-200 my-2" />

            <OrderStatusCell order={order} />

            <div className="mt-2 flex justify-end">
              {order.report_shared ? (
                <div
                  className="px-3 py-1 text-xs font-semibold rounded-full"
                  style={{
                    backgroundColor: "#e6f4ea",
                    color: "#2e7d32",
                    border: "1px solid #a5d6a7",
                    fontSize: "10px",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  Report Shared
                </div>
              ) : order.sample_collected &&
                order.sample_received_by_lab &&
                order.dml_assigned ? (
                <Tooltip title="Upload report">
                  <IconButton
                    size="small"
                    onClick={() => handleUserReportUpload(order)}
                  >
                    <FileUp size={20} />
                  </IconButton>
                </Tooltip>
              ) : (
                <IconButton size="small" disabled>
                  <FileUp size={20} />
                </IconButton>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderCardMObile;
