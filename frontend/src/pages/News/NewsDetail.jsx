import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../theme';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { MANAGER_POSITIONS_LIST } from '../../redux/authSlice';

const NewsDetailContainer = styled.div`
  padding: 2rem 5%;
  min-height: calc(100vh - 58px);
  color: ${props => props.theme.colors.white};
  max-width: 1200px;
  margin: 0 auto;

  ${theme.media.tablet} {
    padding: 2rem 4%;
  }

  ${theme.media.mobile} {
    padding: 2rem 3%;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
`;

const CategoryTag = styled.span`
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.white};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  color: ${props => props.theme.colors.white};

  ${theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  color: ${props => props.theme.colors.gray300};
  font-size: 0.875rem;
  margin-top: 0.5rem;
  
  span {
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      width: 4px;
      height: 4px;
      background: ${props => props.theme.colors.gray};
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    
    &:first-child::before {
      display: none;
    }
  }
`;

const ContentImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: block;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  ${theme.media.mobile} {
    max-width: 100%;
    margin: 1rem 0;
  }
`;

const ImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

const ImageModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1001;
  padding: 0.5rem;
  line-height: 1;
  min-width: 40px;
  min-height: 40px;
  
  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const Content = styled.div`
  line-height: 1.9;
  font-size: 0.9375rem;
  white-space: pre-wrap;
  color: ${props => props.theme.colors.white};
  margin-top: 2rem;
  
  ${theme.media.mobile} {
    font-size: 0.875rem;
    line-height: 1.8;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.75rem;
  border: none;
  background-color: ${props => props.$variant === 'delete' ? '#ff4444' : '#FFD700'};
  color: ${props => props.$variant === 'delete' ? 'white' : 'black'};
  transition: all 0.2s ease;

  &:hover {
    ${props => props.$variant === 'delete' 
      ? 'background-color: #ff6666; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(255, 68, 68, 0.3);'
      : 'background-color: #ffed4e; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);'
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const FileSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FileTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &::before {
    content: '📎';
    font-size: 0.8rem;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const FileIcon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.colors.white};
  border: none;
  padding: 0;

  &:hover {
    background: #FFD700;
    color: #000;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(1.05);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const FileName = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.white};
  margin-bottom: 0.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileType = styled.div`
  font-size: 0.65rem;
  color: ${props => props.theme.colors.gray300};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }

  ${theme.media.mobile} {
    padding: 0.3rem 0.75rem;
  }
`;

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const auth = useSelector(state => state.auth);
  const isAdmin = auth?.user?.isAdmin || 
                 auth?.user?.position === '단장' || 
                 auth?.user?.position === '부단장' || 
                 MANAGER_POSITIONS_LIST.includes(auth?.user?.position);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          alert('존재하지 않는 뉴스입니다.');
          navigate('/news');
        } else {
          console.error('뉴스를 불러오는 중 오류가 발생했습니다:', error);
          navigate('/news');
        }
      }
    };

    fetchNews();
  }, [id, navigate]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isImageModalOpen) {
        setIsImageModalOpen(false);
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // 모달 열릴 때 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

  const handleDelete = async () => {
    if (!isAdmin) {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        const response = await api.delete(`/api/news/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        
        if (response.status === 200) {
          alert('성공적으로 삭제되었습니다.');
          navigate('/news');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert('인증이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          alert('삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  const handleEdit = () => {
    navigate(`/news/edit/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileDownload = async (e) => {
    e.preventDefault();
    if (!news.fileUrl || !news.fileName) return;

    try {
      // 파일명 디코딩
      const decodedFileName = news.fileName ? decodeURIComponent(news.fileName) : '파일';
      
      // 파일을 fetch로 가져오기
      const response = await fetch(news.fileUrl);
      if (!response.ok) {
        throw new Error('파일 다운로드에 실패했습니다.');
      }

      // Blob으로 변환
      const blob = await response.blob();
      
      // 임시 다운로드 링크 생성
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = decodedFileName;
      document.body.appendChild(link);
      link.click();
      
      // 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  if (!news) {
    return <NewsDetailContainer>로딩 중...</NewsDetailContainer>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (category) => {
    const categories = {
      'monthly': '월간 필드',
      'career': '취업/진로',
      'notice': '공지'
    };
    return categories[category] || category;
  };

  const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  return (
    <NewsDetailContainer>
      <BackButton onClick={handleBack}>
        <span>←</span>
        <span>뒤로</span>
      </BackButton>
      <Header>
        <CategoryTag>{getCategoryName(news.category)}</CategoryTag>
        <Title>{news.title}</Title>
        <MetaInfo>
          <span>{news.author?.name || '관리자'}</span>
          <span>{news.author?.department || '관리자'}</span>
          <span>{formatDate(news.createdAt)}</span>
        </MetaInfo>
      </Header>

      {(news.fileUrl || news.fileName) && (
        <FileSection>
          <FileTitle>첨부 파일</FileTitle>
          <FileList>
            <FileItem>
              {news.fileUrl ? (
                <FileIcon 
                  onClick={handleFileDownload}
                  title="다운로드"
                >
                  <DownloadIcon />
                </FileIcon>
              ) : (
                <FileIcon as="div" style={{ cursor: 'default', opacity: 0.5, pointerEvents: 'none' }}>
                  <DownloadIcon />
                </FileIcon>
              )}
              <FileInfo>
                <FileName>{news.fileName ? decodeURIComponent(news.fileName) : '파일'}</FileName>
                {news.fileType && <FileType>{news.fileType}</FileType>}
              </FileInfo>
            </FileItem>
          </FileList>
        </FileSection>
      )}

      {news.fileType?.startsWith('image/') && news.fileUrl && (
        <>
          <ContentImage 
            src={news.fileUrl} 
            alt={news.fileName || '이미지'}
            onClick={() => setIsImageModalOpen(true)}
          />
          {isImageModalOpen && (
            <ImageModalOverlay onClick={() => setIsImageModalOpen(false)}>
              <ImageModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={() => setIsImageModalOpen(false)}>
                  ×
                </CloseButton>
                <img 
                  src={news.fileUrl} 
                  alt={news.fileName || '이미지'}
                />
              </ImageModalContent>
            </ImageModalOverlay>
          )}
        </>
      )}

      <Content>{news.content}</Content>

      {isAdmin && (
        <ButtonContainer>
          <Button onClick={handleEdit}>수정하기</Button>
          <Button $variant="delete" onClick={handleDelete}>삭제하기</Button>
        </ButtonContainer>
      )}
    </NewsDetailContainer>
  );
};

export default NewsDetail; 