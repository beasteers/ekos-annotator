import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Alert from '@mui/joy/Alert';
import { Box } from '@mui/joy';

export default function PopupExample({ message, color, buttonText='Open', defaultOpen=false, modalKey='ekos-annotation-popup-seen', buttonVariant='solid', children }) {
  // localStorage.setItem(modalKey, '');
  const [open, setOpen] = React.useState(() => {
    const modalSession = modalKey && localStorage.getItem(modalKey);
    return defaultOpen && !modalSession;
  });
  return (
    <React.Fragment>
        <Alert color={color} onClick={() => setOpen(true)} sx={{ cursor: 'pointer', py: 1, px: 1, fontWeight: 900 }}>
            <Typography sx={{ mx: 1 }}>
            {message}
            </Typography>
            <Button variant={buttonVariant} size='sm' color={color}>
                {buttonText}
            </Button>
        </Alert>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          modalKey && localStorage.setItem(modalKey, modalKey);
        }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: '95vw',
            maxHeight: '90vh',
            borderRadius: 'md',
            // p: 3,
            // px: 6,
            boxShadow: 'lg',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          {/* <Typography component="h2" textColor="inherit" fontWeight="lg" mb={1}>
            {message}
          </Typography> */}
          <Box sx={{
            overflow: 'auto', flexShrink: '1',
            p: 3,
            pt: 1,
            px: 6,
          }}>
            {children}
          </Box>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}