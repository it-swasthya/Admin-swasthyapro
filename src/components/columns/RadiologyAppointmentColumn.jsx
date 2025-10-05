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
    accessorKey: "name",
    header: "Full Name",
    size: 180,
  },
  { accessorKey: "contact", header: "Contact", size: 140 },
  {
    accessorKey: "email",
    header: "Email",
    size: 180,
    Cell: ({ cell }) => {
      const email = cell.getValue();
      return email ? email : <span style={{ color: "gray" }}>N/A</span>;
    },
  },

  {
    accessorKey: "prescription_file",
    header: "Prescription File",
    size: 120,
    Cell: ({ cell }) => {
      const url = cell.getValue();
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          View Prescription
        </a>
      ) : (
        <span style={{ color: "gray" }}>No File</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    size: 140,
    Cell: ({ cell }) => {
      const dateValue = cell.getValue();
      return dateValue ? new Date(dateValue).toLocaleDateString() : "N/A";
    },
  },
];
