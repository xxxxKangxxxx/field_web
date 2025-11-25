import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-family: 'ChosunKm';
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.white};
`;

const InquiryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InquiryItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const InquiryIndex = styled.span`
  width: 50px;
  color: ${props => props.theme.colors.gray};
`;

const InquiryTitle = styled.span`
  flex: 1;
  color: ${props => props.theme.colors.white};
`;

const InquiryDate = styled.span`
  width: 120px;
  color: ${props => props.theme.colors.gray};
  text-align: right;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.white};
`;

const ModalContent = styled.div`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.white};
`;

const ModalInfo = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.gray};
  font-size: 0.9rem;
`;

const CloseButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  float: right;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 1rem;
  background: ${props => {
    switch (props.$status) {
      case 'pending':
        return 'rgba(255, 193, 7, 0.2)';
      case 'inProgress':
        return 'rgba(33, 150, 243, 0.2)';
      case 'completed':
        return 'rgba(76, 175, 80, 0.2)';
      default:
        return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending':
        return '#ffc107';
      case 'inProgress':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      default:
        return '#9e9e9e';
    }
  }};
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StatusButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: ${props => {
    if (props.$active) {
      switch (props.$status) {
        case 'pending': return '#ffc107';
        case 'inProgress': return '#2196f3';
        case 'completed': return '#4caf50';
        default: return '#9e9e9e';
      }
    }
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.$active ? '#000' : '#fff'};

  &:hover {
    opacity: 0.8;
  }
`;

function InquiryManagePage() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchInquiries();
  }, [isAdmin]);

  const fetchInquiries = async () => {
    try {
      const response = await api.get(isAdmin ? '/api/inquiries/all' : '/api/inquiries');
      setInquiries(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleInquiryClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (inquiryId, newStatus) => {
    if (!isAdmin) return;
    
    try {
      await api.patch(`/api/inquiries/${inquiryId}/status`, { status: newStatus });
      fetchInquiries(); // 목록 새로고침
      setIsModalOpen(false);
    } catch (error) {
      // 에러 처리
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
    <PageContainer>
      <PageTitle>{isAdmin ? '문의사항 관리' : '나의 문의사항'}</PageTitle>
      <InquiryList>
        {inquiries.map((inquiry, index) => (
          <InquiryItem key={inquiry._id} onClick={() => handleInquiryClick(inquiry)}>
            <InquiryIndex>{inquiries.length - index}</InquiryIndex>
            <InquiryTitle>
              {inquiry.title}
              <StatusBadge $status={inquiry.status}>
                {getStatusText(inquiry.status)}
              </StatusBadge>
            </InquiryTitle>
            <InquiryDate>{new Date(inquiry.createdAt).toLocaleDateString()}</InquiryDate>
          </InquiryItem>
        ))}
      </InquiryList>

      {isModalOpen && selectedInquiry && (
        <>
          <Overlay onClick={() => setIsModalOpen(false)} />
          <Modal>
            <ModalTitle>{selectedInquiry.title}</ModalTitle>
            <ModalInfo>
              <span>문의유형: {selectedInquiry.type}</span>
              {isAdmin && (
                <>
                  <span>이름: {selectedInquiry.name}</span>
                  <span>이메일: {selectedInquiry.email}</span>
                  <span>연락처: {selectedInquiry.phone}</span>
                </>
              )}
              <span>작성일: {new Date(selectedInquiry.createdAt).toLocaleDateString()}</span>
            </ModalInfo>
            <ModalContent>{selectedInquiry.content}</ModalContent>
            {isAdmin && (
              <StatusButtons>
                <StatusButton 
                  $status="pending"
                  $active={selectedInquiry.status === 'pending'}
                  onClick={() => handleStatusUpdate(selectedInquiry._id, 'pending')}
                >
                  대기중
                </StatusButton>
                <StatusButton 
                  $status="inProgress"
                  $active={selectedInquiry.status === 'inProgress'}
                  onClick={() => handleStatusUpdate(selectedInquiry._id, 'inProgress')}
                >
                  처리중
                </StatusButton>
                <StatusButton 
                  $status="completed"
                  $active={selectedInquiry.status === 'completed'}
                  onClick={() => handleStatusUpdate(selectedInquiry._id, 'completed')}
                >
                  완료
                </StatusButton>
              </StatusButtons>
            )}
            <CloseButton onClick={() => setIsModalOpen(false)}>닫기</CloseButton>
          </Modal>
        </>
      )}
    </PageContainer>
  );
}

export default InquiryManagePage; 