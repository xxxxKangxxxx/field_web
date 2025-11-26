import {useState} from 'react';
import styled, {keyframes, css} from 'styled-components';
import theme from '../../theme';
import Instagram from '../../../public/InstagramIcon.jpg';
import Youtube from '../../../public/YoutubeIcon.png';
import KakaoTalk from '../../../public/KakaoTalkIcon.png';

const turnRight = keyframes`
  0% {
    transform: rotate(0deg) ;
  }
  100% {
    transform: rotate(-45deg) 
  }
`;

const turnLeft = keyframes`
  0% {
    transform: rotate(-45deg) ;
  }
  100% {
    transform: rotate(0deg) 
  }
`;

const slideUp = initialY => keyframes`
  0% {
    transform: translateY(${initialY}%);
  }

  100% {
    transform: translateY(0%);
  }
`;

const IconWrapper = styled.aside`
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 5%;
  right: 1rem;
  z-index: 2;

  ${theme.media.mobile} {
    right: 0.75rem;
    bottom: 4%;
  }
`;

const commonIconStyle = `
  width: 48px;
  height: 48px;
    border: none;
  background: ${theme.colors.white};
    border-radius: 50%;
      margin: 5px 0;
      display: flex;
  justify-content: center;
  align-items: center;
  min-width: 48px;
  min-height: 48px;

  ${theme.media.mobile} {
    width: 52px;
    height: 52px;
    min-width: 52px;
    min-height: 52px;
  }
`;

const BaseIconButton = styled.button`
  ${commonIconStyle}
  border-radius: 50%;
  margin: 5px 0;
  padding: 0;
  cursor: pointer;
`;

const SNSIcon = styled.a`
  ${commonIconStyle}
  animation: ${props => props.$move} 0.5s ease-in-out;
  overflow: hidden;
`;

const BaseIcon = styled.svg`
  animation: ${({$toggle}) =>
    $toggle
      ? css`
          ${turnRight} 0.3s forwards
        `
      : css`
          ${turnLeft} 0.3s forwards
        `};
  margin: auto;
`;

function SNSIconLink({move, src, alt, href}) {
  return (
    <SNSIcon $move={move} href={href} target='_blank'>
      <img height='48px' src={src} alt={alt} />
    </SNSIcon>
  );
}

export default function SideBar() {
  const [toggle, setToggle] = useState(false);

  function openHandler() {
    setToggle(!toggle);
  }
  return (
    <IconWrapper onClick={() => openHandler()}>
      {toggle && (
        <>
          <SNSIconLink
            move={slideUp(310)}
            src={KakaoTalk}
            alt='KakaoTalk Icon'
            href='http://pf.kakao.com/_uwNxeK'
          />
          <SNSIconLink
            move={slideUp(190)}
            src={Instagram}
            alt='instagram Icon'
            href='https://www.instagram.com/iefield/'
          />
          <SNSIconLink
            move={slideUp(70)}
            src={Youtube}
            alt='Youtube Icon'
            href='https://www.youtube.com/@field2023'
          />
        </>
      )}
      <BaseIconButton aria-label='sideBarButton'>
        <BaseIcon
          $toggle={toggle ? 'true' : undefined}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='24'
          height='24'
          fill='none'
          stroke='black'
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='0' y1='12' x2='24' y2='12' />
          <line x1='12' y1='0' x2='12' y2='24' />
        </BaseIcon>
      </BaseIconButton>
    </IconWrapper>
  );
}
