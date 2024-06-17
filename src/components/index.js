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
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { Sheet } from '@mui/joy';

function App() {
  return <CssVarsProvider theme={theme}>…</CssVarsProvider>;
}

/* ---------------------------------- Utils --------------------------------- */

const Hi = styled.span`
  background-color: #ffc803;
  display: inline-block;
`
const Co = styled.span`
  color: #ffc803;
  margin: 0 0.2em;
`
const Bo = ({ c='primary', children, ...p }) => <Typography variant="soft" color={c} fontWeight={700} noWrap {...p}>{children}</Typography>

const FormMeta = (data) => (<>
  {Object.entries(data).map(([k, v]) => v != null && <input type='hidden' value={`${v}`} name={k} key={k} />)}
</>)

const imageProcess = (img, { baseUrl }) => ({...img, src: img.src || `${baseUrl||''}/${img.file_name.replace(/^\//, '')}`})


const ImageForm = ({ 
    children, help, 
    images,
    page, total, 
    action, 
    assignmentId, batchId,
    baseUrl,
    onSubmit,
    optionLabels,
    formMeta,
    ...props
  }) => {
    let { noun, state } = props;
    console.log(images)
    images = useMemo(() => images?.map(d => imageProcess(d, { baseUrl })), [images, baseUrl])
    page = page == null && total != null ? 0 : page;



    return (
      <CssVarsProvider defaultMode="dark" modeStorageKey="image-ann-color-mode" theme={theme}>
        <CssBaseline />
        <Box p={2}>
        <form action={action}>
            {/* Metadata */}
            <FormMeta {...{ page: page+1, batchId, ...formMeta }} />
            <input type='hidden' value={assignmentId} name='assignmentId' id='assignmentId'/>
            <Stack spacing={1}>
              {help}
              {/* <Sheet variant='outlined' elevation={4} sx={{
                py: 4,
                borderRadius: '0.4em',
                // bgcolor: 'primary.softBg',
                marginBottom: '1em !important',
              }}>
              <Stack spacing={1}>
                {children}
              </Stack>
              </Sheet> */}
              {children}
              
              
              {/* Images */}
              <ImageGrid data={images} optionLabels={optionLabels} />

              {/* Submit */}
              {images && <Button type='submit' variant='soft' color='primary' sx={{ p: 1 }} onSubmit={onSubmit}>
                {page == null || page+1 == total ? 'Submit' : `Next (${page+1}/${total || '-'})`}
              </Button>}
            </Stack>
          </form>
        </Box>
      </CssVarsProvider>
    )
}

/* -------------------------------------------------------------------------- */
/*                       Task 1: Mask Quality Assessment                      */
/* -------------------------------------------------------------------------- */

const POS_EXAMPLES = [
  {
    "file_name": "P02_128_58_6020_pre_xmem_spoon.jpg",
    "noun": "spoon", "label": "correct",
    "description": "Most of the spoon is segmented, but the handle is not."
  },
  {
    "file_name": "P30_107_525_78555_pre_xmem_fork.jpg",
    "noun": "fork", "label": "correct",
    "description": "The object is difficult to see, but given the context, you can reasonably guess it is a fork."
  },
  {
    "file_name": "P04_03_137_30049_pre_xmem_drawer.jpg",
    "noun": "drawer", "label": "correct",
    "description": "If the segmentation contains multiple of an object (e.g. multiple drawers in a fridge), it can be considered correct."
  },
  {
    "file_name": "P30_107_626_96660_mid_xmem_choi:pak.jpg",
    "noun": "pak choi", "label": "correct",
    "description": "The object segmented is pak choi."
  },
  {
    "file_name": "P30_107_918_149015_mid_egohos_cupboard.jpg",
    "noun": "cupboard", "label": "correct",
    "description": "The object segmented is the edge of the cupboard."
  },
  {
    "file_name": "P30_07_21_2916_mid_xmem_mug.jpg",
    "noun": "mug", "label": "correct",
    "description": "The mug is segmented."
  },
  {
    "file_name": "P02_03_126_21779_pre_xmem_onion.jpg",
    "noun": "onion", "label": "correct",
    "description": "Looks like an onion."
  }
].map(d => ({src: `/images/frames/${d.file_name}`, ...d}))
const NEG_EXAMPLES = [
  {
      "file_name": "P09_106_13_3589_mid_xmem_juice.jpg",
      "noun": "juice", "label": "incorrect",
      "description": "The juice is not highlighted, something else in the fridge is."
  },
  {
      "file_name": "P30_107_918_148955_pre_xmem_cupboard.jpg",
      "noun": "cupboard", "label": "incorrect",
      "description": "The highlighted object is cutlery, not a cupboard."
  },
  {
      "file_name": "P25_09_78_34912_pre_xmem_sponge.jpg",
      "noun": "sponge", "label": "incorrect",
      "description": "Dish soap is segmented instead of the sponge."
  }
].map(d => ({src: `/images/frames/${d.file_name}`, ...d}))

