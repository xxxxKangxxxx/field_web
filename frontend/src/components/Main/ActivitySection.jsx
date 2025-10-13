import React from 'react';
import styled from 'styled-components';
import {Pagination, Autoplay} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import theme from '../../theme';
import 'swiper/swiper-bundle.css';
import 'swiper/css/pagination';
import ActivityIntro from './ActivityIntro';
import ActivityCamp from '../../../public/ActivityCamp.png';
import ActivityLT from '../../../public/ActivityLt.png';
import ActivitySeminar from '../../../public/ActivitySeminar.png';
import ActivitySupport from '../../../public/ActivitySupport.png';
import ActivityYoutube from '../../../public/ActivityYoutube.png';
import ActivityInterview from '../../../public/ActivityInterview.png';
import ActivityIntroduce from '../../../public/ActivityIntro.png';

const H2 = styled.h2`
  font-size: 1.875rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
  font-weight: 700;
`;

const SwiperContainer = styled.div`
  width: 100%;
  margin: ${props => props.$margin || '0'};
`;

const NanumH2 = styled(H2)`
  font-family: 'Nanum Myeongjo', serif;
  @media screen and (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StyledSwiper = styled(Swiper)`
  .swiper-pagination {
    position: relative;
    bottom: -1px;
  }
  .swiper-pagination-bullet {
    background-color: white;
  }

  .swiper-pagination-bullet-active {
    background-color: ${theme.colors.blue};
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

function ActivitySection() {
  return (
    <section>
      <NanumH2 $margin='2rem 7.5% 1rem 7.5%'>인적, 학술적 교류를</NanumH2>
      <NanumH2 $margin='0 7.5% 2rem 7.5%'>실현하는 다양한 활동들</NanumH2>
      <SwiperContainer $margin='2rem 0'>
        <StyledSwiper
          modules={[Pagination, Autoplay]}
          centeredSlides
          pagination={{clickable: true}}
          autoplay={{delay: 3000}}
          breakpoints={{
            896: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
          }}
        >
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivityLT}
              title='LT'
              content='매년 진행되는 FIELD LT를 통해 다양한 산업공학도들과 함께 인적교류를 즐겨보아요!'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivityYoutube}
              title='유튜브'
              content='유튜브 채널을 통해 창의적이고 혁신적인 컨텐츠를 직접 기획하고 제작하는 현장을 경험해보세요!'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivityInterview}
              title='기업인 인터뷰'
              content='산업공학의 다양한 분야에서 활동 중인 전문가들과의 대화를 통해 진로에 대한 영감을 얻고, 현업에서의 성공비법을 배워보세요.'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivitySeminar}
              title='세미나'
              content='세미나 활동을 통해 함께하는 학술적인 여정에서 산업공학의 깊이있는 통찰력을 개발하세요.'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivitySupport}
              title='서포터즈'
              content='청년일보 서포터즈로 참여하면 대학생 기자로 성장하는 특별한 기회가 여러분을 기다립니다.'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivityIntroduce}
              title='고교방문설명회'
              content='문제해결 능력을 키우는 산업공학의 매력을 전하며, 진로 선택에 도움을 주고자 합니다.'
            />
          </SwiperSlide>
          <SwiperSlide>
            <ActivityIntro
              backgroundImage={ActivityCamp}
              title='필드캠프'
              content='매년 8월, 다양한 산업공학도들과 함께 인적, 학술적 교류의 기회를 제공합니다. 우리와 함께 미래를 열어가는 여정에 참여하세요!'
            />
          </SwiperSlide>
        </StyledSwiper>
      </SwiperContainer>
    </section>
  );
}

export default ActivitySection;
