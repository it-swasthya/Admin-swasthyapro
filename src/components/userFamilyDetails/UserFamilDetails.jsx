import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const UserFamilyAccordion = ({ userData}) => {
  return (

    <Box mt={1} ml={1} sx={{width:"97%"}}>
      { userData.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{textAlign:"center"}}><strong>Name</strong></TableCell>
                <TableCell sx={{textAlign:"center"}}><strong>Age</strong></TableCell>
                <TableCell sx={{textAlign:"center"}}><strong>Gender</strong></TableCell>
                <TableCell sx={{textAlign:"center"}}><strong>Relation</strong></TableCell>

                {/* <TableCell sx={{textAlign:"center"}}><strong>Packages</strong></TableCell> */}
                {/* <TableCell sx={{textAlign:"center"}}><strong>Upload Report</strong></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((member, index) => (
                <TableRow key={member.member_id || index}>
                  <TableCell sx={{textAlign:"center"}}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {member.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{textAlign:"center"}}>
                    <Typography variant="body2">
                      {member.age} 
                    </Typography>
                  </TableCell>
                  
                    <TableCell sx={{textAlign:"center"}}>
                    <Typography variant="body2">
                      {member.gender === "M"
                        ? "Male"
                        : member.gender === "F"
                        ? "Female"
                        : member.gender}{" "}
                     
                    </Typography>
                  </TableCell>
                    <TableCell sx={{textAlign:"center"}}>
                    <Typography variant="body2">
                     {member.relation}
                    </Typography>
                  </TableCell>
                   {/* <TableCell sx={{textAlign:"center"}}>
                    <Typography variant="body2">
                     {member.item_name}
                    </Typography>
                  </TableCell> */}
                  {/* <TableCell sx={{textAlign:"center"}}>
                    {Array.isArray(member.items) &&
                      member.items?.length > 0 && (
                        <List dense sx={{ pl: 0, pt: 0 }}>
                          {member.items.map((pkg, i) => (
                            <ListItem key={i} sx={{ py: 0 }}>
                              <ListItemText primary={`• ${pkg.item_name
}`}  sx={{textAlign:"center"}}/>
                            </ListItem>
                          ))}
                        </List>
                      )}
                  </TableCell> */}

                  {/* <TableCell sx={{textAlign:"center"}}>
                    <UploadReports
                      order={{
                        User: {
                          first_name: member.name,
                          age: member.age,
                          gender: member.gender,
                          email: row.User.email,
                        },
                        testNamesArray: member.packages,
                        scheduled_date: row?.scheduled_date,
                        booking_id: row.booking_id,
                      }}
                      getOrders={getOrders}
                    />
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No family Member found.
        </Typography>
      )}
    </Box>

  );
};

export default UserFamilyAccordion;
