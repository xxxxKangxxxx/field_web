// src/pages/RegisterPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../theme';
import Modal from '../components/Modal';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #141414;

  ${theme.media.mobile} {
    padding: 1.5rem;
  }
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);

  ${theme.media.mobile} {
    padding: 2rem 1.5rem;
    max-width: 95%;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #fff;

  ${theme.media.mobile} {
    font-size: 24px;
  }
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: #fff;
  font-weight: 500;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px ${props => props.$hasButton ? '100px' : '16px'} 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SendButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 16px;
  background: #FFD700;
  color: #141414;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #ffed4e;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

const VerifiedBadge = styled.span`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  background: #4CAF50;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ModalContent = styled.div`
  padding: 2rem;
  min-width: 300px;
  max-width: 400px;
  color: #fff;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #fff;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 18px;
  text-align: center;
  letter-spacing: 8px;
  font-weight: 600;
  margin-bottom: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0;
  }
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #FFD700;
  color: #141414;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ffed4e;
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
`;

const ModalMessage = styled.p`
  font-size: 12px;
  color: ${props => props.$error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.7)'};
  text-align: center;
  margin-top: 0.5rem;
  min-height: 20px;
`;

const ResendButton = styled.button`
  width: 100%;
  padding: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CountdownText = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 0.5rem;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: '';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-size: contain;
    pointer-events: none;
    z-index: 1;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: #141414;
    color: #fff;
    padding: 8px;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #141414;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  margin-top: 1rem;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-top: 1.5rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    department: '',  // 소속
    position: ''     // 직책
  });
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [modalError, setModalError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  const departments = [
    '총기획단',
    '기획부',
    '컴페티션부',
    '홍보부',
    '대외협력부'
  ];

  const positions = [
    '단장',
    '부단장',
    '기획부장',
    '컴페티션부장',
    '홍보부장',
    '대외협력부장',
    '부원'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 이메일이 변경되면 인증 상태 초기화
    if (name === 'email') {
      setIsEmailVerified(false);
    }
  };

  const handleSendVerification = async () => {
    if (!formData.email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setIsSending(true);
    setModalError('');
    
    try {
      await api.post('/api/auth/send-verification', { email: formData.email });
      setIsModalOpen(true);
      setCountdown(300); // 5분 = 300초
      // 기존 타이머 정리
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      // 새 타이머 시작
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || '인증번호 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) {
      return; // 재발송 쿨타임 중
    }
    await handleSendVerification();
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setModalError('인증번호는 6자리입니다.');
      return;
    }

    setIsVerifying(true);
    setModalError('');
    
    try {
      await api.post('/api/auth/verify-email', {
        email: formData.email,
        code: verificationCode
      });
      setIsEmailVerified(true);
      setIsModalOpen(false);
      setVerificationCode('');
      setError('');
      setCountdown(0);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || '인증번호가 일치하지 않습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailVerified) {
      return setError('이메일 인증을 완료해주세요.');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('비밀번호가 일치하지 않습니다.');
    }

    if (!formData.department || !formData.position) {
      return setError('소속과 직책을 선택해주세요.');
    }

    try {
      const response = await api.post('/api/auth/register', 
        {
          email: formData.email,
          name: formData.name,
          password: formData.password,
          department: formData.department,
          position: formData.position
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.message) {
      navigate('/login');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        '회원가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <InputWrapper>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@field.com"
                required
                disabled={isEmailVerified}
                $hasButton={!isEmailVerified}
              />
              {!isEmailVerified ? (
                <SendButton
                  type="button"
                  onClick={handleSendVerification}
                  disabled={!formData.email || isSending}
                >
                  {isSending ? '발송 중...' : '인증번호 발송'}
                </SendButton>
              ) : (
                <VerifiedBadge>
                  ✓ 인증완료
                </VerifiedBadge>
              )}
            </InputWrapper>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              autoComplete="name"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="department">소속</Label>
            <SelectWrapper>
              <Select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">소속을 선택하세요</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            </SelectWrapper>
          </InputGroup>
          <InputGroup>
            <Label htmlFor="position">직책</Label>
            <SelectWrapper>
              <Select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              >
                <option value="">직책을 선택하세요</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </Select>
            </SelectWrapper>
          </InputGroup>
          <RegisterButton type="submit">가입하기</RegisterButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <LoginLink to="/login">
          이미 계정이 있으신가요? 로그인
        </LoginLink>
      </RegisterBox>

      {/* 인증번호 입력 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setVerificationCode('');
        setModalError('');
        setCountdown(0);
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      }}>
        <ModalContent>
          <ModalTitle>이메일 인증</ModalTitle>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', textAlign: 'center', marginBottom: '1.5rem' }}>
            {formData.email}로 발송된<br />인증번호를 입력해주세요.
          </p>
          <ModalInput
            type="text"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              setModalError('');
            }}
            placeholder="000000"
            maxLength={6}
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && verificationCode.length === 6) {
                handleVerifyCode();
              }
            }}
          />
          <ModalButton
            onClick={handleVerifyCode}
            disabled={verificationCode.length !== 6 || isVerifying}
          >
            {isVerifying ? '확인 중...' : '인증하기'}
          </ModalButton>
          {countdown > 0 && (
            <CountdownText>
              남은 시간: {Math.floor(countdown / 60)}분 {countdown % 60}초
            </CountdownText>
          )}
          <ResendButton
            onClick={handleResendVerification}
            disabled={countdown > 0 || isSending}
          >
            {countdown > 0 
              ? `${Math.floor(countdown / 60)}분 ${countdown % 60}초 후 재발송 가능`
              : '인증번호 재발송'
            }
          </ResendButton>
          <ModalMessage $error={!!modalError}>
            {modalError || '인증번호는 5분간 유효합니다.'}
          </ModalMessage>
        </ModalContent>
      </Modal>
    </RegisterContainer>
  );
};

export default SignupPage;
