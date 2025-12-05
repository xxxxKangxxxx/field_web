import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';

const TimelineBlock = styled.div`
  position: relative;
  width: -webkit-calc(50% + 12px);
  width: -moz-calc(50% + 12px);
  width: calc(50% + 12px);
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -moz-box-pack: justify;
  justify-content: space-between;
  clear: both;
  float: ${props => props.$float || ''};
  direction: ${props => props.direction || ''};
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateX(${props => props.$float === 'left' ? '-50px' : '50px'});
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;

  &.animate {
    opacity: 1;
    transform: translateX(0);
  }
`;

const H3 = styled.h3`
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 1rem;
  font-weight: 500;
`;

const Span = styled.span`
  font-size: 20px;
  color: #a4a4a4;
`;

const P = styled.p`
  font-size: 0.75rem;
  line-height: 1.5em;
  word-spacing: 1px;
  color: #888;
  word-break: keep-all;
`;

const Marker = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #f5f7fa;
  background: #4fc1e9;
  margin-top: 10px;
  z-index: 50;
  transform: scale(0);
  transition: transform 0.5s ease-out 0.3s;

  &.animate {
    transform: scale(1);
  }
`;

const TimelineContent = styled.div`
  width: calc(100% - 24px);
  padding: 0 36px;
  color: white;
`;

function TimelineDetail({float, direction, firstTitle, secondTitle, year, description}) {
  const blockRef = useRef(null);
  const markerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            entry.target.classList.add('animate');
            if (markerRef.current) {
              markerRef.current.classList.add('animate');
            }
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      if (blockRef.current) {
        observer.unobserve(blockRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <TimelineBlock ref={blockRef} $float={float} direction={direction}>
      <Marker ref={markerRef} />
      <TimelineContent>
        <H3>{firstTitle}</H3>
        <H3>{secondTitle}</H3>
        <Span>{year}</Span>
        <P>{description}</P>
      </TimelineContent>
    </TimelineBlock>
  );
}

export default TimelineDetail;