function Task1Help() {
  return (<Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
    <PopupExample message={<>
    {/* What does <Bo c="success">correct</Bo> or <Bo c="danger">incorrect</Bo> look like? */}
     Guidelines & Examples
    </>} color='primary'>
    <Typography level='h4'>
      Examples of <Bo c="success">Correct</Bo> Annotations
    </Typography>
    <div>
      {POS_EXAMPLES.map(({ src, label, description }) => (
        <LabeledImage src={src} label={label}>{description}</LabeledImage>
      ))}
    </div>

    <Typography level='h4'>
      Examples of <Bo c="danger">Incorrect</Bo> Annotations
    </Typography>
    <div>
      {NEG_EXAMPLES.map(({ src, label, description }) => (
        <LabeledImage src={src} label={label} color='danger'>{description}</LabeledImage>
      ))}
    </div>

    <div>
      <Typography level='h4'>
      Description:
      </Typography>
      <ul>
        <li>Does the noun describe the content of the segmentation?</li>

        <li>The precise boundaries of the object are less important, so if the object is partially segmented, it can still be considered correct.</li>

        <li>If the segmentation also contains multiple similar objects, it can still be considered correct as long as the object of interest is segmented.</li>
      </ul>
      For ambiguous cases, consider the context of the image and use your best judgement.
      
    </div>

    <Typography level='h4'>
      The annotation is <b>Correct</b> when:
    </Typography>
    <ul>
      <li>
        The object is <Bo c="primary">present</Bo> and <Bo c="primary">segmented.</Bo>
      </li>
      <li>
        The object is <Bo c="warning">not present</Bo> and <Bo c="warning">nothing is segmented.</Bo>
      </li>
      <li>
        The precise boundaries of the object are less important, so if the object is partially segmented, it can still be considered correct.
      </li>
      <li>
        If the segmentation also contains multiple similar objects, it can still be considered correct as long as the object of interest is segmented.
      </li>
    </ul>

    <Typography level='h4'>
    The annotation is <b>Incorrect</b> when:
    </Typography>
    <ul>
      <li>
        The object is <Bo c="primary">present</Bo> and <Bo c="warning">not segmented.</Bo>
      </li>
      <li>
      Something else is <Bo c="primary">segmented.</Bo>
      </li>
      <li>
        If the segmentation also contains multiple different objects, it should be considered incorrect
      </li>
    </ul>
  </PopupExample>
  </Stack>)
}


const Instructions = () => {
  return (<Stack spacing={1} direction='row' justifyContent='center' alignItems='center'>
  <PopupExample message={<>
    Instructions
    </>} color='primary'>
      <KeyHints />
      <Typography level='h1' sx={{ fontWeight: 400 }} mb={2}>
      <Typography level='h1' sx={{ fontWeight: 900 }}>Question: </Typography>
        Does the label describe the segmented object?
      </Typography>
      <Typography mb={1}>
        The images are taken from egocentric videos of people performing household tasks, typically in their kitchen. 
      </Typography>
      <Typography mb={1}>
        Your job is to determine if the label accurately describes the segmented object. 
        This means that your primary focus is 
      </Typography>
      {/* <Typography>
        This can mean:
        <ul>
          <li></li>
        </ul>
      </Typography> */}
    </PopupExample>
  </Stack>)
}


