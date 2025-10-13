import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Button from '../Button';

const H1 = styled.h1`
  position: absolute;
  top: 80px;
  font-family: 'Goblin One';
  font-size: 1.875rem;
  text-align: center;
`;

const TitleContainer = styled.section`
  height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 1) 100%),
    url(${props => props.src});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const TitleH2 = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  font-family: 'Nanum Brush Script';
  @media screen and (min-width: 1024px) {
    margin: ${props => props.$margin || ''};
  }
`;

const Figure = styled.figure`
  transform: 50%;
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem 0 0 0;
  @media screen and (min-width: 1024px) {
    visibility: hidden;
  }
`;

const Img = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  order: 2;
`;

const Figcaption = styled.figcaption`
  font-size: 0.625rem;
`;

const ButtonWapper = styled.div`
  position: absolute;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1024px) {
    bottom: -50px;
  }
`;

function CampMainSection() {
  return (
    <TitleContainer src='camp1.webp'>
      <H1>FIELD CAMP</H1>
      <TitleH2>FIELD CAMP를 통해</TitleH2>
      <TitleH2 $margin='10px 0 0 0 '>여러분의 열정을 보여주세요!!</TitleH2>
      <ButtonWapper>
        <Link to='https://linktr.ee/iefieldcamp'>
          <Button mg='0 0 1rem 0' label='FIELD CAMP 지원하기' animate />
        </Link>
        <Figure>
          <Img src='transfer-down-light.svg' />
          <Figcaption>아래로 스크롤하세요</Figcaption>
        </Figure>
      </ButtonWapper>
    </TitleContainer>
  );
}

export default CampMainSection;
