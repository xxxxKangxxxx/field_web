import React from 'react';
import styled, {keyframes} from 'styled-components';

const H3 = styled.h3`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  margin: ${props => props.$margin || '0'};
  font-weight: 900;
  @media screen and (min-width: 1024px) {
    font-size: 1.8rem;
    grid-row: 1 / 2;
    grid-column: 2 / 4;
    justify-self: start;
    align-self: center;
    margin: 0;
  }
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: ${props => props.$position || ''};
  bottom: 1rem;
  margin: ${props => props.$margin || '0'};
  @media screen and (min-width: 1024px) {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gird-template-rows: 1fr 2fr;
    place-items: center;
  }
`;

const Image = styled.img`
  margin: ${props => props.$margin || '0'};
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${props => props.radius || ''};
  @media screen and (min-width: 1023px) {
    order: -5;
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    width: 70%;
  }
`;

const P = styled.p`
  word-break: keep-all;
  margin: ${props => props.$margin || '0'};
  line-height: 1.5;
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: ${props => (props.size ? props.size : '1rem')};
  text-align: center;
  @media screen and (min-width: 1024px) {
    text-align: left;
    font-size: 1.2rem;
  }
`;

const Figcaption = styled.figcaption`
  margin: ${props => props.$margin || '0'};
  word-break: keep-all;
  line-height: 1.5;
  @media screen and (min-width: 1024px) {
    grid-row: 2 / 3;
    grid-column: 2 / 4;
    margin: 0;
  }
`;

const shadowAnimation = keyframes`
  0% { box-shadow: 0px 0px 15px 5px #2b3382; } 
  30% { box-shadow: 0px 0px 15px 5px #5761c7; } 
  60% { box-shadow: 0px 0px 15px 5px #1a86d5 } 
  100% { box-shadow: 0px 0px 15px 5px #2b3382; }
`;

const Card = styled.div`
  box-sizing: border-box;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  margin: 8rem 0;
  box-shadow: 0px 0px 15px 5px #2b3382;
  animation: ${shadowAnimation} 3s infinite;
  @media screen and (min-width: 1024px) {
    margin: 8rem 0;
  }
`;

function FieldIntro({title, backgroundImage, content}) {
  return (
    <Card>
      <Figure>
        <H3 $margin='0 0 2rem 0'>{title}</H3>
        <Image src={backgroundImage} alt='산업공학도' radius='1.875rem' />
        <Figcaption $margin='2rem 0 0 0'>
          <P size='1.125rem'>{content}</P>
        </Figcaption>
      </Figure>
    </Card>
  );
}

export default FieldIntro;
