import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Pagination} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Ul = styled.ul`
  margin: 1.25rem 7.5%;
  @media screen and (min-width: 1024px) {
    margin: 1.25rem 15%;
  }
`;

const Li = styled.li`
  display: grid;
  grid-template-areas:
    'thumbnail title1'
    'thumbnail title2'
    'thumbnail date';
  font-size: 1.125rem;
  color: white;
  border: none;
  border-bottom: solid 0.0625rem;
  padding: 0.5rem 0;
  text-align: end;
  a {
    border: none;
    color: inherit;
    text-decoration: none;
    display: contents;
  }
  @media screen and (min-width: 1024px) {
    font-size: 24px;
    grid-template-columns: auto 1fr;
  }
`;

const Thumbnail = styled.img`
  grid-area: thumbnail;
  width: 100px;
  height: 70px;
  @media screen and (min-width: 769px) {
    width: 160px;
    height: 110px;
    margin-right: 10px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1024px) {
    display: flex;
    flex-direction: row;
  }
`;

const TitleSpan = styled.span`
  grid-area: title1;
  font-weight: 800;
  @media screen and (min-width: 1024px) {
    justify-self: start;
  }
`;

const Title2Span = styled.span`
  margin: 0.5rem 0 0 0;
  font-weight: 800;
  @media screen and (min-width: 1024px) {
    justify-self: start;
    margin: 0 0 0 4px;
  }
`;

const ContentSpan = styled.span`
  visibility: hidden;
  @media screen and (min-width: 1024px) {
    visibility: visible;
    text-align: start;
    font-size: 16px;
    word-break: keep-all;
  }
`;

const DateSpan = styled.span`
  grid-area: date;
  font-size: 0.625rem;
  // margin: 1.125rem 0 0 0;
  font-weight: 700;
  align-self: end;
  @media screen and (min-width: 1024px) {
    font-size: 16px;
    justify-self: end;
    margin-left: auto;
  }
`;

const CustomPagination = styled(Pagination)`
  .MuiPaginationItem-root {
    color: white;
    margin: 0 0.25rem 1rem 0.25rem;
  }
`;

function NewsPagination({newsData, category, loading}) {
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const [IsShowContent, setIsShowContent] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const imageUrl = `${import.meta.env.VITE_API_URL}/api/files/`;
  const handlePageChange = (event, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('page', value);
    navigate(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    const urlPage = new URLSearchParams(window.location.search).get('page');
    setCurrentPage(parseInt(urlPage, 10) || 1);
  }, [category, window.location.search]);

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setIsShowContent(true);
    } else {
      setIsShowContent(false);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItemPerPage = newsData.slice(startIndex, endIndex);

  return !loading && currentItemPerPage.length > 0 && newsData[0].category === category ? (
    <>
      <Ul>
        {currentItemPerPage.map(item => (
          <Li key={item.id}>
            <Link to={`/news/detail/${item.newsId}`}>
              <Thumbnail src={`${imageUrl}${item.collectionId}/${item.id}/${item.thumbnail}`} />
              <TitleWrapper>
                <TitleSpan>{item.title1} </TitleSpan>
                <Title2Span>{item.title2 ? item.title2 : ''}</Title2Span>
              </TitleWrapper>

              {IsShowContent && (
                <ContentSpan>
                  {item.expand.newsId.contents.length < 200
                    ? item.expand.newsId.contents
                    : `${item.expand.newsId.contents.slice(0, 100)}...`}
                </ContentSpan>
              )}
              <DateSpan>
                {item.year}년 {item.month}월 {item.day}일
              </DateSpan>
            </Link>
          </Li>
        ))}
      </Ul>
      <PageWrapper>
        <CustomPagination
          count={Math.ceil(newsData.length / itemsPerPage)}
          color='primary'
          defaultPage={1}
          page={currentPage}
          onChange={handlePageChange}
        />
      </PageWrapper>
    </>
  ) : (
    <LoadingSpinner />
  );
}

export default NewsPagination;
