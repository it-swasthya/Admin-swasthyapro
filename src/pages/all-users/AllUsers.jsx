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

  // const handleBookTest = (user) => {
  //   const { fullName, email, id, address } = user;
  //   navigate("/book-test", {
  //     state: { user: { fullName, email, id, address } },
  //   });
  // };

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
          onClick={() => navigate("/create-user")}
          className=" h-[40px] sm:h-auto bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
        >
          + Create User
        </button>
      </>
    );
  }
  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-end gap-2">
        <button
          onClick={() => navigate("/create-user")}
          className=" h-[40px] sm:h-auto bg-black text-white hover:bg-white hover:text-black border border-black px-4 py-2 rounded transition duration-200"
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
