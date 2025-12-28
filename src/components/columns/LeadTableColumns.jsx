




  // import { Button, Chip } from "@mui/material";
  // import RemarksPopup from "../../pages/crm/RemarksPopup";

  // export const getLeadTableColumns = (onUpdate, onDelete) => [
  //   {
  //     accessorKey: "user_id",
  //     header: "User ID",
  //     Cell: ({ cell }) => (
  //       <span style={{ color: "#555", fontFamily: "monospace" }}>
  //         {cell.getValue() || "N/A"}
  //       </span>
  //     ),
  //     size: 150,
  //   },
  //   {
  //     accessorKey: "department",
  //     header: "Department",
  //     Cell: ({ cell }) => (
  //       <Chip
  //         label={cell.getValue() || "N/A"}
  //         size="small"
  //         color="primary"
  //         variant="outlined"
  //         sx={{ fontWeight: 500 }}
  //       />
  //     ),
  //     size: 120,
  //   },
  //   {
  //     accessorKey: "cases",
  //     header: "Case Type",
  //     Cell: ({ cell }) => (
  //       <span style={{ color: "#050a0fff", fontWeight: 500 }}>
  //         {cell.getValue() || "N/A"}
  //       </span>
  //     ),
  //     size: 150,
  //   },
  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //     Cell: ({ cell }) => {
  //       const val = cell.getValue();
  //       const color =
  //         val === "Open" ? "#388e3c" : val === "Closed" ? "#d32f2f" : "#1976d2";
  //       return <span style={{ color, fontWeight: 600 }}>{val || "N/A"}</span>;
  //     },
  //     size: 120,
  //   },
  //   {
  //     accessorKey: "priority",
  //     header: "Priority",
  //     Cell: ({ cell }) => {
  //       const val = cell.getValue();
  //       let color = "#1976d2";
  //       if (val === "High") color = "#388e3c";
  //       else if (val === "Medium") color = "#fbc02d";
  //       else if (val === "Urgent") color = "#90561dff";
  //       else if (val === "Critical") color = "#d32f2f";

  //       return (
  //         <Chip
  //           label={val || "N/A"}
  //           size="small"
  //           sx={{
  //             fontWeight: 600,
  //             color: "#fff",
  //             backgroundColor: color,
  //           }}
  //         />
  //       );
  //     },
  //     size: 120,
  //   },
  //   {
  //     accessorKey: "assignedTo",
  //     header: "Assigned To",
  //     Cell: ({ cell }) => {
  //       const value = cell.getValue();
  //       return Array.isArray(value)
  //         ? value.map((v, i) => (
  //             <Chip
  //               key={i}
  //               label={v}
  //               size="small"
  //               variant="outlined"
  //               sx={{ mr: 0.5, mb: 0.5 }}
  //             />
  //           ))
  //         : "N/A";
  //     },
  //     size: 180,
  //   },
  //   {
  //     accessorKey: "markedAs",
  //     header: "Seen",
  //     Cell: ({ cell }) => (
  //       <span style={{ fontWeight: 600, color: "#f57c00" }}>
  //         {cell.getValue() || "N/A"}
  //       </span>
  //     ),
  //     size: 100,
  //   },
  //   {
  //     accessorKey: "remarks",
  //     header: "Remarks",
  //     Cell: ({ cell }) => <RemarksPopup remarks={cell.getValue()} />,
  //     size: 180,
  //   },
  //   {
  //     accessorKey: "createdAt",
  //     header: "Date",
  //     Cell: ({ cell }) =>
  //       cell.getValue()
  //         ? new Date(cell.getValue()).toLocaleString()
  //         : "N/A",
  //     size: 180,
  //   },
  //   {
  //     header: "Actions",
  //     Cell: ({ row }) => (
  //       <div style={{ display: "flex", gap: 8 }}>
  //         <Button
  //           variant="outlined"
  //           size="small"
  //           color="primary"
  //           onClick={() => onUpdate(row.original)}
  //         >
  //           Update
  //         </Button>
  //         <Button
  //           variant="outlined"
  //           size="small"
  //           color="error"
  //           onClick={() => onDelete(row.original)}
  //         >
  //           Delete
  //         </Button>
  //       </div>
  //     ),
  //     size: 180,
  //   },
  // ];





  import { Button, Chip } from "@mui/material";
  import RemarksPopup from "../../pages/crm/RemarksPopup";

  export const getLeadTableColumns = (onUpdate, onDelete) => [
    /* ================= USER ID ================= */
    {
      accessorKey: "user_id",
      header: "User ID",
      Cell: ({ cell }) => (
        <span style={{ color: "#555", fontFamily: "monospace" }}>
          {cell.getValue() || "N/A"}
        </span>
      ),
      size: 150,
    },

  /* ================= EMPLOYEE NAME ================= */
  {
    accessorKey: "user_name",
    header: "Name",
    Cell: ({ cell }) => (
      <span style={{ fontWeight: 600 }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 180,
  },

  {
    accessorKey: "user_phone",
    header: "Phone",
    Cell: ({ cell }) => (
      <span style={{ fontFamily: "monospace" }}>
        {cell.getValue() || "N/A"}
      </span>
    ),
    size: 150,
  },

    /* ================= DEPARTMENT ================= */
    {
      accessorKey: "department",
      header: "Department",
      Cell: ({ cell }) => (
        <Chip
          label={cell.getValue() || "N/A"}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      ),
      size: 120,
    },

    /* ================= CASE TYPE ================= */
    {
      accessorKey: "cases",
      header: "Case Type",
      Cell: ({ cell }) => (
        <span style={{ color: "#050a0fff", fontWeight: 500 }}>
          {cell.getValue() || "N/A"}
        </span>
      ),
      size: 150,
    },

    /* ================= STATUS ================= */
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => {
        const val = cell.getValue();
        const color =
          val === "Open" ? "#388e3c" :
          val === "Closed" ? "#d32f2f" :
          "#1976d2";

        return <span style={{ color, fontWeight: 600 }}>{val || "N/A"}</span>;
      },
      size: 120,
    },
     {
      accessorKey: "deal_done",
      header: "Deal Done",
      Cell: ({ cell }) => {
        const val = cell.getValue();
        const color =
          val === "Yes" ? "#388e3c" :
          val === "No" ? "#d32f2f" :
          "#1976d2";

        return <span style={{ color, fontWeight: 600 }}>{val || "N/A"}</span>;
      },
      size: 120,
    },

    /* ================= PRIORITY ================= */
    {
      accessorKey: "priority",
      header: "Priority",
      Cell: ({ cell }) => {
        const val = cell.getValue();
        let color = "#1976d2";

        if (val === "High") color = "#388e3c";
        else if (val === "Medium") color = "#fbc02d";
        else if (val === "Urgent") color = "#90561dff";
        else if (val === "Critical") color = "#d32f2f";

        return (
          <Chip
            label={val || "N/A"}
            size="small"
            sx={{ fontWeight: 600, color: "#fff", backgroundColor: color }}
          />
        );
      },
      size: 120,
    },

    /* ================= ASSIGNED TO ================= */
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return Array.isArray(value)
          ? value.map((v, i) => (
              <Chip
                key={i}
                label={v}
                size="small"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))
          : "N/A";
      },
      size: 180,
    },

  /* ================= SEEN ================= */
{
  accessorKey: "markedAs",
  header: "Seen",
  Cell: ({ cell }) => {
    const value = cell.getValue();

    const color =
      value === "Seen"
        ? "#2e7d32"   // green
        : value === "Unseen"
        ? "#c62828"   // red
        : "#9e9e9e";  // gray for N/A

    return (
      <span style={{ fontWeight: 600, color }}>
        {value || "N/A"}
      </span>
    );
  },
  size: 100,
},

    /* ================= REMARKS ================= */
  {
    accessorKey: "remarks",
    header: "Remarks",
    Cell: ({ cell, row }) => (
      <RemarksPopup
        remarks={cell.getValue()}
        lead_id={row.original.lead_id}
      />
    ),
    size: 180,
  },

    /* ================= DATE ================= */
    {
      accessorKey: "createdAt",
      header: "Date",
      Cell: ({ cell }) =>
        cell.getValue()
          ? new Date(cell.getValue()).toLocaleString()
          : "N/A",
      size: 180,
    },

    /* ================= ACTIONS ================= */
    {
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onUpdate(row.original)}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => onDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
      size: 180,
    },
  ];
