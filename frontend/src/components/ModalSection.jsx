import React, {useState} from 'react';
import styled from 'styled-components';
import modalIcon from '../assets/modalIcon.png';
import Modal from './Modal';
import theme from '../theme';
import {setCampTitle} from '../redux/campTitleSlice';
import {setMonthTitle} from '../redux/monthFieldSlice';

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin: ${props => (props.$margin ? props.$margin : '2rem 0 1rem 0 ')};
  cursor: pointer;

  ${theme.media.mobile} {
    gap: 0.2rem;
    margin: ${props => (props.$margin ? props.$margin : '1.5rem 0 0.75rem 0 ')};
  }
`;

const IconImg = styled.img`
  width: auto;
  height: auto;
  min-width: 44px;
  min-height: 44px;

  ${theme.media.mobile} {
    width: 36px;
    height: 36px;
  }
`;

const H2 = styled.h2`
  font-size: ${props => (props.$size ? props.$size : '1.625rem')};
  color: ${props => (props.$color ? theme.colors[props.$color] : 'white')};
  font-family: ${props => (props.$font ? props.$font : '')};
  font-weight: 900;

  ${theme.media.tablet} {
    font-size: ${props => (props.$size ? `calc(${props.$size} * 0.9)` : '1.5rem')};
  }

  ${theme.media.mobile} {
    font-size: ${props => (props.$size ? `calc(${props.$size} * 0.85)` : '1.375rem')};
  }
`;

const ModalBackground = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  z-index: 1;
`;

function ModalSection({title, color, font, fontSize, timeDatalst, $margin, name = ''}) {
  const [showModal, setShowModal] = useState(false);
  const dispatchAction = title === '역대 FIELD CAMP' ? setCampTitle : setMonthTitle;
  return (
    <IconWrapper $margin={$margin}>
      <IconImg
        src={modalIcon}
        alt='모달창 아이콘'
        onClick={() => {
          setShowModal(true);
        }}
      />
      <H2
        $font={font}
        $color={color}
        $size={fontSize}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {title}
      </H2>
      {showModal && (
        <ModalBackground
          onClick={() => {
            setShowModal(false);
          }}
        >
          <Modal
            titleData={timeDatalst}
            showModal={showModal}
            setShowModal={setShowModal}
            name={name}
            setModalItem={dispatchAction}
          />
        </ModalBackground>
      )}
    </IconWrapper>
  );
}

export default ModalSection;
