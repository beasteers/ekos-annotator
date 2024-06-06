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
`
const Bo = ({ c='primary', children, ...p }) => <Typography variant="soft" color={c} fontWeight={700} noWrap {...p}>{children}</Typography>

const FormMeta = (data) => (<>
  {Object.entries(data).map(([k, v]) => v != null && <input type='hidden' value={`${v}`} name={k} key={k} />)}
</>)

const imageProcess = (img, { baseUrl }) => ({...img, src: img.src || `${baseUrl||''}/${img.file_name.replace(/^\//, '')}`})


const ImageForm = ({ 
    children, images, noun, 
    page, total, 
    action, meta, 
    assignmentId, batchId,
    baseUrl
  }) => {
    images = useMemo(() => images?.map(d => imageProcess(d, { baseUrl })), [images, baseUrl])
    return (
      <CssVarsProvider defaultMode="dark" modeStorageKey="image-ann-color-mode" theme={theme}>
        <CssBaseline />
        <Box p={2}>
        <form action={action}>
            {/* Metadata */}
            <FormMeta {...{ noun, page, batchId, ...meta }} />
            <input type='hidden' value={assignmentId} name='assignmentId' id='assignmentId'/>
            <Stack spacing={1}>
              {children}
              {/* Images */}
              <ImageGrid data={images} />

              {/* Submit */}
              {images && <Button type='submit' variant='soft' color='neutral' sx={{ p: 1 }}>
                {page == null || page === total ? 'Submit' : `Next (${page}/${total || '-'})`}
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
]
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
]

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

const KeyHints = () => {
  return (<Box justifyContent='center' flexWrap='wrap' mb={1} sx={{ display: { xs: 'none', md: 'flex' }}}>
    <Typography>
      <Chip color='primary'>Tab</Chip>: Next Image, 
    </Typography>
    <Typography>
    <Chip color='primary'>Shift-Tab</Chip>: Prev Image, 
    &nbsp;&nbsp;&nbsp;
    </Typography>
    <Typography>
      <Chip color='primary'>Space</Chip>,<Chip color='primary'>Return</Chip>: Select / Submit, 
    </Typography>
    </Box>)
}

export function Task1(props) {
  const { noun, baseUrl } = props;
  let pos = useMemo(() => POS_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [POS_EXAMPLES, baseUrl])
  let neg = useMemo(() => NEG_EXAMPLES?.map(d => imageProcess(d, { baseUrl })), [NEG_EXAMPLES, baseUrl])
  return <ImageForm {...props}>
        <Stack spacing={1} alignItems='center'>
          <Typography level='h3' sx={{ fontWeight: 400 }}>
            Please select images where
            <Typography sx={{ fontSize: '1.8em' }}>
              <Co>[</Co><b>{noun || '—'}</b>(s)<Co>]</Co>
            </Typography>
            are correctly segmented.
          </Typography>
        </Stack>
        <KeyHints />
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
  </ImageForm>
}

export default function Task({ task='segmentation', ...props }) {
  switch (task) {
    case 'segmentation':
      return <Task1 {...props} />
    default:
      return <Typography>Task {task} not found</Typography>
  }
}