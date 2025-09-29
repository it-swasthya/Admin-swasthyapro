// utils/userTableColumns.js
import { Button, IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { NotebookTabsIcon } from "lucide-react";

export const getUserTableColumns = ({
  onBookTest,
  onReportClick,
  onPrescriptionClick,
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
    accessorKey: "address",
    header: "Address",
    size: 200,
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
    size: 100,
  },
  {
    accessorKey: "state",
    header: "State",
    size: 140,
  },
  {
    accessorKey: "DOB",
    header: "DOB",
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    size: 120,
  },

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
  // {
  //   header: 'Reports',
  //   id: 'reports',
  //   Cell: ({ row }) => (
  //     <IconButton
  //       onClick={() => onReportClick(row.original,'reports')}
  //       color="success"
  //     >
  //       <InsertDriveFileIcon />
  //     </IconButton>
  //   ),
  // },
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
