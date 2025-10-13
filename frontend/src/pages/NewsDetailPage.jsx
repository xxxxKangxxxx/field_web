import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {Pagination} from 'swiper/modules';
import {NewsDetailApi} from '../lib/Apiservice';
import LoadingSpinner from '../components/LoadingSpinner';
import theme from '../theme';

const Section = styled.section`
  margin: 0 7.5%;
  min-height: calc(100vh - 58px - 112px);
  @media screen and (min-width: 1024px) {
    width: 600px;
    margin: 0 auto;
  }
`;

const H1 = styled.h1`
  font-size: 1.875rem;
  font-family: 'Goblin one';
  text-align: center;
  @media screen and (min-width: 1024px) {
    font-size: 40px;
  }
`;

const H2 = styled.h2`
  font-size: 1.25rem;
  font-family: 'SUIT-Heavy';
  padding: 0 0 0.5rem 0;
  border-bottom: solid 1px;
`;

const P = styled.p`
  font-size: 16px;
  margin: 1rem 0;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
  white-space: pre-wrap;
  @media screen and (min-width: 1024px) {
    margin: 1rem 0 32px 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${props => (props.$mg ? props.$mg : '')};
  position: relative;
`;

const A = styled.a`
  font-size: 16px;
  font-weight: 900;
  display: flex;
  gap: 3px;
  align-items: center;
  color: white;
  margin: 9px 0;
  @media screen and (min-width: 1024px) {
    margin: 32px 0;
  }
`;

const FlexGrowDiv = styled.div`
  flex-grow: 1;
  margin: 0;
`;

const Icon = styled.img`
  cursor: ${props => props.$cursor || 'default'};
  align-self: ${props => props.$alignSelf || 'auto'};
  position: ${props => props.$position || ''};
  left: ${props => props.$left || ''};
  top: ${props => props.$top || ''};
  transform: ${props => props.$transform || ''};
`;
const DateP = styled.p`
  text-align: end;
  margin: 1rem 0;
  font-size: 0.75rem;
  font-weight: 900;
  @media screen and (min-width: 1024px) {
    font-size: 14px;
  }
`;

const StyledSwiper = styled(Swiper)`
  margin: 1rem 0;
  .swiper-pagination {
    position: relative;
    bottom: -1px;
    margin: 0.5rem 0 1rem 0;
  }

  .swiper-pagination-bullet {
    background-color: white;
  }

  .swiper-pagination-bullet-active {
    background-color: ${theme.colors.yellow};
  }
`;

const SlideImg = styled.img`
  width: 100%;
  height: 400px;
  object-fit: fill;
  @media screen and (min-width: 1024px) {
    height: 750px;
  }
`;

function NewsDetailPage() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [detailNewsData, setDetailNewsData] = useState({});
  const [loading, setLoading] = useState(true);

  const localDetailData = localStorage.getItem(id);
  const getDataDetail = async () => {
    try {
      if (localDetailData) {
        setDetailNewsData(JSON.parse(localDetailData));
        setLoading(false);
      } else {
        const response = await NewsDetailApi(id);
        localStorage.setItem(id, JSON.stringify(response));
        setDetailNewsData(response);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fileUrl = `${import.meta.env.VITE_API_URL}/api/files/damzbyg116zhar4/`;

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    getDataDetail();
  }, []);

  return (
    <Section>
      <Wrapper $mg='2rem 0'>
        <Icon
          src='/Refund_back.png'
          onClick={handleBack}
          $cursor='pointer'
          $alignSelf='center'
          $position='absolute'
          $left='0'
          $top='50%'
          $transform='translateY(-50%)'
        />
        <FlexGrowDiv />
        <H1>NEWS</H1>
        <FlexGrowDiv />
      </Wrapper>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <H2>{detailNewsData.title}</H2>
          <DateP>{detailNewsData.date ? detailNewsData.date.slice(0, 10) : ''}</DateP>
          <StyledSwiper modules={[Pagination]} centeredSlides='true' pagination={{clickable: true}}>
            {detailNewsData.photo.length > 0 &&
              detailNewsData.photo.map(item => (
                <SwiperSlide key={item}>
                  <SlideImg
                    key={item}
                    src={`${fileUrl}${detailNewsData.id}/${item}`}
                    alt={`${item}`}
                  />
                </SwiperSlide>
              ))}
          </StyledSwiper>
          <P>{detailNewsData.contents}</P>
          {detailNewsData.url && <A href={`${detailNewsData.url}`}>👉해당 공모전 보러가기</A>}
          <Wrapper>
            {detailNewsData?.file.length > 0 ? (
              <A href={`${fileUrl}${detailNewsData.id}/${detailNewsData.file[0]}`} target='_blank'>
                첨부파일
                <Icon src='/fileIcon.png' />
              </A>
            ) : (
              <div style={{flex: 1}} />
            )}
          </Wrapper>{' '}
        </>
      )}
    </Section>
  );
}

export default NewsDetailPage;
