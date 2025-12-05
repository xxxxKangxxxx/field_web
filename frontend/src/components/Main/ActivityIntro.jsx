import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const P = styled.p`
  word-break: keep-all;
  margin: 12rem 0 0 0;
  line-height: 1.5;
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: 1.25rem;
  font-weight: 900;
  text-align: center;

  ${theme.media.tablet} {
    margin: 6rem 0 0 0;
    font-size: 1.125rem;
  }

  ${theme.media.desktop} {
    margin: 7rem 0 0 0;
    font-size: 18px;
  }
`;

const Card = styled.article`
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${props => props.src});
  background-color: ${theme.colors.blue};
  padding: 2rem 1rem;
  background-position: center;
  background-size: cover;
  object-fill: fill;
  aspect-ratio: 1/1.2;
  border-radius: 0.625rem;
  width: 100%;
  max-width: 100%;
  ${props => props.$border && 'border: 2px solid white;'}

  ${theme.media.mobile} {
    padding: 1.5rem 0.75rem;
  }

  ${theme.media.tablet} {
    width: 550px;
    height: 400px;
    padding: 2rem 1rem;
  }

  ${theme.media.desktop} {
    width: 420px;
    height: 320px;
    padding: 2rem 1rem;
  }
`;

const H3 = styled.h3`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  margin: ${props => props.$margin || '0'};
`;

const CardTitle = styled(H3)`
  display: inline;
  border: 1px solid white;
  border-radius: 0.625rem;
  padding: 0.3rem 1.5rem;
  font-weight: 700;

  ${theme.media.mobile} {
    font-size: 0.9rem;
    padding: 0.25rem 1.25rem;
  }

  ${theme.media.tablet} {
    font-size: 1rem;
  }
`;

function ActivityIntro({backgroundImage, title, content}) {
  return (
    <Card src={backgroundImage}>
      <CardTitle>{title}</CardTitle>
      <P>{content}</P>
    </Card>
  );
}

export default ActivityIntro;
