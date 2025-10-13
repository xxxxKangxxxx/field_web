import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../../api/axios';
import theme from '../../theme';

const Container = styled.div`
  padding: 2rem;
  color: ${theme.colors.white};
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${theme.colors.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${theme.colors.gray};
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.white};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${theme.colors.gray};
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.white};
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${theme.colors.primary};
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: ${theme.colors.gray};
    cursor: not-allowed;
  }
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScheduleItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.gray};
  }

  th {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${props => props.active ? theme.colors.primary : theme.colors.gray};
  color: ${props => props.active ? 'black' : theme.colors.white};
`;

export default function RecruitManager() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    season: '상반기',
    isActive: false,
    schedules: [{ title: '', date: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('/api/recruit/all');
      setSchedules(response.data);
    } catch (error) {
      setError('일정을 불러오는데 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    setFormData(prev => {
      const newSchedules = [...prev.schedules];
      newSchedules[index] = {
        ...newSchedules[index],
        [field]: value
      };
      return { ...prev, schedules: newSchedules };
    });
  };

  const addScheduleField = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { title: '', date: '' }]
    }));
  };

  const removeScheduleField = (index) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/recruit', formData);
      await fetchSchedules();
      setFormData({
        year: new Date().getFullYear(),
        season: '상반기',
        isActive: false,
        schedules: [{ title: '', date: '' }]
      });
    } catch (error) {
      setError('일정 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 일정을 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`/api/recruit/${id}`);
      await fetchSchedules();
    } catch (error) {
      setError('일정 삭제에 실패했습니다.');
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await axios.patch(`/api/recruit/${id}`, {
        isActive: !currentActive
      });
      await fetchSchedules();
    } catch (error) {
      setError('상태 변경에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Title>모집 일정 관리</Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>연도</Label>
          <Input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min={2000}
            max={2100}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>시즌</Label>
          <Select
            name="season"
            value={formData.season}
            onChange={handleInputChange}
            required
          >
            <option value="상반기">상반기</option>
            <option value="하반기">하반기</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            <Input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            활성화
          </Label>
        </FormGroup>

        <ScheduleList>
          {formData.schedules.map((schedule, index) => (
            <ScheduleItem key={index}>
              <Input
                placeholder="일정 제목"
                value={schedule.title}
                onChange={(e) => handleScheduleChange(index, 'title', e.target.value)}
                required
              />
              <Input
                placeholder="날짜 (예: 2024.01.01)"
                value={schedule.date}
                onChange={(e) => handleScheduleChange(index, 'date', e.target.value)}
                required
              />
              <Button type="button" onClick={() => removeScheduleField(index)}>
                삭제
              </Button>
            </ScheduleItem>
          ))}
        </ScheduleList>

        <Button type="button" onClick={addScheduleField}>
          일정 추가
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? '등록 중...' : '일정 등록'}
        </Button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Form>

      <ScheduleTable>
        <thead>
          <tr>
            <th>연도</th>
            <th>시즌</th>
            <th>상태</th>
            <th>일정 수</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule._id}>
              <td>{schedule.year}</td>
              <td>{schedule.season}</td>
              <td>
                <Badge active={schedule.isActive}>
                  {schedule.isActive ? '활성' : '비활성'}
                </Badge>
              </td>
              <td>{schedule.schedules.length}개</td>
              <td>
                <Button
                  onClick={() => handleToggleActive(schedule._id, schedule.isActive)}
                >
                  {schedule.isActive ? '비활성화' : '활성화'}
                </Button>
                <Button onClick={() => handleDelete(schedule._id)}>
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </ScheduleTable>
    </Container>
  );
} 