import 'style/index.css';
import * as React from 'react';
import { useMemo } from 'react';
import styled, { keyframes } from 'styled-components'
import Button from '@mui/joy/Button';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import CssBaseline from '@mui/joy/CssBaseline';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import PopupExample from './PopupExample';
import ImageGrid, { LabeledImage } from './ImageGrid';
import ExampleGrid from './ExampleGrid';
import theme from '../theme';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { Sheet } from '@mui/joy';
import { turkGetParam, turkGetSubmitToHost } from './externalHIT_v1';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
/* ---------------------------------- Utils --------------------------------- */


const FormMeta = (data) => (<>
  {Object.entries(data).map(([k, v]) => v != null && <input type='hidden' value={`${v}`} name={k} key={k} />)}
</>)

const imageProcess = (img, { baseUrl }) => ({...img, src: img.src || `${baseUrl||''}/${img.file_name.replace(/^\//, '')}`})


// const ImageForm = ({ 
//     children, help, 
//     images,
//     page, total, 
//     id,
//     action, 
//     method='get',
//     assignmentId, batchId,
//     baseUrl,
//     onSubmit,
//     optionLabels,
//     formMeta,
//     ...props
//   }) => {
//     let { noun, state } = props;
//     console.log(images)
//     images = useMemo(() => images?.map(d => imageProcess(d, { baseUrl })), [images, baseUrl])
//     page = page == null && total != null ? 0 : page;

//     const { current: startTime } = React.useRef(Date.now());
//     const submitTimeRef = React.useRef();

//     const isFinalPage = page == null || page+1 == total;

//     return (
//       <CssVarsProvider defaultMode="dark" modeStorageKey="ekos-annotator-color-mode" theme={theme}>
//         <CssBaseline />
//         <Box p={2}>
//         <form id={id} method={method} action={(action == 'local' ? action || turkGetSubmitToHost() : null)} onSubmit={e => {
//           submitTimeRef.current.value = Date.now();
//         }}>
//             <input type='hidden' value="" name='submitTime' ref={submitTimeRef} />
//             {/* Metadata */}
//             <FormMeta {...{ page: page+1, batchId, startTime, ...formMeta }} />
//             <input type='hidden' value={assignmentId || turkGetParam("assignmentId", "")} name='assignmentId' id='assignmentId'/>
//             <Stack spacing={1}>
//               {help}
//               {children}
//               {/* Images */}
//               <ImageGrid data={images} optionLabels={optionLabels} />
//               {/* Submit */}
//               {images && <Button type='submit' variant='soft' color='primary' sx={{ p: 1 }} onSubmit={onSubmit}>
//                 {isFinalPage ? 'Submit' : `Next (${page+1}/${total || '-'})`}
//               </Button>}
//             </Stack>
//           </form>
//         </Box>
//       </CssVarsProvider>
//     )
// }

export const DarkModeButton = () => {
  const {mode, setMode} = useColorScheme();
  const toggleMode = () => setMode(mode === 'dark' ? 'light' : 'dark');
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, padding: '0.2em', opacity: 0.2, transition: 'opacity 0.2s ease-in-out', '&:hover': {opacity: 1} }}>
      {mode === 'dark' ? <Brightness7Icon onClick={toggleMode} /> : <Brightness4Icon onClick={toggleMode} />}
    </Box>
  )
}

const ImageFormContent = ({ 
  children, help, 
  images,
  page, total, 
  baseUrl,
  onSubmit,
  optionLabels,
  formMeta,
  ...props
}) => {
  images = useMemo(() => images?.map(d => imageProcess(d, { baseUrl })), [images, baseUrl])
  page = page == null && total != null ? 0 : page;

  const { current: startTime } = React.useRef(Date.now());
  const submitTimeRef = React.useRef();

  const isFinalPage = page == null || page+1 == total;
  const assignmentId = turkGetParam("assignmentId", "");
  const workerId = turkGetParam("workerId", "");
  const hitId = turkGetParam("hitId", "");
  const mode = turkGetParam("mode", "");
  const disabled = assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE';

  return (
      <Box p={2}>
        <input type='hidden' value="" name='submitTime' ref={submitTimeRef} />
          {/* Metadata */}
          <FormMeta {...{ page: page+1, startTime, ...formMeta }} />
          {/* MT seems to handle these itself */}
          {assignmentId && <input type='hidden' value={assignmentId} name='mt_assignmentId' />}
          {workerId && <input type='hidden' value={workerId} name='mt_workerId' />}
          {hitId && <input type='hidden' value={hitId} name='mt_hitId' />}
          {mode && <input type='hidden' value={mode} name='mt_mode' />}
          
          <Stack spacing={1}>
            {help}
            {children}
            {/* Images */}
            <ImageGrid data={images} optionLabels={optionLabels} />
            {/* Submit */}
            {images && 
            <Button type='submit' variant='soft' color='primary' disabled={disabled} sx={{ p: 1 }} onSubmit={e => {
              submitTimeRef.current.value = Date.now();
              onSubmit?.(e);
            }}>
              {disabled ? "You must ACCEPT the HIT before you can submit the results." :
                (isFinalPage ? 'Submit' : `Next (${page+1}/${total || '-'})`)}
            </Button>}
          </Stack>
      </Box>
  )
}
const ImageFormWrapper = (props) => {
  return (
    <CssVarsProvider defaultMode="light" modeStorageKey="ekos-annotator-color-mode" theme={theme}>
      <CssBaseline />
    <ImageFormContent {...props} />
    </CssVarsProvider>
  )
}


export const LabelBox = ({ title, children, button, sx, titleProps, ...props }) => {
    return (
        <Sheet variant='outlined' elevation={4} sx={{
          py: 3,
          pb: button != null ? 5 : 3,
          borderRadius: '0.4em',
          // bgcolor: 'primary.softBg',
          marginTop: '1em !important',
          marginBottom: button != null ? '2em !important' : '1em !important',
          position: 'relative',
          ...sx,
        }} {...props}>
          {title && <Box {...titleProps} sx={{ 
            position: 'absolute', top: 0, left: '1em', 
            transform: 'translate(0, -50%)', 
            px: '0.5em',
            bgcolor: 'background.surface',
            ...titleProps?.sx,
          }}>
            {title}
          </Box>}
                
          {children}
  
          {button && <Box sx={{ 
            position: 'absolute', bottom: 0, left: '50%', 
            transform: 'translate(-50%, 50%)', 
            px: '0.5em',
            bgcolor: 'background.surface',
          }}>
            {button}
          </Box>}
      </Sheet>
      )
  }
  
  
export const KeyHints = () => {
    return (
        <LabelBox title='Navigation:'>
          <Stack gap={2} direction='row' justifyContent='center' flexWrap='wrap' sx={{ 
            // display: { xs: 'none', md: 'flex' },
          }}>
            <Typography>
              <Chip color='primary'>Tab</Chip>: Next Image
            </Typography>
            <Typography>
            <Chip color='primary'>Shift-Tab</Chip>: Prev Image
            </Typography>
            <Typography>
              <Chip color='primary'>Space</Chip>,<Chip color='primary'>Return</Chip>: Select / Submit
            </Typography>
            <Typography>
              <Chip color='primary'>Hover</Chip>: Hide mask
            </Typography>
          </Stack>
      </LabelBox>
      )
  }

export default ImageFormWrapper;