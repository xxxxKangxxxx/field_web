import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { MANAGER_POSITIONS_LIST } from '../../redux/authSlice';

const NewsDetailContainer = styled.div`
  padding: 2rem 10%;
  min-height: calc(100vh - 58px);
  color: ${props => props.theme.colors.white};

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
`;

const Header = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const CategoryTag = styled.span`
  padding: 0.15rem 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 0.7rem;
  display: inline-block;
  margin-bottom: 0.8rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0 0 0.8rem 0;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1rem;
  color: ${props => props.theme.colors.gray};
  font-size: 0.85rem;
  margin-bottom: 0;
`;

const ContentImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 2rem 0;
  border-radius: 8px;
`;

const Content = styled.div`
  line-height: 1.8;
  font-size: 0.875rem;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.3rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.625rem;
  border: none;
  background-color: ${props => props.$variant === 'delete' ? '#ff4444' : '#FFD700'};
  color: ${props => props.$variant === 'delete' ? 'white' : 'black'};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const FileSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const FileTitle = styled.h3`
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
  color: ${props => props.theme.colors.white};
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FileIcon = styled.span`
  font-size: 1.2rem;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.white};
  margin-bottom: 0.2rem;
`;

const FileType = styled.div`
  font-size: 0.65rem;
  color: ${props => props.theme.colors.gray};
`;

const DownloadButton = styled.a`
  padding: 0.3rem 0.8rem;
  background: #FFD700;
  color: black;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.625rem;
  font-weight: 600;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const auth = useSelector(state => state.auth);
  const isAdmin = auth?.user?.isAdmin || 
                 auth?.user?.position === '단장' || 
                 auth?.user?.position === '부단장' || 
                 MANAGER_POSITIONS_LIST.includes(auth?.user?.position);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.token) {
      navigate('/login');
      return;
    }

    const fetchNews = async () => {
      try {
        const response = await api.get(`/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          navigate('/news');
        }
      }
    };

    fetchNews();
  }, [id, navigate, auth.isAuthenticated, auth.token]);

  const handleDelete = async () => {
    if (!auth.isAuthenticated || !auth.token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

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

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel')) return '📊';
    if (fileType.includes('powerpoint')) return '📑';
    return '📎';
  };

  return (
    <NewsDetailContainer>
      <Header>
        <CategoryTag>{getCategoryName(news.category)}</CategoryTag>
        <Title>{news.title}</Title>
        <MetaInfo>
          <span>{news.author?.department || '관리자'}</span>
          <span>{formatDate(news.createdAt)}</span>
        </MetaInfo>
      </Header>

      {news.fileUrl && (
        <FileSection>
          <FileTitle>첨부 파일</FileTitle>
          <FileList>
            <FileItem>
              <FileIcon>{getFileIcon(news.fileType)}</FileIcon>
              <FileInfo>
                <FileName>{news.fileName}</FileName>
                <FileType>{news.fileType}</FileType>
              </FileInfo>
              <DownloadButton 
                href={`http://localhost:4001/api/news${news.fileUrl}`} 
                download={news.fileName}
                target="_blank"
                rel="noopener noreferrer"
              >
                다운로드
              </DownloadButton>
            </FileItem>
          </FileList>
        </FileSection>
      )}

      <Content>{news.content}</Content>

      {news.fileType?.startsWith('image/') && (
        <ContentImage 
          src={`http://localhost:4001/api/news${news.fileUrl}`} 
          alt={news.fileName}
        />
      )}

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