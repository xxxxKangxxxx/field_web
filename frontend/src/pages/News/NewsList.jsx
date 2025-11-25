import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';

const NewsListContainer = styled.div`
  padding: 2rem 10%;
  min-height: calc(100vh - 58px);

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
`;

const NewsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: ${props => props.theme.colors.white};
  margin: 0;
`;

const CategoryNav = styled.nav`
  display: flex;
  gap: 0.7rem;
  margin-top: -0.5rem;
  align-items: center;
  justify-content: space-between;
`;

const CategoryButtons = styled.div`
  display: flex;
  gap: 0.7rem;
`;

const CategoryButton = styled.button`
  padding: 0.25rem 1rem;
  border: 1px solid ${props => props.theme.colors.white};
  border-radius: 15px;
  background: ${props => props.$isActive ? props.theme.colors.white : 'transparent'};
  color: ${props => props.$isActive ? '#000' : props.theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.725rem;
  font-weight: 500;

  &:hover {
    background: ${props => props.$isActive ? props.theme.colors.white : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateButton = styled(Link)`
  padding: 0.35rem 0.8rem;
  background-color: #FFD700;
  color: #000;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.65rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled(Link)`
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease;
  display: flex;
  height: 130px;
  width: 100%;

  &:hover {
    transform: translateY(-3px);
  }
`;

const NewsImage = styled.img`
  width: 130px;
  height: 130px;
  object-fit: cover;
  flex-shrink: 0;
`;

const NewsContent = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const BottomSection = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const NewsTitle = styled.h3`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.white};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`;

const NewsInfo = styled.div`
  display: flex;
  justify-content: flex-end;
  color: ${props => props.theme.colors.gray};
  font-size: 0.8rem;
`;

const DateDisplay = styled.span`
  color: ${props => props.theme.colors.gray};
  font-size: 0.75rem;
`;

const CategoryTag = styled.span`
  padding: 0.15rem 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  font-size: 0.65rem;
  display: inline-block;
  width: fit-content;
`;

const AdminBadge = styled.span`
  background: #FFD700;
  color: #000;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.gray300};
  font-size: 0.75rem;

  span {
    display: flex;
    align-items: center;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.gray300};
  cursor: pointer;
  padding: 0.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.white};
  }
`;

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const auth = useSelector(state => state.auth);
  const isAdmin = auth?.user?.isAdmin;
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'monthly', name: '월간필드' },
    { id: 'career', name: '취업/진로' },
    { id: 'notice', name: '공지사항' }
  ];

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId && cat.id !== 'all');
    return category ? category.name : categoryId;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:4002/api/news');
        setNews(response.data);
      } catch (error) {
        console.error('뉴스 목록을 불러오는데 실패했습니다:', error);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter(item => 
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // 이벤트 버블링 방지
    if (window.confirm('정말로 이 글을 삭제하시겠습니까?')) {
      try {
        const token = auth.token;
        if (!token) {
          throw new Error('인증 토큰이 없습니다.');
        }

        await axios.delete(`http://localhost:4002/api/news/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        setNews(news.filter(item => item._id !== id));
      } catch (error) {
        console.error('뉴스 삭제 에러:', error);
        if (error.response?.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (error.response?.status === 403) {
          alert('삭제 권한이 없습니다.');
        } else {
          alert('뉴스 삭제에 실패했습니다.');
        }
      }
    }
  };

  const handleEdit = (id, e) => {
    e.preventDefault(); // 이벤트 버블링 방지
    navigate(`/news/edit/${id}`);
  };

  return (
    <NewsListContainer>
      <NewsHeader>
        <Title>NEWS</Title>
        <CategoryNav>
          <CategoryButtons>
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                $isActive={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </CategoryButton>
            ))}
          </CategoryButtons>
          {isAdmin && (
            <CreateButton to="/news/create">글 작성하기</CreateButton>
          )}
        </CategoryNav>
      </NewsHeader>
      <NewsGrid>
        {filteredNews.map((item) => (
          <NewsCard key={item._id} to={`/news/${item._id}`}>
            {item.thumbnail && (
              <NewsImage src={item.thumbnail} alt={item.title} />
            )}
            <NewsContent>
              <TopSection>
                <CategoryTag>
                  {getCategoryName(item.category)}
                </CategoryTag>
                <NewsTitle>{item.title}</NewsTitle>
              </TopSection>
              <BottomSection>
                <DateDisplay>{formatDate(item.createdAt)}</DateDisplay>
                <NewsInfo>
                  <AuthorInfo>
                    <span>
                      {item.author?.department || '관리자'}
                      {item.author?.isAdmin && <AdminBadge>관리자</AdminBadge>}
                    </span>
                  </AuthorInfo>
                </NewsInfo>
              </BottomSection>
              {isAdmin && (
                <ActionButtons onClick={e => e.preventDefault()}>
                  <ActionButton onClick={(e) => handleEdit(item._id, e)}>
                    <i className="fas fa-edit"></i>
                  </ActionButton>
                  <ActionButton onClick={(e) => handleDelete(item._id, e)}>
                    <i className="fas fa-trash"></i>
                  </ActionButton>
                </ActionButtons>
              )}
            </NewsContent>
          </NewsCard>
        ))}
      </NewsGrid>
    </NewsListContainer>
  );
};

export default NewsList; 