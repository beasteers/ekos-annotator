import * as React from 'react';
import styled, { keyframes } from 'styled-components'
import { useId, useState } from 'react';
import Button from '@mui/joy/Button';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import Alert from '@mui/joy/Alert';
import SegmentedImage from './SegmentedImage';
import { Box, Typography } from '@mui/joy';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


/* -------------------------------------------------------------------------- */
/*                                 Image Input                                */
/* -------------------------------------------------------------------------- */

const BUTTONS = [
    {x: "correct", color: "success", icon: <CheckIcon />},
    // {x: "ambiguous", color: "warning"},
    {x: "wrong", color: "danger", icon: <CloseIcon />},
]

function JoyRadio({ value, setValue, fieldId, buttons=BUTTONS, defaultValue='correct', optionLabels }) {
  const id = useId();

  return (
    <ToggleButtonGroup 
      value={value} variant='outlined' role="radiogroup"
      onChange={(event, newValue) => { setValue(newValue || buttons[(buttons.findIndex(({x}) => x === value) + 1) % buttons.length].x) }}
    >
      {buttons.map(({ x, text, color, icon }) => (
        <Button key={x} value={x} color={color} variant={'outlined'} role="radio" tabIndex={x === value ? -1 : 0} sx={{
          // fontSize: x === value ? '1.3em' : '1em',
          fontSize: '1.3em',
          flexGrow: 1,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }} startDecorator={x === value && icon}>
          {/* {x === value && icon} */}
          {" "}
          {optionLabels?.[x]||text||x}
          <div style={{display: 'none'}}>
            <label htmlFor={`${x}-${id}`}>{optionLabels?.[x]||text||x}</label>
            <input type="radio" id={`${x}-${id}`} name={`${fieldId}_label`} value={x} checked={x === value} />
          </div>
        </Button>
      ))}
    </ToggleButtonGroup>
  );
}

const LabeledImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1.4em;

    .image-wrap {
      position: relative;
      display: flex;
      & > .MuiTypography-root {
        position: absolute;
        /* bottom: 0.2em; */
        top: 0.2em;
        left: 50%;
        transform: translateX(-50%);
      }
      img {
        width: 100%;
        height: auto;
      }
    }
`;


export const LabeledImage = ({ src, label, children, color='success' }) => {
  return (
      <LabeledImageContainer>
        <div className='image-wrap'>
          <Typography className='image-label' variant='solid' bgcolor={`rgba(var(--joy-palette-${color}-mainChannel) / 0.60)`} fontWeight={700} noWrap>
            {label}
          </Typography>
          <img src={src} loading='lazy' />
        </div>
        <div>
        {children && <Typography variant='soft' color='primary' sx={{display: 'block'}}>
          {color === 'success' ? '✅' : 
           color === 'danger' ? '❌' : 
           ''}&nbsp;
          {children}
        </Typography>}
        </div>
      </LabeledImageContainer>
  )
}


/* -------------------------------------------------------------------------- */
/*                                 Image Grid                                 */
/* -------------------------------------------------------------------------- */


const ImageGridContainer = styled.div`
  /* display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px; */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr));
  /* grid-template-rows: repeat(3, 400px); */
  gap: 12px;
  /* max-width: 50em; */
`;


const ImageContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    img {
      border-bottom: 0px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
`;

const SAMPLE_POLY = [[[0.1, 0.1],[0.2, 0.1],[0.2, 0.2],[0.1, 0.2],],[[0.3, 0.3],[0.4, 0.3],[0.4, 0.4],[0.3, 0.4],]]

const ImageCard = ({ id, src, file_name, polygons, sx, fieldId, defaultValue='correct', optionLabels }) => {
    const [ value, setValue ] = React.useState(defaultValue);
    id = id || src.split('/').pop();
    return (
        <ImageContainer onClick={() => console.log({src, file_name, id, polygons}) || console.log(JSON.stringify({file_name, polygons}))}>
            <input type="hidden" name={`${fieldId}_id`} value={id} />
            <SegmentedImage src={src} polygons={polygons}>
              <JoyRadio value={value} fieldId={fieldId} setValue={setValue} optionLabels={optionLabels} />
            </SegmentedImage>
        </ImageContainer>
    )
}

export const ImageGrid = ({ data, ...props }) => {
  return (
    <ImageGridContainer>
      {data?.map(({ src, id, ...d }, i) => <ImageCard key={src} fieldId={id || `img_${i}`} id={id} {...props} {...d} src={src} />) 
       || <Alert color="warning" sx={{justifyContent: 'center'}}>No images found</Alert>}
    </ImageGridContainer>
  )
}
export default ImageGrid;