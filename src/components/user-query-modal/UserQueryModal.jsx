import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const UserQueryModal = ({ open, handleClose, query }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" className='text-blue-600'>User Query</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Typography variant="body1" className='text-blue-800' gutterBottom><strong>Name:</strong> {query.name}</Typography>
        <Typography variant="body2" className="whitespace-pre-wrap text-gray-700">
          {query.query}
        </Typography>
      </Box>
    </Modal>
  );
};

export default UserQueryModal;
