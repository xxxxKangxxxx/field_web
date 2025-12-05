import React from 'react';
import styled, {keyframes} from 'styled-components';
import {Link} from 'react-router-dom';
import Button from '../Button';

const H1 = styled.h1`
  position: absolute;
  top: 80px;
  font-family: 'Goblin One';
  font-size: 1.875rem;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.8s ease-out 0.2s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const TitleContainer = styled.section`
  height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 1) 100%),
    url(${props => props.src});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const TitleH2 = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  font-family: 'Nanum Brush Script';
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease-out forwards;

  &:first-of-type {
    animation-delay: 0.4s;
  }

  &:nth-of-type(2) {
    animation-delay: 0.6s;
  }

  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Img = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  order: 2;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const Figcaption = styled.figcaption`
  font-size: 0.625rem;
`;

const ButtonWapper = styled.div`
  position: absolute;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s ease-out 0.8s forwards;

  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

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
