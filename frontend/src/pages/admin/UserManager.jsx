import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../api/axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.white};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background: rgba(255, 255, 255, 0.15);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  color: ${props => props.theme.colors.white};
  font-weight: 600;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  margin-right: 0.5rem;

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

const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.white};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.gray300};
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;

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
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;
  cursor: pointer;

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
  margin-top: 2rem;
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #666;
  color: white;
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

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  &.super-admin {
    background-color: rgba(255, 215, 0, 0.2);
    color: #FFD700;
  }

  &.admin {
    background-color: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }
`;

const UserManager = () => {
  const { user } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    position: '',
    password: '',
  });

  const departments = [
    '대외협력부',
    '총기획단',
    '기획부',
    '컴페티션부',
    '홍보부'
  ];

  const positions = [
    '대외협력부장',
    '단장',
    '부단장',
    '기획부장',
    '컴페티션부장',
    '홍보부장',
    '부원'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      department: user.department,
      position: user.position,
      password: '',
    });
    setIsModalOpen(true);
    setMessage({ type: '', text: '' });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage({ type: 'success', text: '사용자가 삭제되었습니다.' });
      fetchUsers();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || '사용자 삭제에 실패했습니다.'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        name: formData.name,
        department: formData.department,
        position: formData.position,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.put(`/api/users/${editingUser.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setMessage({ type: 'success', text: '사용자 정보가 수정되었습니다.' });
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || '사용자 정보 수정에 실패했습니다.'
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      department: '',
      position: '',
      password: '',
    });
    setMessage({ type: '', text: '' });
  };

  if (!user?.isSuperAdmin) {
    return <Container>최상위 관리자 권한이 필요합니다.</Container>;
  }

  return (
    <Container>
      <Title>사용자 관리</Title>

      {message.text && (
        <Message className={message.type}>
          {message.text}
        </Message>
      )}

      {isLoading ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
          로딩 중...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>이메일</TableHeaderCell>
              <TableHeaderCell>이름</TableHeaderCell>
              <TableHeaderCell>소속</TableHeaderCell>
              <TableHeaderCell>직책</TableHeaderCell>
              <TableHeaderCell>권한</TableHeaderCell>
              <TableHeaderCell>가입일</TableHeaderCell>
              <TableHeaderCell>작업</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.department}</TableCell>
                <TableCell>{u.position}</TableCell>
                <TableCell>
                  {u.isSuperAdmin ? (
                    <Badge className="super-admin">최상위 관리자</Badge>
                  ) : u.isAdmin ? (
                    <Badge className="admin">관리자</Badge>
                  ) : (
                    <span>일반 사용자</span>
                  )}
                </TableCell>
                <TableCell>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <EditButton onClick={() => handleEdit(u)}>
                    수정
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(u.id)}>
                    삭제
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}

      {isModalOpen && (
        <Modal onClick={handleCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>사용자 정보 수정</ModalTitle>

            {message.text && (
              <Message className={message.type}>
                {message.text}
              </Message>
            )}

            <FormGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                value={editingUser?.email || ''}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label>이름</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />
            </FormGroup>

            <FormGroup>
              <Label>소속</Label>
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
            </FormGroup>

            <FormGroup>
              <Label>직책</Label>
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
            </FormGroup>

            <FormGroup>
              <Label>새 비밀번호 (변경하지 않으려면 비워두세요)</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton onClick={handleCancel}>
                취소
              </CancelButton>
              <SaveButton onClick={handleSubmit}>
                저장
              </SaveButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default UserManager;
