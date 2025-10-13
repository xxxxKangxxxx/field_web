import React from 'react';
import styled from 'styled-components';
import theme from '../theme';

const Button = styled.button`
  background-color: black;
  color: white;
  cursor: pointer;
  width: 25%;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 700;
  padding: 0.375rem 0;
  ${props =>
    props.$isActive &&
    `
    background-color: ${theme.colors.gray};
    color: white;
  `}
`;

function CategoryButton({label, onClick, isActive}) {
  return (
    <Button onClick={onClick} $isActive={isActive}>
      {label}
    </Button>
  );
}

export default CategoryButton;
