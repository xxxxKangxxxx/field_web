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
  text-align: center; // 텍스트를 가운데 정렬합니다.
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
