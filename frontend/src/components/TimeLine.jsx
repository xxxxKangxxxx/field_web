import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const TimelineContainer = styled.div`
  margin: 2rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background-color: ${theme.colors.blue};
  }
`;

const TimelineEvent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  
  &:nth-child(odd) {
    flex-direction: row-reverse;
  }
`;

const TimelineDate = styled.div`
  width: 45%;
  text-align: right;
  padding: 1rem;
  background-color: ${theme.colors.red};
  border-radius: 0.5rem;
  color: white;
  font-weight: bold;
  
  ${TimelineEvent}:nth-child(odd) & {
    text-align: left;
  }
`;

const TimelineContent = styled.div`
  width: 45%;
  padding: 1rem;
  background-color: ${theme.colors.blue};
  border-radius: 0.5rem;
  color: white;
  
  ${TimelineEvent}:nth-child(odd) & {
    text-align: right;
  }
`;

const TimelineDot = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${theme.colors.yellow};
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

function Timeline({ events }) {
  return (
    <TimelineContainer>
      {events.map((event, index) => (
        <TimelineEvent key={index}>
          <TimelineDate>{event.date}</TimelineDate>
          <TimelineDot />
          <TimelineContent>{event.event}</TimelineContent>
        </TimelineEvent>
      ))}
    </TimelineContainer>
  );
}

export default Timeline;
