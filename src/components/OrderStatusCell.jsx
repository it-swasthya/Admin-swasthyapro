import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import {
  TableCell,
  Button,
  Box,
  Modal,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Swal from "sweetalert2";
import axios from "axios";
// import UploadModal from "./UploadModal";

import UploadModal from "./UploadModal";
// import useSendSampleMailAPI from "../api/order/order-status";
import {
  useSendSampleMailAPI,
  useSendsendSampleReceivedByLabMailAPI,
} from "../api/order/order-status";

// const { sendSampleMail } = useSendSampleMailAPI();

const OrderStatusCell = ({ order, getOrders }) => {
  const { sendSampleMail } = useSendSampleMailAPI();
  const { sendSampleReceivedByLabMail } =
    useSendsendSampleReceivedByLabMailAPI();

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reportName, setReportName] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [user, setUser] = useState();
  const [reportData, setReportData] = useState({});
  const [reportUserCred, setReportUserCred] = useState({});

  const [originalStatus, setOriginalStatus] = useState();

  const [status, setStatus] = useState({
    dml_assigned: false,
    sample_collected: false,
    sample_received_by_lab: false,
  });

  console.log(status, "status data");

  const disableDMLFields =
    status.dml_assigned &&
    status.sample_collected &&
    status.sample_received_by_lab;
  const hideDMLInputs = status.dml_assigned && status.sample_collected;

  useEffect(() => {
    if (order) {
      setStatus({
        dml_assigned: order.dml_assigned ?? false,
        sample_collected: order.sample_collected ?? false,
        sample_received_by_lab: order.sample_received_by_lab ?? false,
      });

      setOriginalStatus(status);
    }
  }, [order]);
  let [dmlData, setDmlData] = useState({
    date: "",
    dmlName: "",
    dmlContact: "",
    time: "",
  });
  let [dmlEmail, setDMLemail] = useState("");

  const statusFields = [
    { label: "DML assign", key: "dml_assigned" },
    { label: "Sample collected", key: "sample_collected" },
    { label: "Sample received by lab", key: "sample_received_by_lab" },
  ];

  const handleCheckboxChange = (key) => {
    setStatus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpen(false);
    setFile(null);
    setReportName("");
    setPreviewUrl("");
  };

  const updateStatus = async () => {
    const data = {
      ...status,
      booking_id: order.booking_id,
    };

    dmlData = {
      userName: user?.first_name + user?.last_name,
      userEmail: user.email,
      ...dmlData,
    };

    try {
      const response = await axios.patch(
        "https://api.swasthyapro.com/api/report/update-status",
        data,
      );

      if (response.status === 200) {
        const markResponse = await axios.put(
          "https://api.swasthyapro.com/api/report/mark-completed",
          {
            booking_id: order.booking_id,
          },
        );
        if (markResponse.status === 200) {
          Swal.fire("Success", "Status Updated", "success");
          setOpen(false);
          await getOrders();
        }
        setOpen(false);
      } else {
        Swal.fire("Error", "Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  // const sendEmailForStatus = async (key) => {
  //   if (
  //     !dmlData.date ||
  //     !dmlData.dmlContact ||
  //     !dmlData.dmlName ||
  //     !dmlData.time ||
  //     !dmlEmail
  //   ) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Please Fill All Feilds",
  //     });
  //     return;
  //   }
  //   const url =
  //     key == "dml_assigned"
  //       ? "https://api.swasthyapro.com/api/mail/send-dml-mail"
  //       : "https://api.swasthyapro.com/api/mail/send-sample-confirm-mail";
  //   dmlData = {
  //     userName: user?.first_name + user?.last_name,
  //     userEmail: user.email,
  //     ...dmlData,
  //   };
  //   const dataForDML_mail = {
  //     dmlName: dmlData.dmlName,
  //     dmlEmail: dmlEmail,
  //     orderId: order.booking_id,
  //     userAddress: user.address || "",
  //     amount: order.Cart.totalPrice,
  //   };
  //   Swal.fire({
  //     title: "Assigning DML...",
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     },
  //   });

  //   try {
  //     const sendMailTO_DML = await axios.post(
  //       "https://api.swasthyapro.com/api/mail/send-cod-dml-mail",
  //       dataForDML_mail
  //     );
  //     if (!sendMailTO_DML.status === 200) {
  //       Swal.close();
  //       Swal.fire({
  //         icon: "error",
  //         title: "Failed to Send Email To DML.",
  //       });
  //       return;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Cart Error",
  //       text: "Something went wrong while Sending Mail To DML.",
  //     });
  //   }

  //   try {
  //     const response = await axios.post(url, dmlData);
  //     Swal.close();
  //     if (response.status === 200) {
  //       await Swal.fire({
  //         icon: "success",
  //         title: "Email Sent Successfully!",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //     }
  //     setDmlData({ date: "", dmlName: "", dmlContact: "", time: "" });
  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went wrong!",
  //     });
  //   }
  //   updateStatus();
  // };

  const sendEmailForStatus = async (key) => {
    // Validation for DML fields
    if (
      !dmlData.date ||
      !dmlData.dmlContact ||
      !dmlData.dmlName ||
      !dmlData.time ||
      !dmlEmail
    ) {
      Swal.fire({
        icon: "warning",
        title: "Please Fill All Fields",
      });
      return;
    }

    // Determine API URL based on key
    let url;
    if (key === "dml_assigned") {
      url = "https://api.swasthyapro.com/api/mail/send-dml-mail";
    } else if (key === "sample_collected") {
      url = "https://api.swasthyapro.com/api/mail/send-sample-confirm-mail";
    } else if (key === "sample_received_by_lab") {
      url =
        "https://api.swasthyapro.com/api/mail/send-sample-received-by-lab-mail";
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid status key",
      });
      return;
    }

    dmlData = {
      userName: user?.first_name + " " + user?.last_name,
      userEmail: user.email,
      ...dmlData,
    };

    // Data for DML email (only for dml_assigned)
    const dataForDML_mail = {
      dmlName: dmlData.dmlName,
      dmlEmail: dmlEmail,
      orderId: order.booking_id,
      userAddress: user.address || "",
      amount: order.Cart.totalPrice,
    };

    // Send DML email if applicable
    if (key === "dml_assigned") {
      Swal.fire({
        title: "Assigning DML...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const sendMailTO_DML = await axios.post(
          "https://api.swasthyapro.com/api/mail/send-cod-dml-mail",
          dataForDML_mail,
        );
        if (!sendMailTO_DML.status === 200) {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: "Failed to Send Email To DML.",
          });
          return;
        }
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Cart Error",
          text: "Something went wrong while Sending Mail To DML.",
        });
        return;
      }
    }

    // Send the email based on key
    try {
      const response = await axios.post(url, dmlData);
      Swal.close();
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Email Sent Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Reset DML data only for DML assigned

      if (key === "dml_assigned") {
        setDmlData({ date: "", dmlName: "", dmlContact: "", time: "" });
        setDMLemail("");
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    // Update status after sending email
    updateStatus();
  };

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    handleCloseModal();

    if (!file) {
      return Swal.fire({
        icon: "warning",
        title: "Please select a file first!",
      });
    }

    const formData = new FormData();
    const userId = order.user_id;
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await axios.post(
        "https://api.swasthyapro.com/api/prescription/upload-prescription",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (res.status === 200) {
        const response = await axios.post(
          "https://api.swasthyapro.com/api/report/add-report",
          {
            User_id: userId,
            name: reportName,
            report_link: res.data.location,
            dml_assigned: status.dml_assigned,
            sample_collected: status.sample_collected,
            sample_received_by_lab: status.sample_received_by_lab,
            booking_id: order.booking_id,
          },
        );
        if (response.status === 201) {
          Swal.close();
          await Swal.fire({
            icon: "success",
            title: "Report Sent Successfully!",
            timer: 2000,
            showConfirmButton: false,
          });
          await getOrders();
        }
      }
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  const isUploadDisabled =
    Object.values(status).includes(false) ||
    order.report_shared ||
    order.status === "cancelled";

  const handleSendSampleMail = async () => {
    Swal.fire({
      title: "Sending Email...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await sendSampleMail({
        user: order.User,
        dmlData: {
          date: order.scheduled_date?.split("T")[0],
          time: order.timeslot,
          dmlName: order.dml_person,
        },
        orderId: order.booking_id,
      });

      Swal.close();

      if (res.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Email Sent Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Failed to Send Email",
        text: err?.response?.data?.message || err.message,
      });
    }
  };

  const handleSendSampleReceivedByLabMail = async () => {
    Swal.fire({
      title: "Sending Email...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await sendSampleReceivedByLabMail({
        user: order.User,
        dmlData: {
          date: order.scheduled_date?.split("T")[0],
          time: order.timeslot,
          dmlName: order.dml_person,
        },
        orderId: order.booking_id,
      });

      Swal.close();

      if (res.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Email Sent Successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Failed to Send Email",
        text: err?.response?.data?.message || err.message,
      });
    }
  };

  const handleRowData = () => {
    const formattedDate = new Date(order.scheduled_date)
      .toISOString()
      .split("T")[0];

    const payload = {
      bookingId: order.booking_id,
      name: `${order.User.first_name} ${order.User.last_name}`,
      gender: order.User.gender,
      date: formattedDate,
      age: String(order.User.age ? order.User.age : "Not mentioned"),
      package: order.testNamesArray.join(", "),
    };
    setReportUserCred({
      userEmail: order.User.email,
      orderID: order.booking_id,
      userName: `${order.User.first_name} ${order.User.last_name}`,
    });
    setReportData(payload);
  };

  const isCheckboxDisabled = (key) => {
    return originalStatus?.[key] === true;
  };

  return (
    <>
      {/* Status Cell */}
      <div className="flex whitespace-nowrap gap-1">
        {order.status !== "cancelled" ? (
          statusFields.map(({ label, key }) => {
            const isActive = order?.[key];
            const bgColor = isActive ? "#e6f4ea" : "#fdecea";
            const textColor = isActive ? "#2e7d32" : "#c62828";

            return (
              <Box
                key={key}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: "12px",
                  fontWeight: 600,
                  fontSize: "10px",
                  minWidth: 60,
                  textAlign: "center",
                  border: `1px solid ${isActive ? "#a5d6a7" : "#ef9a9a"}`,
                }}
              >
                {label}
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              backgroundColor: "#fdecea",
              color: "#c62828",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "10px",
              px: 2,
              py: 0.5,
              border: "1px solid #ef9a9a",
              lineHeight: 1.5,
              alignItems: "end",
              height: "24px",
            }}
          >
            {"Cancelled"}
          </Box>
        )}
      </div>

      {order.status !== "cancelled" &&
        Object.values(status).includes(false) && (
          <div className="flex justify-center">
            <Tooltip title="Edit Status" sx={{ margin: "0 auto" }}>
              <IconButton
                size="small"
                onClick={() => {
                  setOriginalStatus({ ...status });
                  setOpen(true);
                  setUser(order.User);
                }}
                sx={{
                  mt: 0.5,
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ccc",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  padding: "4px",
                }}
              >
                <EditIcon fontSize="small" style={{ color: "#333" }} />
              </IconButton>
            </Tooltip>
          </div>
        )}

      {/* Upload Button Cell */}
      {/* <TableCell align="center">
        {!order.report_shared&& <Tooltip title="Upload Report">
         <IconButton
            disabled={isUploadDisabled}
            onClick={() => {
              setOriginalStatus({ ...status });
              setOpenModal(true);
              handleRowData();
            }}
            sx={{
             
              padding: "1px",
            }}
          >
            <CloudUploadIcon
              style={{ color: isUploadDisabled ? "#aaa" : "#333" }}
            />
          </IconButton>
         
        </Tooltip>}
         {order.report_shared &&  <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    backgroundColor: '#e6f4ea',
                    color: '#2e7d32',
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "10px",
                    minWidth: 60,
                    textAlign: "center",
                    border: `1px solid #a5d6a7`,
                  }}
                >
                 Report Shared
                </Box>}
      </TableCell> */}

      {/* Status Dialog */}
      {open &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="animate-fadeInScale bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Order Status for {order.User.first_name}
              </h3>

              <ul className="divide-y divide-gray-200 dark:divide-gray-600 border rounded-lg overflow-hidden mb-4">
                {statusFields.map(({ label, key }) => (
                  <li key={key} className="px-3 py-2 bg-white dark:bg-gray-700">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {/* <input
                          id={`${key}-checkbox`}
                          type="checkbox"
                          checked={status[key]}
                          onChange={() => handleCheckboxChange(key)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        /> */}

                        <input
                          id={`${key}-checkbox`}
                          type="checkbox"
                          checked={status[key]}
                          disabled={isCheckboxDisabled(key)}
                          onChange={() => handleCheckboxChange(key)}
                          className={`mt-1 w-4 h-4 border-gray-300 rounded
    ${
      isCheckboxDisabled(key)
        ? "cursor-not-allowed opacity-60"
        : "text-blue-600 focus:ring-blue-500"
    }
    dark:bg-gray-600 dark:border-gray-500
  `}
                        />
                        <label
                          htmlFor={`${key}-checkbox`}
                          className="text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          {label}
                        </label>
                      </div>

                      {(status[key] && label !== "Sample received by lab") ||
                        (label !== "Sample collected" && (
                          <button
                            disabled={isCheckboxDisabled(key)}
                            onClick={() => sendEmailForStatus(key)}
                            className={`bg-white text-blue-600 small transition ${
                              isCheckboxDisabled(key)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:text-blue-800"
                            }`}
                          >
                            Send Email
                          </button>
                        ))}
                    </div>

                    {/* || key==='sample_collected' */}
                    {key === "dml_assigned" &&
                      status[key] &&
                      !hideDMLInputs && (
                        <div className="mt-3 grid grid-cols-1 gap-2 px-2">
                          <input
                            type="date"
                            placeholder="Date"
                            className="p-2 text-sm border rounded-md dark:bg-gray-600 dark:text-white"
                            value={dmlData.date}
                            onChange={(e) =>
                              setDmlData({ ...dmlData, date: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="DML Name"
                            className="p-2 text-sm border rounded-md dark:bg-gray-600 dark:text-white"
                            value={dmlData.dmlName}
                            onChange={(e) =>
                              setDmlData({
                                ...dmlData,
                                dmlName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="email"
                            placeholder="DML Email"
                            className="p-2 text-sm border rounded-md dark:bg-gray-600 dark:text-white"
                            value={dmlEmail}
                            onChange={(e) => setDMLemail(e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="DML Contact"
                            className="p-2 text-sm border rounded-md dark:bg-gray-600 dark:text-white"
                            value={dmlData.dmlContact}
                            onChange={(e) =>
                              setDmlData({
                                ...dmlData,
                                dmlContact: Number(e.target.value),
                              })
                            }
                          />
                          <input
                            type="time"
                            className="p-2 text-sm border rounded-md dark:bg-gray-600 dark:text-white"
                            value={dmlData.time}
                            onChange={(e) =>
                              setDmlData({ ...dmlData, time: e.target.value })
                            }
                          />
                          <button
                            onClick={() => sendEmailForStatus(key)}
                            className={`bg-white text-blue-600 hover:text-blue-800 transition ${
                              disableDMLFields
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            Send Email
                          </button>
                        </div>
                      )}
                    {key === "dml_assigned" && status[key] && hideDMLInputs && (
                      <p className="text-md text-white italic mt-2">
                        DML has been assigned and email already sent.
                      </p>
                    )}

                    {key === "sample_collected" && status[key] && (
                      <div className="mt-3 grid grid-cols-1 gap-2 px-2">
                        <button
                          disabled={isCheckboxDisabled(key)}
                          className={`bg-white text-blue-600 transition ${
                            isCheckboxDisabled(key)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-blue-800"
                          }`}
                          onClick={() => handleSendSampleMail(key)}
                        >
                          Send Mail
                        </button>
                      </div>
                    )}

                    {key === "sample_received_by_lab" && status[key] && (
                      <div className="mt-3 grid grid-cols-1 gap-2 px-2">
                        <button
                          disabled={isCheckboxDisabled(key)}
                          className={`bg-white text-blue-600 transition ${
                            isCheckboxDisabled(key)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-blue-800"
                          }`}
                          onClick={() => handleSendSampleReceivedByLabMail(key)}
                        >
                          Send Mail
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setStatus(originalStatus);
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateStatus();
                    setOpen(false);
                  }}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Upload Report Modal */}
      {/* <UploadModal
        userData={reportUserCred}
        reportData={reportData}
        open={openModal}
        onClose={() => setOpenModal(false)}
        getOrders={getOrders}
      /> */}
    </>
  );
};

export default OrderStatusCell;
