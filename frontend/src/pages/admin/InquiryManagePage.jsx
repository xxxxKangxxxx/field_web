import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import Modal from '../../components/Modal';

const Container = styled.div`
  padding: 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
`;

const Th = styled.th`
  border: 1px solid #444;
  padding: 0.5rem;
  background-color: #222;
  font-size: 0.9rem;
`;

const Td = styled.td`
  border: 1px solid #444;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.85rem;
`;

const Tr = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

const ModalContent = styled.div`
  width: 80vw;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border-radius: 8px;
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
`;

const ModalInfo = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #aaa;

  p {
    margin: 0.3rem 0;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const StatusButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  background-color: ${props => 
    props.$status === '대기중' ? '#333' :
    props.$status === '처리중' ? '#2196f3' :
    '#4CAF50'
  };
  color: white;
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &:hover {
    opacity: ${props => props.disabled ? '0.5' : '0.8'};
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background-color: ${props => 
    props.$status === '대기중' ? 'rgba(51, 51, 51, 0.8)' :
    props.$status === '처리중' ? 'rgba(33, 150, 243, 0.2)' :
    'rgba(76, 175, 80, 0.2)'
  };
  color: ${props => 
    props.$status === '대기중' ? '#fff' :
    props.$status === '처리중' ? '#2196f3' :
    '#4CAF50'
  };
`;

function InquiryManagePage() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }
    fetchInquiries();
  }, [navigate, user]);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/api/inquiries/all');
      setInquiries(response.data);
    } catch (error) {
      console.error('문의사항 조회 실패:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await api.patch(`/api/inquiries/${inquiryId}/status`, {
        status: newStatus
      });
      await fetchInquiries();
      if (selectedInquiry && selectedInquiry._id === inquiryId) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'inProgress':
        return '처리중';
      case 'completed':
        return '완료';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Container>
      <Title>문의사항 관리</Title>
      <Table>
        <thead>
          <tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>상태</Th>
            <Th>작성일</Th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry, index) => (
            <Tr key={inquiry._id} onClick={() => handleInquiryClick(inquiry)}>
              <Td>{inquiries.length - index}</Td>
              <Td>{inquiry.title}</Td>
              <Td>
                <StatusBadge $status={getStatusText(inquiry.status)}>
                  {getStatusText(inquiry.status)}
                </StatusBadge>
              </Td>
              <Td>{new Date(inquiry.createdAt).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      {selectedInquiry && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
          <ModalContent>
            <ModalTitle>{selectedInquiry.title}</ModalTitle>
            <ModalInfo>
              <p>문의유형: {selectedInquiry.type}</p>
              <p>이름: {selectedInquiry.name}</p>
              <p>이메일: {selectedInquiry.email}</p>
              <p>연락처: {selectedInquiry.phone}</p>
              <p>작성일: {new Date(selectedInquiry.createdAt).toLocaleDateString()}</p>
              <div>
                상태: 
                <StatusButton
                  $status="대기중"
                  onClick={() => handleStatusChange(selectedInquiry._id, 'pending')}
                  disabled={selectedInquiry.status === 'pending'}
                >
                  대기중
                </StatusButton>
                <StatusButton
                  $status="처리중"
                  onClick={() => handleStatusChange(selectedInquiry._id, 'inProgress')}
                  disabled={selectedInquiry.status === 'inProgress'}
                >
                  처리중
                </StatusButton>
                <StatusButton
                  $status="완료"
                  onClick={() => handleStatusChange(selectedInquiry._id, 'completed')}
                  disabled={selectedInquiry.status === 'completed'}
                >
                  완료
                </StatusButton>
              </div>
            </ModalInfo>
            <ModalBody>
              {selectedInquiry.content}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default InquiryManagePage; 