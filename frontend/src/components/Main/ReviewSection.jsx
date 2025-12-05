import styled from 'styled-components';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {useEffect, useState, useRef} from 'react';
import theme from '../../theme';
import {ReviewApi} from '../../lib/Apiservice';

const H2 = styled.h2`
  font-size: 1.875rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
`;

const GoblinH2 = styled(H2)`
  font-family: 'Goblin One';
  font-size: ${props => props.$size || '1.875rem'};
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.animate {
    opacity: 1;
    transform: translateY(0);
  }

  ${theme.media.tablet} {
    font-size: 1.5rem;
  }

  ${theme.media.desktop} {
    font-size: ${props => props.$size || '1.875rem'};
  }
`;

const SwiperContainer = styled.div`
  margin: ${props => props.$margin || '0'};
`;

const WriterContainer = styled.div`
  width: 90%;
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 1rem;
  text-align: center;

  ${theme.media.desktop} {
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const Card = styled.article`
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${props => props.src});
  background-color: ${theme.colors.blue};
  padding: 1rem;
  background-position: center;
  border-radius: 0.625rem;
  ${props => props.$border && 'border: 2px solid white;'}
  height: 25rem;
  position: relative;
  width: 100%;
  max-width: 100%;
  transition: transform 0.3s ease, filter 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    filter: brightness(1.1);
  }

  ${theme.media.tablet} {
    width: 550px;
    height: 400px;
  }

  ${theme.media.desktop} {
    width: 420px;
    height: 320px;
  }
`;

const P = styled.p`
  margin: ${props => props.$margin || '0'};
  line-height: 1.5;
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: ${props => (props.size ? props.size : '1rem')};
  text-align: ${props => props.align || ''};
  font-weight: ${props => props.$weight || ''};

  ${theme.media.desktop} {
    font-size: ${props => props.$desktopSize || '1rem'};
  }
`;

const H3 = styled.h3`
  display: flex;
  flex-direction: column;
  font-size: 1.5625rem;
  font-weight: 900;
  margin: ${props => props.$margin || '0'};
  word-break: keep-all;

  ${theme.media.mobile} {
    font-size: 1.375rem;
  }

  ${theme.media.desktop} {
    font-size: 1.2rem;
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

function ReviewSection() {
  const [reviewData, setReviewData] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const h2Ref = useRef(null);
  const sectionRef = useRef(null);
  const EXPIRY_DURATION = 365 * 24 * 60 * 60 * 1000;

  const getReview = async () => {
    try {
      const localData = localStorage.getItem('reviewData');
      const expiryTime = localStorage.getItem('expiryTime');
      if (localData && expiryTime && new Date().getTime() < expiryTime) {
        setReviewData(JSON.parse(localData));
      } else {
        const response = await ReviewApi();
        setReviewData(response);
        localStorage.setItem('reviewData', JSON.stringify(response));
        localStorage.setItem('expiryTime', new Date().getTime() + EXPIRY_DURATION);
      }
    } catch (err) {
      // 에러 처리
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            if (h2Ref.current) {
              h2Ref.current.classList.add('animate');
            }
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <div ref={sectionRef}>
      <GoblinH2 ref={h2Ref} $margin='8rem 0 4rem 0' $size='1.25rem'>
        How was your FIELD?
      </GoblinH2>
      <SwiperContainer $margin='2rem 0 5rem 0'>
        <StyledSwiper
          modules={[Pagination]}
          spaceBetween={20}
          centeredSlides='true'
          pagination={{clickable: true}}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            },
            896: {
              slidesPerView: 1.5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
          }}
        >
          {reviewData.map(item => (
            <SwiperSlide key={item.id}>
              <Card $border='true'>
                <H3 $margin='0.5rem 0 1rem 0'>{item.firstQuestion}</H3>
                <P $margin='1rem 0' size='0.875rem' $desktopSize='0.9rem'>
                  {item.firstAnswer}
                </P>
                <WriterContainer>
                  <P color='yellow' size='1.125rem' $weight='800' $desktopSize='1rem'>
                    {item.school}
                  </P>
                  <P color='yellow' size='1.125rem' $weight='800' $desktopSize='1rem'>
                    {item.author}
                  </P>
                </WriterContainer>
              </Card>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </SwiperContainer>
    </div>
  );
}

export default ReviewSection;
