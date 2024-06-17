import React, { useState } from 'react';
import { Modal, Box, Grid, Tooltip, Chip, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails, AccordionGroup } from '@mui/joy';
import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/system/useMediaQuery';
import { useTheme } from '@mui/joy/styles';

const ImageGrid = ({ images, children }) => {
  const [currentImage, setCurrentImage] = useState(null);
  const { src, description, label, noun } = currentImage || {};

  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.up('xs'));
  const sm = useMediaQuery(theme.breakpoints.up('sm'));
  const xl = useMediaQuery(theme.breakpoints.up('xl'));
  const mini = xl ? 4 : sm ? 3 : 0;

  const initialImages = images.slice(0, mini);
  const remainingImages = images.slice(mini);

  const Image = (image) => (
    <Tooltip title={<>
        {image.label === 'correct' ? '✅' : '❌'}&nbsp;{image.noun}:&nbsp;
        {image.description}
    </>} arrow placement='top'>
        <Box position="relative" sx={{cursor: 'pointer'}} onClick={() => setCurrentImage(image)}>
            <img src={image.src} width="100%" />
            {sm && <Chip
                color={image.label === 'correct' ? 'success' : 'danger'}
                style={{ position: 'absolute', top: 0, left: 4, transform: 'translateY(-50%)' }}
            >
            {image.label === 'correct' ? '✅' : '❌'}&nbsp;{image.noun}
            </Chip>}
        </Box>
    </Tooltip>
  )

  return (
    <Box flex='1 1 0px' p={0.5} pb={0} mb={3} sx={{
        border: '1px solid var(--joy-palette-neutral-500)',
        borderRadius: 'md',
        display: 'flex',
        flexDirection: 'column',
    }}>
        {children}
        
        <Grid container spacing={1}>
            {initialImages.map((image, index) => (
            <Grid item xs={6} sm={4} xl={3} mt={2} key={index} justifyContent="center">
                <Image {...image} />
            </Grid>
            ))}
        </Grid>
        <AccordionGroup>
        <Accordion sx={{
            width: '100%', 
            flexDirection: 'column-reverse',
            // display: remainingImages.length ? 'flex' : 'none',
            opacity: remainingImages.length ? '1' : '0',
            pointerEvents: remainingImages.length ? 'auto' : 'none',
            minHeight: 0,
            mt: 1,
        }}>
            <AccordionSummary indicator={<AddIcon />} sx={{
                mb: 0,
                position: 'relative',
                minHeight: 0,
                height: 0,
                padding: 0,
                justifyContent: 'center',
                '& button span': {
                    transition: 'transform 0.3s',
                    '&.Mui-expanded': {
                        transform: 'rotate(45deg)',
                    },
                },
                '& button': {
                    borderRadius: '10rem',
                    mx: 1, my: 0, 
                    width: '1em',
                    height: '0.8em',
                    minWidth: '1em',
                    boxSizing: 'content-box',
                    minHeight: 0,
                    bgcolor: 'primary.solidBg',
                    color: 'primary.solidColor',
                    transition: 'background-color 0.3s',
                    transform: 'translateY(-50%)',
                    flexGrow: 0,
                    flexBasis: 'content',
                    ':not(.Mui-selected, [aria-selected="true"]):hover': {
                        // bgcolor: 'transparent',
                        bgcolor: 'primary.solidHoverBg',
                        color: 'primary.solidColor',
                    }
                },
            }} slotProps={{
                button: {tabIndex: -1},
            }}>
              More
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={1}>
                    {remainingImages.map((image, index) => (
                    <Grid item xs={4} md={3} lg={3} mt={2} key={index}>
                        <Image {...image} />
                    </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
        </AccordionGroup>

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

export default ImageGrid;
