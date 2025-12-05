import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import theme from '../../theme';
import Button from '../Button';
import {setCampTitle} from '../../redux/campTitleSlice';
import Dropdown from '../Dropdown';
import Timeline from '../TimeLine';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 7.5%;
  text-align: center;
  align-items: center;
  gap: 0.25rem;
`;

const H2 = styled.h2`
  font-size: 1.625rem;
  color: ${props => (props.$color ? theme.colors[props.$color] : 'white')};
  font-family: Nanum Myeongjo;
  font-weight: 900;
  margin: 6rem 7.5% 1rem 7.5%;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.animate {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  justify-item: center;
  align-items: center;
  opacity: 0;
  transform: translateY(50px) scale(0.95);
  transition: opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s;

  &.animate {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  margin: 0 0 1.25rem 0;
  order: 2;
  @media screen and (min-width: 1024px) {
    width: 350px;
    height: 350px;
  }
`;

const Figcaption = styled.figcaption`
  text-align: center;
  color: ${props => (props.$color ? theme.colors[props.$color] : theme.colors.red)};
  font-family: 'Goblin One';
  font-size: 1.25rem;
  margin: 0 0 1.25rem 0;
  order: 1;
`;

const FigureWrapper = styled.div`
  @media screen and (min-width: 1024px) {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
  }
`;

// 캠프 데이터를 정적으로 정의
const CAMP_DATA = {
  2024: {
    year: 2024,
    topic: '2024 주제 1',
    description: '체크용',
    location: 'KAIST',
    participants: 208,
    posterImage: '/camp_poster/2024.jpg',
    timeline: [
      { date: '2024.08.06', event: '이벤트1' }
    ]
  },
  2023: {
    year: 2023,
    topic: '2023 주제 1',
    description: '2023년 FIELD CAMP 설명...',
    location: 'KAIST',
    participants: 200,
    posterImage: '/camp_poster/2023.jpg',
    timeline: [
      { date: '2023.08.06', event: '이벤트1' }
    ]
  }
  // 필요한 만큼 연도별 데이터 추가
};

function CampTopicSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = React.useRef(null);
  const h2Ref = React.useRef(null);
  const figureRef = React.useRef(null);
  const campYear = useSelector(state => state.campTitle.value);
  const dispatch = useDispatch();

  // 컴포넌트 마운트 시 가장 최근 연도 선택
  React.useEffect(() => {
    const years = Object.keys(CAMP_DATA).map(Number).sort((a, b) => b - a);
    if (years.length > 0 && (!campYear || !years.includes(campYear))) {
      dispatch(setCampTitle(years[0]));
    }
  }, [dispatch, campYear]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            if (h2Ref.current) h2Ref.current.classList.add('animate');
            if (figureRef.current) figureRef.current.classList.add('animate');
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

  const toggleImageDisplay = index => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const currentCamp = CAMP_DATA[campYear];
  const years = Object.keys(CAMP_DATA).map(Number).sort((a, b) => b - a);

  if (!currentCamp) {
    return <div>데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <Section ref={sectionRef}>
      <H2 ref={h2Ref}>역대 FIELD CAMP</H2>
      <Dropdown title='FIELD CAMP' titleArr={years} />
      <FigureWrapper>
        <div>
          <Figure ref={figureRef}>
            <Img 
              src={currentCamp.posterImage}
              alt={`${currentCamp.year} FIELD CAMP 포스터`} 
            />
            <Figcaption $color={currentCamp.topic === '1st' ? 'red' : 'blue'}>
              {currentCamp.topic} TOPIC
            </Figcaption>
            <Button
              onClick={() => toggleImageDisplay(0)}
              label={expandedIndex === 0 ? '상세 정보 접기' : '상세 정보 펼치기'}
              order='3'
              mg='0 0 2rem 0'
            />
          </Figure>
          {expandedIndex === 0 && (
            <div>
              <h3>{currentCamp.year}년 FIELD CAMP</h3>
              <p>{currentCamp.description}</p>
              <p>장소: {currentCamp.location}</p>
              <p>참가자: {currentCamp.participants}명</p>
              {currentCamp.timeline && <Timeline events={currentCamp.timeline} />}
            </div>
          )}
        </div>
      </FigureWrapper>
    </Section>
  );
}

export default CampTopicSection;
