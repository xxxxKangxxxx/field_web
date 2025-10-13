import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button';
import NewTimeLine from '../NewTimeLine';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

function CampTimeLine() {
  return (
    <>
      <NewTimeLine />
      <Container>
        <Link to='https://linktr.ee/iefieldcamp'>
          <Button mg='4rem 0' label='FIELD CAMP 지원하기' animate />
        </Link>
      </Container>
    </>
  );
}

export default CampTimeLine;
