import { Button } from '@mui/material';

export const getPrescriptionTableColumns = (onUpdateClick) => [
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    Cell: ({ row }) => `${row.original.first_name || ''} ${row.original.last_name || ''}`.trim() || 'N/A',
    size: 180,
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 120,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 200,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 220,
  },
  {
    accessorKey: 'prescription.name',
    header: 'Prescription Name',
    Cell: ({ row }) => row.original.prescription?.name || 'N/A',
    size: 180,
  },
  {
    accessorKey: 'prescription.createdAt',
    header: 'Date',
    Cell: ({ row }) => row.original.prescription?.createdAt
      ? new Date(row.original.prescription.createdAt).toLocaleDateString()
      : 'N/A',
    size: 130,
  },
  {
    accessorKey: 'prescription.details',
    header: 'Details',
    Cell: ({ row }) => row.original.prescription?.details || 'N/A',
    size: 200,
  },
 {
  accessorKey: 'prescription.prescription_link',
  header: 'Prescription Link',
  Cell: ({ row }) => (
        row.original.prescription?.prescription_link ? (
      <a
        href={row.original.prescription.prescription_link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'blue', textDecoration: 'underline' }}
      >
        View
      </a>
    ) : (
      'N/A'
    )

  ),
  size: 160,
}
,
  {
    accessorKey: 'prescription.status',
    header: 'Status',
    Cell: ({ row }) => row.original.prescription?.status || 'N/A',
    size: 120,
  },
  {
    accessorKey: 'prescription.seen',
    header: 'Seen',
    Cell: ({ row }) => row.original.prescription?.seen ? 'Seen' : 'Not Seen',
    size: 100,
  },
  {
    accessorKey: 'prescription.remarks',
    header: 'Remark',
    Cell: ({ row }) => row.original.prescription?.remarks || 'N/A',
    size: 160,
  },
  {
    header: 'Update Status',
    id: 'update-status-action',
    Cell: ({ row }) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onUpdateClick(row.original.prescription)}
        sx={{ fontSize: '0.7rem', py: 0, px: 1 }}
      >
        Update
      </Button>
    ),
    size: 130,
  },
];