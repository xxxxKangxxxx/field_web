// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const RegisterContainer = styled.div`
  min-height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #141414;
`;

const RegisterBox = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #fff;
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

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  transition: all 0.2s ease;
  appearance: none;
  cursor: pointer;
  box-sizing: border-box;

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

  /* 화살표 아이콘 스타일링 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
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
          <InputGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="department">소속</Label>
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
          </InputGroup>
          <InputGroup>
            <Label htmlFor="position">직책</Label>
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
          </InputGroup>
          <RegisterButton type="submit">가입하기</RegisterButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
        <LoginLink to="/login">
          이미 계정이 있으신가요? 로그인
        </LoginLink>
      </RegisterBox>
    </RegisterContainer>
  );
};

export default SignupPage;
