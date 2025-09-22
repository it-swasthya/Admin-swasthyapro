import { Button } from '@mui/material';

export const getPrescriptionTableColumns = (onUpdateClick) => [
  {
    accessorKey: 'name',
    header: 'Full Name',
    Cell: ({ cell }) => cell.getValue()  || "Guest",
    size: 180,
  },
  {
  accessorKey: 'details',
  header: 'Contact',
  Cell: ({ cell }) => cell.getValue() || 'N/A',
  size: 120,
},

  {
    accessorKey: 'createdAt',
    header: 'Date',
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString()|| 'N/A',
    size: 130,
  },
  // {
  //   accessorKey: 'details',
  //   header: 'Details',
  //   Cell: ({ cell }) => cell.getValue() || 'N/A',
  //   size: 200,
  // },
  {
    accessorKey: 'prescription_link',
    header: 'Prescription Link',
    Cell: ({ cell }) =>
      cell.getValue() !== 'N/A' ? (
        <a
          href={cell.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          View
        </a>
      ) : (
        'N/A'
      ),
    size: 160,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 120,
  },
  {
    accessorKey: 'seen',
    header: 'Seen',
    Cell: ({ cell }) => cell.getValue() || 'Not Seen',
    size: 100,
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 160,
  },
  {
    header: 'Update Status',
    id: 'update-status-action',
    Cell: ({ row }) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onUpdateClick(row.original)}
        sx={{ fontSize: '0.7rem', py: 0, px: 1 }}
      >
        Update
      </Button>
    ),
    size: 130,
  },
];
