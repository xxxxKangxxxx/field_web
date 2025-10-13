import {createPortal} from 'react-dom';
import styled, {keyframes} from 'styled-components';
import theme from '../../theme';

const slideDownAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }

  80%{
    transform: translateY(10%);
  }

  100% {
    transform: translateY(0%);
  }
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpin = styled.div`
  margin: 1.8rem auto 0;
  width: 2.5rem;
  height: 2.5rem;
  border: 0.2rem solid transparent;
  border-top-color: ${theme.colors.black};
  border-radius: 50%;
  animation: ${spin} 0.5s linear infinite;
`;

const ModalBackground = styled.section`
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  z-index: 1;
`;

const Modal = styled.section`
  position: relative;
  top: 40%;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.white};
  height: 9rem;
  width: 70%;
  max-width: 300px;
  animation: ${slideDownAnimation} 0.5s ease-in-out;
  border-radius: 2rem;
  align-items: center;
  box-shadow: 0.8rem 0.8rem 0.8rem rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    max-width: 20rem;
  }
`;

const ModalButton = styled.button`
  appearance: none;
  width: 8rem;
  height: 2.4rem;
  font-size: 1rem;
  border-radius: 7rem;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  margin: 1.2rem 0 0 0;
  font-weight: 600;
  cursor: pointer;
`;

const ModalP = styled.p`
  margin: ${props => (props.$mg ? props.$mg : '0 0 0 0')};
  color: ${theme.colors.black};
  font-size: 1rem;
  font-weight: 800;
  text-align: center;
`;

const portalElement = document.getElementById('modal');

export default function ContactModal(props) {
  const {isOpen, isValid, onClose, isLoading, error} = props;

  if (!isOpen) return null;

  let content;
  if (isLoading) {
    content = (
      <>
        <LoadingSpin />
        <ModalP $mg='1.5rem 0 0 0'>저장중입니다 잠시만 기다려주세요.</ModalP>
      </>
    );
  } else if (error) {
    content = (
      <>
        <ModalP $mg='1.5rem 0 0 0'>실행에 실패하였습니다.</ModalP>
        <ModalP $mg='0.7rem 0 0 0'>잠시 후 다시 시도해주세요.</ModalP>
        <ModalButton type='button' onClick={onClose}>
          확인하기
        </ModalButton>
      </>
    );
  } else if (isValid) {
    content = (
      <>
        <ModalP $mg='1.5rem 0 0 0'>소중한 의견 감사합니다.</ModalP>
        <ModalP $mg='0.7rem 0 0 0'>추후에 메일로 연락드리겠습니다.</ModalP>
        <ModalButton type='button' onClick={onClose}>
          확인하기
        </ModalButton>
      </>
    );
  } else {
    content = (
      <>
        <div>
          <ModalP $mg='1.5rem 0 0 0'>올바르지 않는 형식입니다.</ModalP>
          <ModalP $mg='0.7rem 0 0 0'>별표된 항목을 확인해주세요.</ModalP>
        </div>
        <ModalButton type='button' onClick={onClose}>
          확인하기
        </ModalButton>
      </>
    );
  }

  return createPortal(
    <ModalBackground>
      <Modal>{content}</Modal>
    </ModalBackground>,
    portalElement
  );
}
