import * as React from 'react';
import { Box, Typography, Modal, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: { xs: 3, sm: 4, md: 5 },
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(to bottom right, #f8fafc, #ffffff, #f1f5f9)',
  border: '1px solid #c7d2fe',
  fontFamily: 'serif',
};

const contentStyle = {
  overflowY: 'auto',
  maxHeight: '40vh',
  paddingRight: '1rem',
  color: '#1f2937',
  fontSize: '1rem',
  lineHeight: 1.6,
  marginTop: '1rem',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export const LabCustomModal = ({ isOpen, onClose, title, children })=> {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = ''; 
    };
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Fade in={isOpen}>
        <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header with Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              id="custom-modal-title"
              variant="h6"
              component="h2"
              sx={{
                color: '#3730a3',
                fontWeight: 'bold',
                fontSize:"20px",
                borderBottom: '1px solid #c7d2fe',
                flexGrow: 1,
                paddingBottom: 1,
              }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={onClose}
              aria-label="close"
              sx={{
                ml: 1,
                p: 1.2, // touch-friendly padding
                background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                color: '#1f2937',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.25s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                },
                '@media (max-width: 600px)': {
                  p: 1,
                  borderRadius: '10px',
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={contentStyle} id="custom-modal-description">
            {children}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
