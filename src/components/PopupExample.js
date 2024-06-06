import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Alert from '@mui/joy/Alert';
import { Box } from '@mui/joy';

export default function PopupExample({ message, color, buttonText='Open', children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
        <Alert color={color} onClick={() => setOpen(true)} sx={{ cursor: 'pointer', py: 0.4 }}>
            {message}
            <Button variant="outlined" size='sm' color={color}>
                {buttonText}
            </Button>
        </Alert>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 800,
            maxHeight: '90vh',
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography component="h2" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
            {message}
          </Typography>
          <Box sx={{overflow: 'auto', flexShrink: '1'}}>
            <Typography textColor="text.tertiary">
              {children}
            </Typography>
          </Box>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}