const LabelBox = ({ title, children, button, sx, titleProps, ...props }) => {
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


const KeyHints = () => {
  return (
      <LabelBox title='Keyboard Shortcuts'>
        <Stack gap={2} direction='row' justifyContent='center' flexWrap='wrap' sx={{ 
          display: { xs: 'none', md: 'flex' },
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

export function Task1(props) {
  const { noun, baseUrl, aliases } = props;
  let pos = useMemo(() => POS_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [POS_EXAMPLES, baseUrl])
  let neg = useMemo(() => NEG_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [NEG_EXAMPLES, baseUrl])
  return <ImageForm {...props} 
                    optionLabels={{ correct: noun, wrong: `not ${noun}` }} 
                    formMeta={{ noun }} 
                    help={<>
    {/* <Task1Help /> */}
    <Box display='flex' gap={2} alignItems='start'>
      <ExampleGrid images={pos}>
        <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
        Examples of <Bo c="success">Correct</Bo> Annotations
        </Typography>
      </ExampleGrid>
      <ExampleGrid images={neg}>
        <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
        Examples of <Bo c="danger">Incorrect</Bo> Annotations
        </Typography>
      </ExampleGrid>
    </Box>
  </>}>
    <LabelBox button={<Instructions />}>
    {/* <Stack spacing={1} alignItems='center'> */}
      {/* <Typography level='h3' sx={{ fontWeight: 400 }}>
        Please select images where
        <Typography sx={{ fontSize: '1.8em' }}>
          <Co>[</Co><b>{noun || '—'}</b>(s)<Co>]</Co>
        </Typography>
        are correctly segmented.
      </Typography> */}

      <Typography textAlign='center' level='h3' sx={{ fontWeight: 400 }}>
        Can this object be described as
        <Typography sx={{ fontSize: '1.8em' }}>
          <Co>[</Co><b>{noun || '—'}</b>(s)<Co>]</Co>
        </Typography>
      </Typography>
      {aliases?.length && <Stack direction='row' gap={2} justifyContent='center'>
      <Typography>
        Also accepted:
      </Typography>
      <Stack direction='row' gap={2} justifyContent='center' sx={{overflow: 'auto'}}>
      {aliases.map(x => <Chip variant='soft' color='primary' key={x}>{x}</Chip>)}
      </Stack>
      </Stack>}
    {/* </Stack> */}
    
    {/* <Task1Help /> */}
    
    </LabelBox>
  </ImageForm>
}


export function Task2(props) {
  console.log(props)
  const { noun, state, baseUrl, aliases } = props;
  let pos = useMemo(() => POS_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [POS_EXAMPLES, baseUrl])
  let neg = useMemo(() => NEG_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [NEG_EXAMPLES, baseUrl])
  return <ImageForm {...props} 
                    optionLabels={{ correct: state, wrong: `not ${state}` }} 
                    formMeta={{ noun, state }} 
                    help={<>
    {/* <Task1Help /> */}
    <Box display='flex' gap={2} alignItems='start'>
      <ExampleGrid images={pos}>
        <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
        Examples of <Bo c="success">Correct</Bo> Annotations
        </Typography>
      </ExampleGrid>
      <ExampleGrid images={neg}>
        <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
        Examples of <Bo c="danger">Incorrect</Bo> Annotations
        </Typography>
      </ExampleGrid>
    </Box>
  </>}>
    <LabelBox button={<Instructions />}>
      <Typography textAlign='center' level='h3' sx={{ fontWeight: 400 }}>
        Is the <b>{noun || 'object'}</b>
        <Typography sx={{ fontSize: '1.8em' }}>
          <Co>[</Co><b>{state || '—'}</b><Co>]</Co>
        </Typography>
      </Typography>
      {/* {aliases?.length && <Stack direction='row' gap={2} justifyContent='center'>
      <Typography>
        Also accepted:
      </Typography>
      <Stack direction='row' gap={2} justifyContent='center' sx={{overflow: 'auto'}}>
      {aliases.map(x => <Chip variant='soft' color='primary' key={x}>{x}</Chip>)}
      </Stack>
      </Stack>} */}
    {/* </Stack> */}
    
    {/* <Task1Help /> */}
    
    </LabelBox>
  </ImageForm>
}

// export function Task2(props) {
//   const { predicate, baseUrl } = props;
//   let pos = useMemo(() => POS_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [POS_EXAMPLES, baseUrl])
//   let neg = useMemo(() => NEG_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [NEG_EXAMPLES, baseUrl])
//   return <ImageForm {...props}>
//         <Stack spacing={1} alignItems='center'>
//           <Typography level='h3' sx={{ fontWeight: 400 }}>
//             Please select images where the highlighted object can be described as
//             <Typography sx={{ fontSize: '1.8em' }}>
//               <Co>[</Co><b>{predicate || '—'}</b><Co>]</Co>
//             </Typography>
//           </Typography>
//         </Stack>
//         <KeyHints />
//         <Task1Help />
//         <Box display='flex' gap={2} alignItems='start'>
//         <ExampleGrid images={pos}>
//           <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
//           Examples of <Bo c="success">Correct</Bo> Annotations
//           </Typography>
//         </ExampleGrid>
//         <ExampleGrid images={neg}>
//           <Typography variant='h6' textAlign='center' mt={1} mb={0.5}>
//           Examples of <Bo c="danger">Incorrect</Bo> Annotations
//           </Typography>
//         </ExampleGrid>
//         </Box>
//   </ImageForm>
// }

export default function Task({ task='noun', ...props }) {
  switch (task) {
    case 'noun':
      return <Task1 {...props} />
    case 'pred':
      return <Task2 {...props} />
    default:
      return <Typography>Task {task} not found</Typography>
  }
}