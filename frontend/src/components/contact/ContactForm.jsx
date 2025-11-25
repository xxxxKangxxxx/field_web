import styled from 'styled-components';
import {useState, useRef} from 'react';
import theme from '../../theme';
import ContactModal from './ContactModal';
import ContactInput from './ContactInput';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modal';

const ContactSection = styled.section`
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.125);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  & > div:not(:first-child) {
    width: 96%;
    margin: 0 auto;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/fieldLogo.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50% auto;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-family: 'ChosunKm';
  color: ${props => props.theme.colors.white};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TypeSelect = styled.select`
  color: ${props => props.theme.colors.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.4rem 2rem 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  appearance: none;
  min-width: 100px;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 0.6rem auto;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Option = styled.option`
  background: #1a1a1a;
  color: ${props => props.theme.colors.white};
  padding: 0.5rem;
`;

const SubmitButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  margin: 1rem auto 0;
  width: 130px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ButtonImg = styled.img`
  width: 0.8rem;
  height: 0.8rem;
`;

const LoginRequiredModal = styled.div`
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  color: white;
`;

const ModalMessage = styled.p`
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const LoginButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: black;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default function ContactForm() {
  // useRef를 개별적으로 선언
  const typeRef = useRef({value: '', valid: false});
  const nameRef = useRef({value: '', valid: false});
  const emailRef = useRef({value: '', valid: false});
  const phoneRef = useRef({value: '', valid: false});
  const contentRef = useRef({value: '', valid: false});
  const titleRef = useRef({value: '', valid: false});
  
  // 객체로 묶기
  const enteredData = {
    type: typeRef,
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
    content: contentRef,
    title: titleRef,
  };
  
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const emailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneValid = /^[0-9]{9,11}$/;

  async function SendMessage() {
    const data = {};

    Object.keys(enteredData).forEach(key => {
      data[key] = enteredData[key].current.value;
    });

    setIsLoading(true);
    setShowModal(true);

    try {
      await api.post('/api/inquiries', data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const isEmpty = value => value.trim() !== '';
  const phoneNumberisValid = value => phoneValid.test(value);
  const emailisValid = value => emailValid.test(value);

  const validateForm = () => {
    let isEveryValid = true;
    Object.keys(enteredData).forEach(key => {
      const isOneValid = enteredData[key].current.valid;
      isEveryValid = isEveryValid && isOneValid;
    });
    return isEveryValid;
  };

  const enteredDataHandler = async (event) => {
    event.preventDefault();
    
    setHasInteracted(true);
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const formIsValid = validateForm();
    setIsValid(formIsValid);
    
    if (formIsValid) {
      await SendMessage();
    } else {
      setShowModal(true);
    }
  };

  function up(data, name) {
    enteredData[name].current = data;
    if (hasInteracted) {
      setIsValid(validateForm());
    }
  }

  function modalCloseHandler() {
    setShowModal(false);
    setError(null);
    
    if (isValid && !error) {
      // 폼 초기화
      Object.keys(enteredData).forEach(key => {
        enteredData[key].current = { value: '', valid: false };
      });
      
      // 입력 필드 초기화
      const form = document.querySelector('form');
      if (form) form.reset();
      
      setHasInteracted(false);
    }
  }

  function handleTypeChange(e) {
    enteredData.type.current = {
      value: e.target.value,
      valid: true,
    };
  }

  return (
    <>
      <ContactSection>
        <Form onSubmit={enteredDataHandler}>
          <FormHeader>
            <FormTitle>Contact Us</FormTitle>
            <TypeSelect onChange={handleTypeChange} defaultValue="">
              <Option value="" disabled>문의 유형</Option>
              <Option value="general">일반 문의</Option>
              <Option value="business">사업 제휴</Option>
              <Option value="support">기술 지원</Option>
              <Option value="other">기타</Option>
            </TypeSelect>
          </FormHeader>

          <ContactInput
            imgSrc='smile.png'
            imgAlt='웃는 아이콘'
            title='이름 (회사)'
            inputType='text'
            inputName='name'
            validFn={isEmpty}
            autoComplete='name'
            changeFn={(data, name) => up(data, name)}
          />

          <ContactInput
            imgSrc='phone1.png'
            imgAlt='핸드폰 아이콘'
            title='연락처'
            inputType='tel'
            inputName='phone'
            validFn={phoneNumberisValid}
            autoComplete='tel'
            changeFn={(data, name) => up(data, name)}
            maxLength='11'
            placeholder='01012345678'
          />

          <ContactInput
            imgSrc='email.png'
            imgAlt='메세지 아이콘'
            title='Email'
            inputType='email'
            inputName='email'
            validFn={emailisValid}
            autoComplete='email'
            changeFn={(data, name) => up(data, name)}
          />

          <ContactInput
            imgSrc='pencil.png'
            imgAlt='연필 아이콘'
            title='제목'
            inputType='text'
            inputName='title'
            validFn={isEmpty}
            changeFn={(data, name) => up(data, name)}
          />

          <ContactInput
            imgSrc='check1.png'
            imgAlt='체크 아이콘'
            title='내용'
            inputType='textarea'
            inputName='content'
            validFn={isEmpty}
            changeFn={(data, name) => up(data, name)}
          />

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? '전송 중...' : '문의하기'}
            <ButtonImg src="send.png" alt="전송 아이콘" />
          </SubmitButton>
        </Form>
      </ContactSection>
      <ContactModal
        isOpen={showModal}
        onClose={modalCloseHandler}
        isValid={isValid}
        error={error}
        isLoading={isLoading}
      />
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      >
        <LoginRequiredModal>
          <ModalMessage>로그인이 필요합니다.</ModalMessage>
          <LoginButton onClick={() => navigate('/login')}>
            로그인하기
          </LoginButton>
        </LoginRequiredModal>
      </Modal>
    </>
  );
}
