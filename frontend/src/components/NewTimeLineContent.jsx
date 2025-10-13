import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const TimeLineContainer = styled.div`
  div:last-child {
    margin: 0 auto 0;
  }

  @media (min-width: 1024px) {
    div:nth-child(even) {
      float: left;
      margin: 0 10% 0 0;
    }
    div:nth-child(odd) {
      float: right;
      margin: 0 0 0 10%;
    }
  }
`;

const DayDiv = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin: 0 auto 4rem;

  @media (min-width: 1024px) {
    width: 45%;
  }
`;

const DayTitle = styled.h3`
  font-size: 1rem;
  font-family: 'Goblin One';
  margin: 0 0 3rem 0;
`;

const SubTitle = styled.h4`
  font-size: 0.875rem;
  color: ${theme.colors.yellow};
  font-weight: 900;
  margin: 0 0 1rem 0;
`;

const Detail = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  word-break: keep-all;
  margin: 0 0 4rem 0;
`;

export default function NewTimeLineContent({data}) {
  const day = Object.keys(data);
  return (
    <TimeLineContainer>
      {day.map(nowDay => (
        <DayDiv key={nowDay}>
          <DayTitle>{data[nowDay][0]}</DayTitle>
          {data[nowDay][1].map(item => (
            <React.Fragment key={item}>
              <SubTitle>{item[0]}</SubTitle>
              <Detail>{item[1]}</Detail>
            </React.Fragment>
          ))}
        </DayDiv>
      ))}
    </TimeLineContainer>
  );
}
