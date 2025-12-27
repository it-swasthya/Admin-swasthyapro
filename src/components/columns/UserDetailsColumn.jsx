// utils/userTableColumns.js
import { Button, IconButton, Tooltip } from "@mui/material";
import { Edit } from "lucide-react";
import Info from "@mui/icons-material/Info";

export const getUserTableColumns = ({
  onBookTest,
  // onReportClick,
  // onPrescriptionClick,
  onInfoClick,
  handleUpdateUser
}) => [
  {
    accessorKey: "id",
    header: "User ID",
    size: 140,
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    size: 180,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    size: 140,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 180,
  },
  {
    accessorKey: "age",
    header: "Age",
    size: 80,
  },
   {
    accessorKey: "role",
    header: "Role",
    size: 80,
  },
  {
    header: "More Info",
    id: "info",
    size: 80,
    Cell: ({ row }) => (
      <Tooltip title="User Info">
        <IconButton onClick={() => onInfoClick(row.original)}>
          <Info size={18} />
        </IconButton>
      </Tooltip>
    ),
  },

  // {
  //   accessorKey: "address",
  //   header: "Address",
  //   size: 200,
  // },
  // {
  //   accessorKey: "pincode",
  //   header: "Pincode",
  //   size: 100,
  // },
  // {
  //   accessorKey: "state",
  //   header: "State",
  //   size: 140,
  // },
  // {
  //   accessorKey: "DOB",
  //   header: "DOB",
  //   Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
  //   size: 120,
  // },

 

  {
    header: "Book-Test",
    id: "Book-Test",
    Cell: ({ row }) => (
      <Button
        onClick={() => onBookTest(row.original)}
        variant="contained"
        color="primary"
        size="small"
      >
        Book Test
      </Button>
    ),
  },
  
  {
    header: 'Edit',
    // id: 'edit',
    Cell: ({ row }) => (
      <IconButton
        onClick={() => handleUpdateUser(row.original)}
        color="success"
      >
      <Edit/>
      </IconButton>
    ),
  },
  // {
  //   header: 'Prescriptions',
  //   id: 'prescriptions',
  //   Cell: ({ row }) => (
  //     <IconButton
  //       onClick={() => onPrescriptionClick(row.original , )}
  //       color="warning"
  //     >
  //       <NotebookTabsIcon />
  //     </IconButton>
  //   ),
  // },
];
