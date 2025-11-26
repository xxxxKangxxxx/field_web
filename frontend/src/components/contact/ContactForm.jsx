import styled from 'styled-components';
import {useState, useRef, useEffect} from 'react';
import theme from '../../theme';
import ContactModal from './ContactModal';
import ContactInput from './ContactInput';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modal';

const ContactSection = styled.section`
  padding: 2rem !important;
  width: 100% !important;
  max-width: 800px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  background: rgba(255, 255, 255, 0.125);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box !important;

  ${theme.media.tablet} {
    padding: 1.5rem !important;
    max-width: 100% !important;
  }

  ${theme.media.mobile} {
    padding: 1rem !important;
    max-width: 100% !important;
    border-radius: 8px;
  }
`;

const Form = styled.form`
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  position: relative;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  gap: 1.5rem !important;

  & > div:first-child {
    width: 100% !important;
    max-width: 100% !important;
    align-self: stretch !important;
    box-sizing: border-box !important;
  }

  & > div:not(:first-child) {
    width: 100% !important;
    max-width: 90% !important;
    margin: 0 !important;
    margin-left: 1.2rem !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    align-self: flex-start !important;
  }

  ${theme.media.tablet} {
    & > div:not(:first-child) {
      max-width: calc(100% - 2rem) !important;
      margin: 0 !important;
      margin-left: 0 !important;
      align-self: flex-start !important;
    }
  }

  ${theme.media.mobile} {
    & > div:not(:first-child) {
      max-width: calc(100% - 3rem) !important;
      margin: 0 !important;
      margin-left: .8rem !important;
      align-self: flex-start !important;
    }
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

  ${theme.media.tablet} {
    padding: 0 !important;
    margin: 0 !important;
    gap: 1.25rem !important;
  }

  ${theme.media.mobile} {
    padding: 0 !important;
    margin: 0 !important;
    gap: 1rem !important;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
  width: 100%;
  box-sizing: border-box;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-family: 'ChosunKm';
  color: ${props => props.theme.colors.white};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;

  ${theme.media.tablet} {
    font-size: 1.5rem;
  }

  ${theme.media.mobile} {
    font-size: 1.25rem;
    letter-spacing: 0.5px;
  }
`;

const DropdownContainer = styled.div`
  display: block;
  position: relative;
  width: auto;
  min-width: 100px;
  max-width: 150px;

  ${theme.media.tablet} {
    min-width: 90px;
    max-width: 130px;
  }

  ${theme.media.mobile} {
    min-width: 60px;
    max-width: 100px;
  }
`;

const DropdownButton = styled.button`
  width: 100%;
  color: ${props => props.theme.colors.white};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.4rem 0.8rem 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  min-height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
  }

  ${theme.media.mobile} {
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: ${props => props.$isOpen ? 'block' : 'none'};

  ${theme.media.tablet} {
    max-height: 200px;
    overflow-y: auto;
  }

  ${theme.media.mobile} {
    max-height: 200px;
    overflow-y: auto;
  }
`;

const DropdownItem = styled.li`
  padding: 0.75rem;
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:first-child {
    border-radius: 6px 6px 0 0;
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }

  &[data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: transparent;
    }
  }

  ${theme.media.mobile} {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
`;

const DropdownArrow = styled.span.attrs(props => ({
  style: {
    transform: props.$isOpen ? 'rotate(120deg)' : 'rotate(0deg)',
  }
}))`
  margin-left: 0.3rem;
  font-size: 0.6rem;
  transition: transform 0.2s ease;
  flex-shrink: 0;
  display: inline-block;
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
  min-height: 44px;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }

  ${theme.media.mobile} {
    width: 100%;
    max-width: 200px;
    padding: 0.5rem 1.25rem;
    font-size: 0.8rem;
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
  
  // 드롭다운 상태 (모든 화면 크기에서 사용)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('문의 유형');
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const emailValid = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneValid = /^[0-9]{9,11}$/;

  // 로그인한 사용자의 이메일을 자동으로 채우기 (수정 가능)
  // defaultValue prop을 통해 ContactInput에 전달되므로 별도 처리 불필요

  async function SendMessage() {
    const data = {};

    Object.keys(enteredData).forEach(key => {
      data[key] = enteredData[key].current.value;
    });

    // 사용자가 입력한 이메일을 사용 (기본값은 로그인한 사용자의 이메일)
    // 만약 이메일이 비어있으면 로그인한 사용자의 이메일 사용
    if (!data.email && user?.email) {
      data.email = user.email;
    }

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

  function handleTypeSelect(value, label) {
    if (value === '') return; // disabled 옵션은 선택 불가
    
    enteredData.type.current = {
      value: value,
      valid: true,
    };
    setSelectedType(label);
    setIsDropdownOpen(false);
  }

  function toggleDropdown() {
    setIsDropdownOpen(prev => !prev);
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <ContactSection>
        <Form onSubmit={enteredDataHandler}>
          <FormHeader>
            <FormTitle>Contact Us</FormTitle>
            <DropdownContainer ref={dropdownRef}>
              <DropdownButton onClick={toggleDropdown} type="button">
                {selectedType}
                <DropdownArrow $isOpen={isDropdownOpen}>▼</DropdownArrow>
              </DropdownButton>
              <DropdownList $isOpen={isDropdownOpen}>
                <DropdownItem 
                  data-disabled="true"
                  onClick={() => {}}
                >
                  문의 유형
                </DropdownItem>
                <DropdownItem 
                  onClick={() => handleTypeSelect('general', '일반 문의')}
                >
                  일반 문의
                </DropdownItem>
                <DropdownItem 
                  onClick={() => handleTypeSelect('business', '사업 제휴')}
                >
                  사업 제휴
                </DropdownItem>
                <DropdownItem 
                  onClick={() => handleTypeSelect('support', '기술 지원')}
                >
                  기술 지원
                </DropdownItem>
                <DropdownItem 
                  onClick={() => handleTypeSelect('other', '기타')}
                >
                  기타
                </DropdownItem>
              </DropdownList>
            </DropdownContainer>
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
            defaultValue={user?.email || ''}
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
