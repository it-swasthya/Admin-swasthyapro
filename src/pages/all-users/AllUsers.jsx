import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import TableComponent from "../../components/table/Table";
import { getUserTableColumns } from "../../components/columns/UserDetailsColumn";
import { UserFlattenRow } from "../../utils/AllUsersFllaten";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  Button,
} from "@mui/material";
import { changeNavValue } from "../../Redux/reducer";
import { useTheme, useMediaQuery } from "@mui/material";
import { UserDetailsMobileView } from "../../mobile-components/user-details(all-users)/UsersDetailsMobileView";

const AllUsers = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [viewType, setViewType] = useState("reports");
  const [loading, setLoading] = useState(true);
  // 🔍 Date range filter states
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

// 🔁 Filter users based on createdAt date range
useEffect(() => {
  if (!startDate && !endDate) {
    setFilteredUsers(userData);
  } else {
    const filtered = userData.filter((user) => {
      const created = new Date(user.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return created >= start && created <= end;
      if (start) return created >= start;
      if (end) return created <= end;
      return true;
    });
    setFilteredUsers(filtered);
  }
}, [startDate, endDate, userData]);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const getUsers = async () => {
    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const response = await axios.get(
        "https://api.swasthyapro.com/api/user/get-user"
      );
      const users = response.data.users || [];
      const formatted = users.map((user) => ({
        id: user?.User_id,
        fullName: `${user?.first_name} ${user?.last_name}`,
        dob: new Date(user?.date_of_birth).toLocaleDateString() || "N/A",
        contact: user?.contact || "N/A",
        email: user?.email || "N/A",
        age: user?.age || "N/A",
        address: user?.address || "N/A",
        pincode: user?.pincode || "N/A",
        state: user?.state || "N/A",
        alternate_no: user?.alternate_contact || "N/A",
        reports: user?.Reports || "N/A",
        Prescriptions: user?.Prescriptions,
        DOB: user?.date_of_birth || "N/A",
        createdAt: user?.createdAt 
      }));
      setUserData(formatted);
      setFilteredUsers(formatted);
    } catch (err) {
      setError("Error fetching users");
      console.error("Error fetching users:", err);
    } finally {
      Swal.close();
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(changeNavValue("All Users"));
    localStorage.removeItem("tests");
    localStorage.removeItem("packages");
    localStorage.removeItem("radiology");

    getUsers();
  }, [dispatch]);

  const handleBookTest = (user) => {
    const { fullName, email, id, address, contact } = user;

    Swal.fire({
      title: "Choose an Option",
      text: "Where do you want to go?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Book Test",
      cancelButtonText: "Book Radiology",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/book-test", {
          state: { user: { fullName, email, id, address, contact } },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/book-radiology", {
          state: { user: { fullName, email, id, address, contact } },
        });
      }
    });
  };


  const userCreate = () => {
  Swal.fire({
    title: "Create a New User",
    text: "Please choose the type of user you’d like to register:",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Create  User",
    cancelButtonText: "Create CGHS User",
    reverseButtons: true,
    background: "#f9fafb",
    color: "#111",
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#2563eb",
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/create-user");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      navigate("/create-CGHS-user");
    }
  });
};

  const handleOpenUploadModal = async (user, type) => {
    setSelectedUser(user);
    setViewType(type);
    if (type === "reports") {
      setUserReports(user.reports);
    } else {
      setUserReports(user.Prescriptions);
    }
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setSelectedUser(null);
    setOpenModal(false);
  };

  const column = getUserTableColumns({
    onBookTest: handleBookTest,
    onReportClick: handleOpenUploadModal,
    onPrescriptionClick: handleOpenUploadModal,
    onUserInfoClick: () => console.log(""),
  });
  if (error) {
    return (
      <>
        <div className="flex justify-center items-center p-4">
          <span className="text-lg text-red-500">{error}</span>
        </div>
        <button
          onClick={userCreate}
          className=" h-[40px] sm:h-auto bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
        >
          + Create User
        </button>
      </>
    );
  }
  return (
    <>
     <div
  className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
>
  {/* 📅 Date Range Filter - Left side */}
  <div className="flex flex-wrap items-center gap-4">
    <div className="flex items-center gap-2">
      <label className="font-medium">From:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </div>

    <div className="flex items-center gap-2">
      <label className="font-medium">To:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1"
      />
    </div>

    {(startDate || endDate) && (
      <button
        onClick={() => {
          setStartDate("");
          setEndDate("");
          setFilteredUsers(userData);
        }}
        className="border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        Clear
      </button>
    )}
  </div>

  {/* ➕ Create User - Right side */}
  <button
    onClick={userCreate}
    className="h-[40px] bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
  >
    + Create User
  </button>
</div>

      

      {isMobile ? (
        <UserDetailsMobileView
          userData={userData}
          filteredUsers={filteredUsers}
          handleOpenModal={handleOpenUploadModal}
          handleBookTest={handleBookTest}
        />
      ) : (
      <TableComponent
  columns={column}
  data={filteredUsers} 
  flattenRow={UserFlattenRow}
  filename={"User-details-file"}
/>

      )}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="upload-report-modal"
        aria-describedby="upload-report-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "white",
            color: "black",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            border: "1px solid #333",
            overflowY: "auto",
          }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {viewType === "reports"
              ? `Reports for ${selectedUser?.fullName}`
              : `Prescriptions for ${selectedUser?.fullName}`}
          </h2>

          {/* Conditional rendering of content based on viewType */}
          {viewType === "reports" ? (
            <div className="overflow-x-auto">
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Report Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Link</b>
                    </TableCell>
                    <TableCell>
                      <b>Time</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userReports.length > 0 ? (
                    userReports.map((report, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>
                          <a
                            href={report.report_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Report
                          </a>
                        </TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Prescription Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Link</b>
                    </TableCell>
                    <TableCell>
                      <b>Time</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userReports.length > 0 ? (
                    userReports.map((prescription, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{prescription.name}</TableCell>
                        <TableCell>
                          <a
                            href={prescription.prescription_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View Prescription
                          </a>
                        </TableCell>
                        <TableCell>
                          {new Date(prescription.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No prescriptions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <Button
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: "32px",
              height: "32px",
              borderRadius: "50%",
              padding: 0,
              bgcolor: "#ccc",
              color: "black",
              "&:hover": {
                bgcolor: "#aaa",
              },
            }}
          >
            ✕
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AllUsers;
