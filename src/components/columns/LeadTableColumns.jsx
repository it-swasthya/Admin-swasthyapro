export const getLeadTableColumns = () => [
  {
    accessorKey: "lead_id",
    header: "Lead ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 180,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "department",
    header: "Department",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 120,
  },
  {
    accessorKey: "cases",
    header: "Case Type",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 120,
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      return Array.isArray(value) ? value.join(", ") : "N/A";
    },
    size: 180,
  },
  {
    accessorKey: "markedAs",
    header: "Seen",
    Cell: ({ cell }) => cell.getValue() || "N/A",
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    Cell: ({ cell }) =>
      cell.getValue()
        ? new Date(cell.getValue()).toLocaleString()
        : "N/A",
    size: 180,
  },
];
