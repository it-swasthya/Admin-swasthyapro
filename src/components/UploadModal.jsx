import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  CircularProgress,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { FileUpIcon } from "lucide-react";

const UploadModal = ({ userData, reportData, open, onClose,getOrders,onCloseTable }) => {
  const [filledPdfUrl, setFilledPdfUrl] = useState(null);
  const [logoPdfUrl, setLogoPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isSendEmailEnable, setisSendEmailEnable] = useState(false);
  const handleApiCall = async (pdfUrl) => {
    setLoading(true);
    setFilledPdfUrl(null);
    setLogoPdfUrl(null); 
    try {
      // const payload = {
      //   bookingId: "12345678",
      //   name: "Sunil Gupta",
      //   gender: "Male",
      //   date: "2025-06-02",
      //   age: "45",
      //   package: "Basic Health Checkup",
      //   pdfUrl,
      // };

      const response = await axios.post(
        "https://api.swasthyapro.com/api/report/fill",
        { ...reportData, pdfUrl },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      setFilledPdfUrl(blobUrl);
    } catch (error) {
      console.error("Error filling PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleCapClick = () => {
    handleApiCall(
      "https://swasthya-prescription-bucket.s3.eu-north-1.amazonaws.com/Reports/report-with-cap.pdf"
    );
  };

  const handleWithoutCapClick = () => {
    handleApiCall(
      "https://swasthya-prescription-bucket.s3.eu-north-1.amazonaws.com/Reports/report-without-cap.pdf"
    );
  };

  const handleUploadAndAddLogo = async () => {
    if (!pdfFile || !logoFile) {
      alert("Please upload PDF and logo.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("uploaded_pdf", pdfFile);
    formData.append("logo", logoFile);

    formData.append(
      "letterheadUrl",
      "https://swasthya-prescription-bucket.s3.eu-north-1.amazonaws.com/Reports/letter-header.jpg"
    );
    formData.append(
      "footerUrl",
      "https://swasthya-prescription-bucket.s3.eu-north-1.amazonaws.com/Reports/letter-footer.jpg"
    );

    try {
      const response = await axios.post(
        "https://api.swasthyapro.com/api/report/add-logo",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      setLogoPdfUrl(blobUrl);
    } catch (error) {
      console.error("Error uploading and adding logo:", error);
      alert("Failed to upload and add logo");
    } finally {
      setLoading(false);
    }
  };

  const handleMergePdfs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.swasthyapro.com/api/report/merge",
        {},
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);
      setMergedPdfUrl(blobUrl);
      setisSendEmailEnable(true);
    } catch (error) {
      console.error("Merge error:", error);
      alert("Failed to merge PDFs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="upload-report-modal"
      aria-describedby="upload-report-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 850,
          maxHeight: "90vh",
          bgcolor: "white",
          color: "black",
          borderRadius: 3,
          boxShadow: 10,
          p: 5,
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Report
        </Typography>

        <Stack direction="row" spacing={2} mb={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCapClick}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Cap
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleWithoutCapClick}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Without Cap
          </Button>
        </Stack>

        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && filledPdfUrl && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Filled PDF Preview
            </Typography>
            <Box
              component="iframe"
              src={filledPdfUrl}
              width="100%"
              height="400px"
              title="Filled PDF"
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2, mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Upload PDF & Logo
            </Typography>

           <Stack spacing={3} mb={3}>
      {/* PDF Upload */}
      <Stack spacing={1}>
        <Typography fontWeight="medium">Upload PDF:</Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<FileUpIcon />}
          sx={{ textTransform: 'none', borderRadius: 2, width: 'fit-content' }}
        >
          Choose PDF File
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => {
              if (e.target.files[0]) setPdfFile(e.target.files[0]);
            }}
          />
        </Button>
        {pdfFile && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Selected: {pdfFile.name}
          </Typography>
        )}
      </Stack>

      {/* Logo Upload */}
      <Stack spacing={1}>
        <Typography fontWeight="medium">Upload Logo:</Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<FileUpIcon />}
          sx={{ textTransform: 'none', borderRadius: 2, width: 'fit-content' }}
        >
          Choose Logo Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files[0]) setLogoFile(e.target.files[0]);
            }}
          />
        </Button>
        {logoFile && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Selected: {logoFile.name}
          </Typography>
        )}
      </Stack>

      {/* Upload Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUploadAndAddLogo}
        disabled={logoLoading}
        sx={{ borderRadius: 2, textTransform: "none", width: "fit-content" }}
      >
        {logoLoading ? "Processing..." : "Upload & Add Logo + Header/Footer"}
      </Button>
    </Stack>
            {logoLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="300px"
              >
                <CircularProgress />
              </Box>
            )}

            {!logoLoading && logoPdfUrl && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Logo-Added PDF Preview
                </Typography>
                <Box
                  component="iframe"
                  src={logoPdfUrl}
                  width="100%"
                  height="400px"
                  title="Logo PDF"
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
                />
              </>
            )}
          </>
        )}

        {logoPdfUrl && (
          <>
            <Box mt={4} display="flex" justifyContent="flex-start">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMergePdfs}
                sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
              >
                Merge Both PDFs
              </Button>
            </Box>

            {mergedPdfUrl && (
              <>
                <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={1}>
                  Merged PDF Preview
                </Typography>
                <Box
                  component="iframe"
                  src={mergedPdfUrl}
                  width="100%"
                  height="400px"
                  title="Merged PDF"
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
                />
              </>
            )}
          </>
        )}

        <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
          {mergedPdfUrl && (
            <Button
              variant="contained"
              color="success"
              onClick={async () => {
                onClose();
                onCloseTable()
                try {
                  Swal.fire({
                    title: "Sending Report...",
                    text: "Please wait while the report is being Whatsapp.",
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading();
                    },
                  });

                  await axios.post(
                    "https://api.swasthyapro.com/api/report/send-upload-report",
                    {
                      member_id:userData.memberId,
                      userName: userData.userName,
                      booking_id: userData.orderID,
                      test_type:userData.test_type,
                      mobile_number:`${'91'+userData.mobile_number}`,
                      date:userData.date
                    }
                  );

                  await Swal.fire({
                    icon: "success",
                    title: "Report Sent!",
                    text: "The report has been successfully whatsapp to the user.",
                    timer: 1000,
                  });
                    getOrders()
                } catch (err) {
                  console.error(err);
                  await Swal.fire({
                    icon: "error",
                    title: "Email Failed",
                    text: "Something went wrong while sending the report.",
                    timer: 1000,
                  });
                }
              }}
              sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
            >
              Send to Whatsapp
            </Button>
          )}

          <Button
            variant="contained"
            color="error"
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadModal;
