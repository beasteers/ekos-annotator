import React, { useState, useId } from 'react';
import styled from 'styled-components';
import Box from '@mui/joy/Box';
import T from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import IconButton from '@mui/joy/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';


const ImageContainer = styled.div`
    position: relative;
    display: flex;
    border-radius: 0.25rem;

    img {
        width: 100%;
        height: auto;
        /* border: 1px solid #333; */
    }
    svg polygon.highlight {
        fill: rgba(255, 255, 255, 1);
        fill-opacity: 0;
        stroke: rgba(255, 0, 95, 1);
        stroke-width: 2.5;
        stroke-opacity: 1;
        stroke-linejoin: round;
        filter: none;
        transition: 
            fill 0.15s ease-in-out, 
            fill-opacity 0.15s ease-in-out, 
            stroke 0.15s ease-in-out, 
            stroke-width 0.15s ease-in-out, 
            stroke-opacity 0.3s ease-in-out,
            filter 0.3s ease-in-out
        ;
    }

    .overlay {
        fill: transparent;
        transition: fill 0.15s ease-in-out;
    }

    &:hover {
        
        .overlay:hover {
            fill: rgba(0, 0, 0, 0.5);
        }
        svg polygon.highlight {
            fill-opacity: 0.2;
            stroke: rgba(255, 255, 255, 1);
            stroke-width: 1.4;
            stroke-opacity: 0.7;
            filter: drop-shadow(2px 4px 6px #4444dd);
        }
        svg g {
            &:hover {
                polygon.highlight {
                    fill-opacity: 0;
                    stroke-width: 0.5;
                    stroke-opacity: 0;
                }
                .overlay {
                    fill: rgba(0, 0, 0, 0);
                }
            }
        }


    }
`;


const zoomToPolygon = ({ polygons, width, height, scaleFactor = 2, maxScale = 2, minScale = 1 }) => {
    const points = polygons?.flat();
    if (!points || points.length === 0) return { transform: 'none', transformOrigin: 'center' };

    // Calculate bounding box of all polygons
    const xs = points.map(point => point[0]);
    const ys = points.map(point => point[1]);

    const minX = Math.min(...xs) / width;
    const maxX = Math.max(...xs) / width;
    const minY = Math.min(...ys) / height;
    const maxY = Math.max(...ys) / height;

    // Center the zoom on the polygon
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const scale = Math.max(Math.min(
        1 / ((maxX - minX) * scaleFactor),
        1 / ((maxY - minY) * scaleFactor),
        maxScale), minScale);

    // Zoom offset
    const maxOffset = (scale - 1) / (2 * scale);  // Constrain the offsets to avoid exceeding image boundaries
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, 0.5 - centerX));
    const offsetY = Math.max(-maxOffset, Math.min(maxOffset, 0.5 - centerY));

    return {
        offsetX, offsetY, scale,
        zoomStyle: {
            transform: `scale(${scale}) translate(${offsetX * 100}%, ${offsetY * 100}%)`,
            transformOrigin: 'center',
        }
    };
};

const Polygons = ({ polygons, width, height }) => {
    const id = useId();
    return (
        <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            viewBox={`0 0 ${width-1} ${height-1}`}
            preserveAspectRatio="none"
        >
            {/* <defs>
                <mask id={`mask-${id}`} x="0" y="0" width="100%" height="100%">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    {polygons?.map((polygon, i) => (
                        <polygon
                            key={i}
                            points={polygon.map(point => point.join(',')).join(' ')}
                            fill="black"
                        />
                    ))}
                </mask>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.5)" mask={`url(#mask-${id})`} className='overlay' /> */}
            <g>
            {polygons?.map((pts, i) => (<polygon key={i} className='highlight' points={pts.map(p => p.join(',')).join(' ')} />))}
            </g>
        </svg>
    );
}

const SegmentedImage = ({ src, polygons, label, correct, children, width = 854, height = 480, granularAccessability=false }) => {
    const { zoomStyle } = zoomToPolygon({ polygons, width, height });

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const LABEL = (
        (label || correct!=null) && <T variant='soft' color={correct ? 'success' : correct === false ? 'danger' : 'primary'} sx={{
            position: 'absolute',
            top: -2,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            fontSize: '1em',
            fontWeight: 'bold',
            borderRadius: 'md',
            textWrap: 'nowrap',

        }}>
            {correct ? '✅' : correct === false ? '❌' : ''}&nbsp;
            {label || (correct ? 'correct' : correct === false ? 'incorrect' : '')}
        </T>
    )

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {LABEL}
            <IconButton sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} onClick={handleOpen} tabIndex={granularAccessability?0:-1}>
                <FullscreenIcon />
            </IconButton>
            <Box sx={{ overflow: 'hidden' }}>
                <ImageContainer style={{ position: 'relative', ...zoomStyle }}>
                    <img src={src}  alt={`Missing image ${src}`} loading="lazy" style={{ width: '100%' }} />
                    {polygons && <Polygons polygons={polygons} width={width} height={height} />}
                </ImageContainer>
            </Box>
            {children}
            <Modal 
                open={open} onClose={handleClose} 
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box
                    sx={{
                        position: 'relative',
                        // position: 'absolute',
                        // top: '50%',
                        // left: '50%',
                        // transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '90vh',
                        // height: '80%',
                        // bgcolor: 'background.paper',
                        bgcolor: 'background.surface',
                        // p: 4,
                        borderRadius: 'md',
                        
                    }}
                >
                    <ModalClose sx={{ m: 1 }} />
                    {LABEL}
                    <ImageContainer style={{ position: 'relative', borderRadius: '0.3em', boxShadow: 24, overflow: 'hidden', }}>
                        <img src={src}  alt={`Missing image ${src}`} loading="lazy" style={{ width: '100%' }} />
                        {polygons && <Polygons polygons={polygons} width={width} height={height} />}
                    </ImageContainer>
                    {children}
                </Box>
            </Modal>
        </Box>
    );
};


export default SegmentedImage;
