import React, {useEffect} from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import theme from '../theme';

const ModalContainer = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background-color: white;
    transform-origin: center;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }

  &:hover::before,
  &:hover::after {
    background-color: ${theme.colors.red};
  }
`;

// 리스트 모달용 스타일
const ListContainer = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 5%;
  overflow: auto;
  max-height: 300px;
  width: 100%;
  padding: 2rem;
`;

const ListItem = styled.li`
  font-size: 1rem;
  width: 45%;
  color: ${theme.colors.yellow};
  margin: 1rem 0;
  cursor: pointer;
`;

function Modal({ 
  isOpen, 
  onClose, 
  children,
  // 리스트 모달용 props
  titleData,
  name = '',
  onItemClick
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  // 리스트 모달 렌더링
  if (titleData) {
    return ReactDOM.createPortal(
      <ModalContainer onClick={onClose}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={onClose} aria-label="닫기" />
          <ListContainer>
            {titleData.map(item => (
              <ListItem
                key={item}
                onClick={() => {
                  onClose();
                  onItemClick?.(item);
                }}
              >
                {item} {name}
              </ListItem>
            ))}
          </ListContainer>
        </ModalContent>
      </ModalContainer>,
      document.body
    );
  }

  // 일반 모달 렌더링
  return ReactDOM.createPortal(
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="닫기" />
        {children}
      </ModalContent>
    </ModalContainer>,
    document.body
  );
}

export default Modal;
