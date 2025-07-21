// utils/queryTableColumns.js
import { Button, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Info } from "lucide-react";

export const getQueryTableColumns = ({ onUpdateClick,onInfoClick }) => [
  {
    accessorKey: 'id',
    header: 'Query ID',
        Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 120,
  },
  {
    accessorKey: 'User_id',
    header: 'User Type',
    Cell: ({ cell }) => (cell.getValue() ? 'User' : 'Guest'),
    size: 100,
  },
  {
    accessorKey: 'name',
    header: 'Name',
        Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 180,
  },
  {
    accessorKey: 'createdAt',
    header: 'Date & Time',
    Cell: ({ cell }) => new Date(cell.getValue()).toLocaleString(),
    size: 200,
  },
  {
    accessorKey: 'email',
    header: 'Email',
     Cell: ({ cell }) => cell.getValue() || 'N/A',

    size: 180,
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    Cell: ({ cell }) => cell.getValue() || 'Not Provided',
    size: 140,
  },

  {
      header: "Query",
      id: "query",
      size: 80,
      Cell: ({ row }) => (
          row.original.query? (<Tooltip title="User Query">
          <IconButton onClick={() => onInfoClick(row.original)}>
            <Info size={18} />
          </IconButton>
        </Tooltip>) : "N/A"
      ),
    },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell }) => (
      <Chip
        label={cell.getValue()}
        size="small"
        color={
          cell.getValue() === 'open'
            ? 'success'
            : cell.getValue() === 'closed'
            ? 'error'
            : 'info'
        }
        variant="filled"
        sx={{ fontWeight: 500, height: 22, textTransform: 'capitalize' }}
      />
    ),
    size: 120,
  },
  {
    accessorKey: 'seen',
    header: 'Seen',
    Cell: ({ cell }) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: cell.getValue() ? 'success.main' : 'warning.main',
        }}
      >
        {cell.getValue() ? 'Seen' : 'Not Seen'}
      </Typography>
    ),
    size: 100,
  },
  {
    accessorKey: 'remarks',
    header: 'Remarks',
    Cell: ({ cell }) => cell.getValue() || 'N/A',
    size: 200,
  },
  {
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    Cell: ({ cell }) => cell.getValue() || 'Not Assigned',
    size: 180,
  },
  {
    header: 'Update',
    id: 'update-query-status',
    Cell: ({ row }) => (
      <Button
        variant="outlined"
        size="small"
        sx={{ fontSize: "0.7rem", py: 0, px: 1 }}
        onClick={() => onUpdateClick(row.original)}
      >
        Update
      </Button>
    ),
    size: 100,
  }
];