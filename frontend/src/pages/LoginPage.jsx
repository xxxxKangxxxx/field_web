import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import theme from '../theme';
import api from '../api/axios';
import { setCredentials } from '../redux/authSlice';

const LoginContainer = styled.div`
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

const LoginBox = styled.div`
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
  margin-bottom: 2rem;
  text-align: center;

  ${theme.media.mobile} {
    font-size: 24px;
    margin-bottom: 1.5rem;
  }
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

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
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

const LoginButton = styled.button`
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
  min-height: 44px;

  ${theme.media.mobile} {
    padding: 14px;
    font-size: 15px;
  }

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

const LinksWrapper = styled.div`
  text-align: center;
  margin-top: 1.5rem;
`;

const RegisterLink = styled(Link)`
  display: inline-block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

const ForgotPasswordLink = styled.button`
  display: inline-block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-left: 1rem;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;

  &::before {
    content: '|';
    margin-right: 1rem;
    color: rgba(255, 255, 255, 0.3);
  }

  &:hover {
    color: #fff;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  ${theme.media.mobile} {
    padding: 2rem 1.5rem;
    max-width: 95%;
  }
`;

const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2rem;
  text-align: center;

  ${theme.media.mobile} {
    font-size: 20px;
    margin-bottom: 1.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 32px;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover {
    color: #fff;
  }
`;

const SuccessMessage = styled.p`
  color: #51cf66;
  font-size: 14px;
  text-align: center;
  margin-top: 1rem;
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: 이메일, 2: 인증번호, 3: 새 비밀번호
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError('서버와의 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');

    try {
      await api.post('/api/auth/forgot-password', {
        email: forgotPasswordData.email
      });
      setForgotPasswordSuccess('인증번호가 이메일로 발송되었습니다.');
      setForgotPasswordStep(2);
    } catch (err) {
      setForgotPasswordError(err.response?.data?.message || '인증번호 발송에 실패했습니다.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setForgotPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (forgotPasswordStep === 2) {
      // 인증번호 확인 단계
      try {
        await api.post('/api/auth/verify-email', {
          email: forgotPasswordData.email,
          code: forgotPasswordData.code
        });
        setForgotPasswordSuccess('인증이 완료되었습니다.');
        setForgotPasswordStep(3);
      } catch (err) {
        setForgotPasswordError(err.response?.data?.message || '인증번호가 일치하지 않습니다.');
      }
    } else if (forgotPasswordStep === 3) {
      // 비밀번호 재설정 단계
      try {
        await api.post('/api/auth/reset-password', {
          email: forgotPasswordData.email,
          code: forgotPasswordData.code,
          newPassword: forgotPasswordData.newPassword
        });
        setForgotPasswordSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep(1);
          setForgotPasswordData({ email: '', code: '', newPassword: '', confirmPassword: '' });
          setForgotPasswordError('');
          setForgotPasswordSuccess('');
        }, 2000);
      } catch (err) {
        setForgotPasswordError(err.response?.data?.message || '비밀번호 재설정에 실패했습니다.');
      }
    }
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotPasswordData({ email: '', code: '', newPassword: '', confirmPassword: '' });
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@field.com"
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
              required
            />
          </InputGroup>
          <LoginButton type="submit">로그인</LoginButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <LinksWrapper>
          <RegisterLink to="/signup">
            계정이 없으신가요? 회원가입
          </RegisterLink>
          <ForgotPasswordLink onClick={() => setShowForgotPassword(true)}>
            비밀번호를 잊으셨나요?
          </ForgotPasswordLink>
        </LinksWrapper>
      </LoginBox>

      {showForgotPassword && (
        <ModalOverlay onClick={handleCloseForgotPassword}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>비밀번호 찾기</ModalTitle>
            <CloseButton onClick={handleCloseForgotPassword}>&times;</CloseButton>
            
            {forgotPasswordStep === 1 && (
              <Form onSubmit={handleSendVerificationCode}>
                <InputGroup>
                  <Label htmlFor="forgot-email">이메일</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    name="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    placeholder="가입하신 이메일을 입력하세요"
                    required
                  />
                </InputGroup>
                <LoginButton type="submit">인증번호 발송</LoginButton>
                {forgotPasswordError && <ErrorMessage>{forgotPasswordError}</ErrorMessage>}
                {forgotPasswordSuccess && <SuccessMessage>{forgotPasswordSuccess}</SuccessMessage>}
              </Form>
            )}

            {forgotPasswordStep === 2 && (
              <Form onSubmit={handleResetPassword}>
                <InputGroup>
                  <Label htmlFor="verification-code">인증번호</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    name="code"
                    value={forgotPasswordData.code}
                    onChange={handleForgotPasswordChange}
                    placeholder="이메일로 받은 인증번호를 입력하세요"
                    required
                  />
                </InputGroup>
                <LoginButton type="submit">인증 확인</LoginButton>
                {forgotPasswordError && <ErrorMessage>{forgotPasswordError}</ErrorMessage>}
                {forgotPasswordSuccess && <SuccessMessage>{forgotPasswordSuccess}</SuccessMessage>}
              </Form>
            )}

            {forgotPasswordStep === 3 && (
              <Form onSubmit={handleResetPassword}>
                <InputGroup>
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input
                    id="new-password"
                    type="password"
                    name="newPassword"
                    value={forgotPasswordData.newPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="새 비밀번호를 입력하세요"
                    required
                  />
                </InputGroup>
                <InputGroup>
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={forgotPasswordData.confirmPassword}
                    onChange={handleForgotPasswordChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                  />
                </InputGroup>
                <LoginButton type="submit">비밀번호 재설정</LoginButton>
                {forgotPasswordError && <ErrorMessage>{forgotPasswordError}</ErrorMessage>}
                {forgotPasswordSuccess && <SuccessMessage>{forgotPasswordSuccess}</SuccessMessage>}
              </Form>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </LoginContainer>
  );
};

export default LoginPage;
