import { Button, IconButton, Tooltip } from "@mui/material";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import { NotebookTabsIcon } from "lucide-react";
export const getRadiologyAppointmentTableColumns = ({
//   onBookTest,
//   onReportClick,
//   onPrescriptionClick,
  onCenterAllot,
}) => [
  { accessorKey: "id", header: "ID", size: 140 },
{
  accessorKey: 'name',
  header: 'Full Name',
  size: 180,
},
  { accessorKey: "contact", header: "Contact", size: 140 },
  { accessorKey: "email", header: "Email", size: 180 },
  { accessorKey: "department", header: "Department", size: 80 },
  { accessorKey: "facility", header: "Facility", size: 200 },
{
  accessorKey: 'prescription_file',
  header: 'Prescription File',
  size: 120,
  Cell: ({ cell }) => {
    const url = cell.getValue();
    return url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
      >
        View Prescription
      </a>
    ) : (
      <span style={{ color: 'gray' }}>No File</span>
    );
  },
},
  { accessorKey: "createdAt", header: "Date", size: 140 },
  {
    accessorKey: "DOB",
    header: "DOB",
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
    size: 120,
  },
  {
    header: "Center Allot",
    id: "Center-Allot",
    Cell: ({ row }) => (
      <Button
        onClick={() => onCenterAllot(row.original)}
        variant="contained"
        color="primary"
        size="small"
      >
        {" "}
        Allot Center{" "}
      </Button>
    ),
  },
//   {
//     header: "Reports",
//     id: "reports",
//     Cell: ({ row }) => (
//       <IconButton
//         onClick={() => onReportClick(row.original, "reports")}
//         color="success"
//       >
//         {" "}
//         <InsertDriveFileIcon />{" "}
//       </IconButton>
//     ),
//   },
//   {
//     header: "Prescriptions",
//     id: "prescriptions",
//     Cell: ({ row }) => (
//       <IconButton
//         onClick={() => onPrescriptionClick(row.original)}
//         color="warning"
//       >
//         {" "}
//         <NotebookTabsIcon />{" "}
//       </IconButton>
//     ),
//   },
];
