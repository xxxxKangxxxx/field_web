import React from 'react';
import styled from 'styled-components';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  border: 2px solid white;
  padding: 0 1rem;
  border-radius: 1rem;
  margin: ${props => props.margin || '0'};
`;

function Card() {
  return <div></div>;
}

export default Card;
