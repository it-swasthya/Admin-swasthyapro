import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const getInvoiceTableColumns = ({handleOpenItemsModal,handleOpenGstModal}) => [
  {
    accessorKey: 'invoice_id',
    header: 'Invoice ID',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 140,
  },
  {
    accessorKey: 'invoice_date',
    header: 'Invoice Date',
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : 'N/A',
    size: 140,
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleDateString() : 'N/A',
    size: 140,
  },
  {
    accessorKey: 'place_of_supply',
    header: 'Place of Supply',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 150,
  },
  {
    accessorKey: 'bill_to_name',
    header: 'Bill To',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 150,
  },
  {
    accessorKey: 'bill_to_address',
    header: 'Address',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 200,
  },
  {
    accessorKey: 'bill_to_gstin',
    header: 'GSTIN',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 160,
  },
 {
  accessorKey: 'employee_items',
  header: 'Items',
  Cell: ({ row }) => (
    <Tooltip title="View Items" arrow>
      <IconButton
        size="small"
        onClick={() => handleOpenItemsModal(row.original.employee_items)}
      >
        <InfoOutlinedIcon color="primary" />
      </IconButton>
    </Tooltip>
  ),
  size: 100,
}
,
 {
  accessorKey: 'gst',
  header: 'GST Details',
  Cell: ({ row }) => (
     <Tooltip title="View GST" arrow>
      <IconButton
        size="small"
        onClick={() => handleOpenGstModal(row.original)}
      >
        <InfoOutlinedIcon color="primary" />
      </IconButton>
    </Tooltip>
  ),
  size: 130,
},
  {
    accessorKey: 'subtotal',
    header: 'Subtotal',
    Cell: ({ cell }) => cell.getValue() ? `₹${cell.getValue()}` : 'N/A',
    size: 120,
  },
 

  {
    accessorKey: 'total',
    header: 'Total',
    Cell: ({ cell }) => cell.getValue() ? `₹${cell.getValue()}` : 'N/A',
    size: 120,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    Cell: ({ cell }) =>
      cell.getValue() ? new Date(cell.getValue()).toLocaleString() : 'N/A',
    size: 180,
  },
 
];
