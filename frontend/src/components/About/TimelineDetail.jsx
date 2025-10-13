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
`;

const TimelineContent = styled.div`
  width: calc(100% - 24px);
  padding: 0 36px;
  color: white;
`;

function TimelineDetail({float, direction, firstTitle, secondTitle, year, description}) {
  return (
    <TimelineBlock $float={float} direction={direction}>
      <Marker />
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
