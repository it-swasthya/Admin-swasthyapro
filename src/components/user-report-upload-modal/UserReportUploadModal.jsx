import {
  Box,
  Typography,
  IconButton,
  Collapse,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import UploadReports from "../uploadReports/uploadReports";

const UserReportUplaod = ({ userData, getOrders, onClose }) => {
  return (
    <Box mt={1} ml={1} sx={{ width: "97%" }}>
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Gender</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Age</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Packages</strong>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <strong>Upload Report</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.assigned_members.map((member, index) => (
               member.items.length > 0 &&( <TableRow key={member.member_id || index}>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {member.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {member.gender}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {member.age}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {Array.isArray(member.items) &&
                      member.items?.length > 0 && (
                        <List dense sx={{ pl: 0, pt: 0 }}>
                          {member.items.map((pkg, i) => (
                            <ListItem key={i} sx={{ py: 0 }}>
                              <ListItemText
                                primary={`• ${pkg.item_name}`}
                                sx={{ textAlign: "center" }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    {member.family_report_shared ? (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: "#e6f4ea",
                          color: "#2e7d32",
                          borderRadius: "12px",
                          fontWeight: 600,
                          fontSize: "10px",
                          minWidth: 60,
                          textAlign: "center",
                          border: `1px solid #a5d6a7`,
                        }}
                      >
                        Report Shared
                      </Box>
                    ) : (
                      <UploadReports
                        order={userData}
                        FamilyMembers={member}
                        getOrders={getOrders}
                        scheduled_date={userData.scheduled_date}
                        onClose={onClose}
                      />
                    )}
                  </TableCell>
                </TableRow>)
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
    </Box>
  );
};

export default UserReportUplaod;
