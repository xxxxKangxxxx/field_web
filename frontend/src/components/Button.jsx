import React from 'react';
import styled, {keyframes, css} from 'styled-components';
import theme from '../theme';

const buttonAnimation = keyframes`
  30% { transform: scale(1.1); }
  40%, 60% { transform: rotate(-10deg) scale(1.1); }
  50% { transform: rotate(10deg) scale(1.1); }
  70% { transform: rotate(0deg) scale(1.1); }
  100% { transform: scale(1); }
}
`;

const WhiteButton = styled.button`
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  width: 8rem;
  padding: 0.75rem;
  margin: ${props => props.$mg || ''};
  border: none;
  border-radius: 5rem;
  font-family: SUIT;
  font-weight: 800;
  font-size: 0.9375rem;
  word-break: keep-all;
  box-shadow: 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.3);
  min-height: 44px;
  cursor: pointer;
  ${props =>
    props.$animate &&
    css`
      animation: ${buttonAnimation} 3s infinite;
    `}
  ${theme.media.desktop} {
    font-size: 18px;
    width: 160px;
    height: 70px;
    padding: 0px;
    &:hover {
      background: #8c8c8c;
      transition: all 0.5s ease-out;
    }
  }
  order: ${props => props.$order || ''};
`;

function Button({mg, label, onClick, animate, order = ''}) {
  const isMultiLine = label.includes('\n');
  const splitLabel = label.split('\n');

  return (
    <WhiteButton $mg={mg} $animate={animate} onClick={onClick} $order={order}>
      {isMultiLine
        ? splitLabel.map((line, index) => (
            <React.Fragment key={line}>
              {line}
              {index < splitLabel.length - 1 ? <br /> : ''}
            </React.Fragment>
          ))
        : label}
    </WhiteButton>
  );
}

export default Button;
