import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { setCredentials } from '../redux/authSlice';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.white};
`;

const ProfileSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  padding-bottom: 3rem;
  margin-bottom: 2rem;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1rem;
    right: 1rem;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    
    &:after {
      display: none;
    }
  }
`;

const Label = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.gray300};
  white-space: nowrap;
  flex-shrink: 0;
`;

const Value = styled.span`
  font-size: 0.95rem;
  color: ${props => props.theme.colors.white};
`;

const Divider = styled.span`
  color: ${props => props.theme.colors.gray300};
  margin: 0 0.5rem;
  flex-shrink: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;
  flex: 1;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  padding-right: 2rem;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  option {
    background: #1a1a1a;
    color: ${props => props.theme.colors.white};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditButton = styled(Button)`
  background-color: #FFD700;
  color: #000;
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #666;
  color: white;
`;

const VerificationButton = styled(Button)`
  background-color: #2196F3;
  color: white;
  font-size: 0.7rem;
  padding: 0.3rem 0.8rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;

  &.success {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }

  &.error {
    background-color: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }
`;

const VerificationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const VerificationRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const VerificationInput = styled(Input)`
  flex: 1;
  max-width: 200px;
`;

const VerificationMessage = styled.div`
  font-size: 0.75rem;
  color: #4CAF50;
  margin-top: 0.3rem;
`;

const MyPage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuperAdmin = user?.isSuperAdmin === true;
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    position: user?.position || '',
    password: '',
    confirmPassword: ''
  });
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(
        '/api/auth/send-password-verification',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setIsCodeSent(true);
      setMessage({ type: 'success', text: '인증번호가 발송되었습니다. 이메일을 확인해주세요.' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '인증번호 발송에 실패했습니다.' 
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage({ type: 'error', text: '인증번호 6자리를 입력해주세요.' });
      return;
    }

    setIsVerifyingCode(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post(
        '/api/auth/verify-email',
        {
          email: user.email,
          code: verificationCode
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setIsPasswordVerified(true);
      setMessage({ type: 'success', text: '이메일 인증이 완료되었습니다. 비밀번호를 변경할 수 있습니다.' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '인증번호가 일치하지 않습니다.' 
      });
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // 비밀번호 변경 시 인증 완료 여부 확인
    if (formData.password && !isPasswordVerified) {
      setMessage({ type: 'error', text: '비밀번호 변경을 위해 이메일 인증을 완료해주세요.' });
      return;
    }

    // 비밀번호 확인
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    setIsLoading(true);
    try {
      // 일반 사용자는 이름과 비밀번호만 수정 가능
      // SuperAdmin은 모든 정보 수정 가능
      const updateData = {
        name: formData.name,
      };

      // SuperAdmin인 경우에만 department와 position 수정 가능
      if (user?.isSuperAdmin) {
        updateData.department = formData.department;
        updateData.position = formData.position;
      }

      if (formData.password) {
        updateData.password = formData.password;
        updateData.confirmPassword = formData.confirmPassword;
      }

      const response = await api.put(
        '/api/users/profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      dispatch(setCredentials({
        user: response.data.user,
        token: localStorage.getItem('token')
      }));

      setMessage({ type: 'success', text: '정보가 성공적으로 수정되었습니다.' });
      setIsEditMode(false);
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      setIsPasswordVerified(false);
      setVerificationCode('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || '정보 수정에 실패했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({
      name: user?.name || '',
      department: user?.department || '',
      position: user?.position || '',
      password: '',
      confirmPassword: ''
    });
      setIsPasswordVerified(false);
      setVerificationCode('');
      setIsCodeSent(false);
      setMessage({ type: '', text: '' });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container>
      <Title>내 정보</Title>
      
      {message.text && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}

      <ProfileSection>
        <ProfileItem>
          <Label>이메일</Label>
          <Divider>|</Divider>
          <Value>{user.email}</Value>
        </ProfileItem>
        
        <ProfileItem>
          <Label>이름</Label>
          <Divider>|</Divider>
          {isEditMode ? (
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          ) : (
            <Value>{user.name}</Value>
          )}
        </ProfileItem>
        
        <ProfileItem>
          <Label>소속</Label>
          <Divider>|</Divider>
          {isEditMode && user?.isSuperAdmin ? (
            <Select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">소속을 선택하세요</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
          ) : (
            <Value>{user.department}</Value>
          )}
        </ProfileItem>
        
        <ProfileItem>
          <Label>직책</Label>
          <Divider>|</Divider>
          {isEditMode && user?.isSuperAdmin ? (
            <Select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">직책을 선택하세요</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </Select>
          ) : (
            <Value>{user.position}</Value>
          )}
        </ProfileItem>

        {isEditMode && (
          <>
            <ProfileItem>
              <Label>비밀번호 변경</Label>
              <Divider>|</Divider>
              <VerificationSection>
                {!isPasswordVerified ? (
                  <>
                    <VerificationRow>
                      <VerificationButton 
                        onClick={handleSendVerificationCode} 
                        disabled={isSendingCode}
                      >
                        {isSendingCode ? '발송 중...' : '인증번호 발송'}
                      </VerificationButton>
                    </VerificationRow>
                    {isCodeSent && (
                      <VerificationRow>
                        <VerificationInput
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="인증번호 6자리"
                          maxLength={6}
                        />
                        <VerificationButton 
                          onClick={handleVerifyCode} 
                          disabled={isVerifyingCode || !verificationCode}
                        >
                          {isVerifyingCode ? '확인 중...' : '인증 확인'}
                        </VerificationButton>
                      </VerificationRow>
                    )}
                  </>
                ) : (
                  <VerificationMessage>
                    ✓ 이메일 인증이 완료되었습니다.
                  </VerificationMessage>
                )}
              </VerificationSection>
            </ProfileItem>
            
            <ProfileItem>
              <Label>새 비밀번호</Label>
              <Divider>|</Divider>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
                disabled={!isPasswordVerified}
              />
            </ProfileItem>
            
            <ProfileItem>
              <Label>비밀번호 확인</Label>
              <Divider>|</Divider>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={!isPasswordVerified}
              />
            </ProfileItem>
          </>
        )}
        
        {!isEditMode && user.createdAt && (
          <ProfileItem>
            <Label>가입일</Label>
            <Divider>|</Divider>
            <Value>{new Date(user.createdAt).toLocaleDateString()}</Value>
          </ProfileItem>
        )}
      </ProfileSection>

      <ButtonGroup>
        {!isEditMode ? (
          <EditButton onClick={() => setIsEditMode(true)}>
            정보 수정
          </EditButton>
        ) : (
          <>
            <CancelButton onClick={handleCancel}>
              취소
            </CancelButton>
            <SaveButton onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </SaveButton>
          </>
        )}
      </ButtonGroup>
    </Container>
  );
};

export default MyPage; 