import React, { useState } from 'react';
import Modal from '@mui/joy/Modal';
import Box from '@mui/joy/Box';
// import Tooltip from '@mui/joy/Tooltip';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';

const ImagePopup = ({ images, children }) => {
  const [currentImage, setCurrentImage] = useState(null);
  const { src, description, label, noun } = currentImage || {};

  return (
    <Box>
        <img src={image.src} width="100%" />

      <Modal
        open={!!currentImage}
        onClose={() => setCurrentImage(null)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box
          sx={{
            width: '80vw',
            maxWidth: 1200,
            maxHeight: '90vh',
            borderRadius: 'md',
            boxShadow: 'lg',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            outline: 'black solid 1px',
          }}
        >
          <Sheet
            sx={{
              p: 1,
              px: 4.5,
              pt: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'stretch',
              flexShrink: '1',
              minHeight: '4em',
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Box sx={{ overflow: 'auto' }}>
              <Typography mt={2} mb={1} textAlign="center">
                <Chip
                  sx={{ mr: 1 }}
                  color={label === 'correct' ? 'success' : label === 'incorrect' ? 'danger' : 'primary'}
                >
                  {label === 'correct' ? '✅' : label === 'incorrect' ? '❌' : ''}&nbsp;{noun}
                </Chip>
                {description}
              </Typography>
            </Box>
          </Sheet>
          <img src={src} alt="Expanded" width="100%" style={{ flexShrink: '0' }} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ImagePopup;
