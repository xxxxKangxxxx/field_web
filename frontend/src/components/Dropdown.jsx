import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import theme from '../theme';
import { setCampTitle } from '../redux/campTitleSlice';

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  ${theme.media.mobile} {
    max-width: 100%;
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 44px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  ${theme.media.mobile} {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: black;
  border: 1px solid white;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const DropdownItem = styled.li`
  padding: 10px;
  color: white;
  cursor: pointer;
  min-height: 44px;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  ${theme.media.mobile} {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const Arrow = styled.span`
  margin-left: 10px;
`;

function Dropdown({ title, titleArr }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(titleArr[0]);
  const dispatch = useDispatch();

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSelect = useCallback((title) => {
    setSelectedTitle(title);
    dispatch(setCampTitle(title));
    setIsOpen(false);
  }, [dispatch]);

  const memoizedTitleArr = useMemo(() => titleArr, [titleArr]);

  return (
    <DropdownContainer>
      <DropdownButton onClick={toggleDropdown}>
        {selectedTitle} {title}
        <Arrow>{isOpen ? '▲' : '▼'}</Arrow>
      </DropdownButton>
      {isOpen && (
        <DropdownList>
          {memoizedTitleArr.map((item) => (
            <DropdownItem
              key={`dropdown-item-${item}`}
              onClick={() => handleSelect(item)}
            >
              {item} {title}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
}

export default React.memo(Dropdown);
