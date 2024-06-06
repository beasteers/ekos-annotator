import React, { useId } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
    position: relative;
    display: flex;

    img {
        width: 100%;
        height: auto;
        border-radius: 0.25rem;
        border: 1px solid #333;
    }

    &:hover {
        svg polygon {
            fill: rgba(255, 0, 0, 0);
        }
    }
`;

const Polygon = styled.polygon`
    fill: rgba(255, 0, 0, 0.3);
    stroke: red;
    stroke-width: 0.004;
    transition: opacity 0.3s ease-in-out;
`;
const Mask = styled.mask`
    rect { 
        fill: black; 
    }
    &:hover rect {
        opacity: 0.5;
    }
`;

const SegmentedImage = ({ imageUrl, polygons }) => {
    const id = useId();
    return (
        <ImageContainer>
            <img src={imageUrl} alt="Segmented Image" loading="lazy" />
            {polygons && <svg
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
            >
                <Mask id={`${id}-mask`}>
                <rect width="1" height="1" />
                {polygons.map((polygon, index) => (
                    <Polygon
                        key={index}
                        points={polygon.map(point => point.join(',')).join(' ')}
                        fill='black'
                    />
                ))}
                </Mask>
                <rect width="1" height="1" fill="white" mask={`url(#${id}-mask)`} />
                {polygons.map((polygon, index) => (
                    <Polygon
                        key={index}
                        points={polygon.map(point => point.join(',')).join(' ')}
                    />
                ))}
            </svg>}
        </ImageContainer>
    );
};

export default SegmentedImage;
