import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  z-index: 1;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const LabelText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.white};
  font-size: 0.85rem;
  font-weight: 500;
  width: 100%;
  justify-content: flex-start;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: ${props => props.theme.colors.white};
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:-webkit-autofill {
    -webkit-text-fill-color: ${props => props.theme.colors.white};
    -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const Icon = styled.img`
  width: 1.2rem;
  height: 1.2rem;
  opacity: 0.8;
`;

const ValidationIcon = styled.span`
  font-size: 0.8rem;
  color: ${props => props.$valid ? props.theme.colors.success || '#4CAF50' : props.theme.colors.error || '#f44336'};
  margin-left: auto;
`;

function InputBox({valid, imgSrc, imgAlt, name, children}) {
  return (
    <InputContainer>
      <InputLabel>
        <LabelText>
          <Icon src={imgSrc} alt={imgAlt} />
          {name}
          <ValidationIcon $valid={valid}>
            {valid ? '✓' : '*'}
          </ValidationIcon>
        </LabelText>
        {children}
      </InputLabel>
    </InputContainer>
  );
}

export default function ContactInput({
  imgSrc,
  imgAlt,
  title,
  inputType,
  inputName,
  validFn,
  autoComplete,
  changeFn,
  maxLength,
  placeholder,
  defaultValue,
}) {
  const Label = inputType === 'textarea' ? TextArea : Input;
  const timeoutIdRef = useRef(null);
  const [enteredData, setEnteredData] = useState(defaultValue || '');
  const [isValid, setIsValid] = useState(false);

  function changeHandler(event) {
    if (inputType === 'tel') {
      const data = event.target.value.replace(/\D/g, '');
      event.target.value = data;
    }
    const {value} = event.target;

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setEnteredData(value);
    }, 300);
  }

  useEffect(() => {
    const validResult = validFn(enteredData);
    setIsValid(validResult);

    const data = {
      value: enteredData,
      valid: validResult,
    };
    changeFn(data, inputName);
  }, [enteredData, validFn, changeFn, inputName]);

  // defaultValue가 변경되면 enteredData 업데이트
  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== enteredData) {
      setEnteredData(defaultValue);
    }
  }, [defaultValue]);

  return (
    <InputBox valid={isValid} imgSrc={imgSrc} imgAlt={imgAlt} name={title}>
      <Label
        type={inputType !== 'textarea' ? inputType : undefined}
        name={inputName}
        onChange={changeHandler}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </InputBox>
  );
}
