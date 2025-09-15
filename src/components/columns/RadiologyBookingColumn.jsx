import { Button, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

export const getRadiologyBookingColumn = () => {
  // Local component for Test Info Dialog
  const TestInfoCell = ({ row }) => {
    const [open, setOpen] = useState(false);
    const tests = row.original.testDetails || [];

    return (
      <>
        <IconButton color="primary" size="small" onClick={() => setOpen(true)}>
          <InfoIcon fontSize="small" />
        </IconButton>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Test Details</DialogTitle>
          <DialogContent>
            <List>
              {tests.map((t, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={t.name}
                    secondary={`Price: ₹${t.price}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  return [
    {
      accessorKey: 'id',
      header: 'Booking ID',
      size: 160,
    },
       {
      accessorKey: 'user_id',
      header: 'User ID',
      size: 160,
    },
    {
      accessorKey: 'fullName',
      header: 'Full Name',
      size: 180,
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      size: 140,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'labName',
      header: 'Lab Name',
      size: 200,
    },
    {
      header: 'Test(s)',
      id: 'test-info',
      size: 100,
      Cell: TestInfoCell,
    },
    {
      accessorKey: 'slotTime',
      header: 'Slot Time',
      size: 160,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      size: 140,
    },
    {
      accessorKey: 'netAmount',
      header: 'Net Amount',
      size: 140,
    },
     {
      accessorKey: 'additional_discount',
      header: 'Additional Discount',
      size: 140,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      size: 140,
    },
    {
      accessorKey: 'reportStatus',
      header: 'Report Status',
      size: 140,
    },
    {
      accessorKey: 'createdAt',
      header: 'Booking Date',
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      size: 160,
    },
    // {
    //   header: 'Center Allot',
    //   id: 'Center-Allot',
    //   Cell: ({ row }) => (
    //     <Button
    //       onClick={() => onCenterAllot(row.original)}
    //       variant="contained"
    //       color="primary"
    //       size="small"
    //     >
    //       Allot Center
    //     </Button>
    //   ),
    // },
  ];
};
