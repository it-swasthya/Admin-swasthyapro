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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadModal from "../UploadModal";

const UploadReports = ({
  order,
  FamilyMembers,
  getOrders,
  scheduled_date,
  onClose,
}) => {
  const [originalStatus, setOriginalStatus] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [reportData, setReportData] = useState({});
  const [reportUserCred, setReportUserCred] = useState({});
  const [status, setStatus] = useState({
    dml_assigned: false,
    sample_collected: false,
    sample_received_by_lab: false,
  });

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

  const handleRowData = () => {
    const formattedDate = new Date(scheduled_date).toISOString().split("T")[0];
    const itemNamesString = FamilyMembers.items
      .map((item) => item.item_name)
      .join(", ");
    const payload = {
      bookingId: order.booking_id,
      name: `${FamilyMembers.name}`,
      gender: FamilyMembers.gender || "Not Mentioned",
      date: formattedDate,
      age: String(FamilyMembers.age ? FamilyMembers.age : "Not mentioned"),
      package: itemNamesString,
    };
    setReportUserCred({
      memberId: FamilyMembers.member_id || null,
      userEmail: order.User.email,
      orderID: order.booking_id,
      userName: `${FamilyMembers.name}`,
      mobile_number: order.User.contact,
      date: new Date().toLocaleDateString(),
      test_type: itemNamesString,
    });
    setReportData(payload);
  };

  return (
    <>
      <Tooltip title="Upload Report">
        <IconButton
          onClick={() => {
            setOriginalStatus({ ...status });
            setOpenModal(true);
            handleRowData();
          }}
          sx={{
            padding: "1px",
          }}
        >
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>

      {openModal &&
        ReactDOM.createPortal(
          <UploadModal
            userData={reportUserCred}
            reportData={reportData}
            open={openModal}
            onClose={() => setOpenModal(false)}
            getOrders={getOrders}
            onCloseTable={onClose}
          />,
          document.body
        )}
    </>
  );
};

export default UploadReports;
