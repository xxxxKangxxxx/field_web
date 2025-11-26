import React from 'react';
import styled, {keyframes} from 'styled-components';
import theme from '../theme';

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpin = styled.div`
  margin: 1rem auto 0;
  width: 4rem;
  height: 4rem;
  border: 0.2rem solid transparent;
  border-top-color: ${theme.colors.white};
  border-radius: 50%;
  animation: ${spin} 0.5s linear infinite;

  ${theme.media.mobile} {
    width: 3rem;
    height: 3rem;
    border-width: 0.15rem;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const P = styled.p`
  font-size: 2rem;
  color: white;
  text-align: center;

  ${theme.media.tablet} {
    font-size: 1.75rem;
  }

  ${theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

function LoadingSpinner() {
  return (
    <LoadingWrapper>
      <LoadingSpin />
      <P>로딩중</P>
    </LoadingWrapper>
  );
}

export default LoadingSpinner;
