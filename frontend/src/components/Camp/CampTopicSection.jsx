import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import theme from '../../theme';
import Dropdown from '../Dropdown';
import topic2025_1 from '../../assets/camp/FIELD_CAMP_주제1.jpg';
import topic2025_2 from '../../assets/camp/FIELD_CAMP_주제2.jpg';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 7.5% 12rem 7.5%;
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
  align-items: center;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 0 0 1.25rem 0;

  @media screen and (min-width: 1024px) {
    width: 420px;
  }
`;

const Figcaption = styled.figcaption`
  text-align: center;
  color: ${props => (props.$color ? theme.colors[props.$color] : theme.colors.red)};
  font-family: 'Goblin One';
  font-size: 1.25rem;
  margin: 0 0 1.25rem 0;
`;

const FigureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;

  @media screen and (min-width: 1024px) {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }
`;

const PreviewOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PreviewImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 1.25rem;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
`;

// 현재는 2025 FIELD CAMP 데이터만 사용
const CAMP_DATA = {
  2025: {
    year: 2025,
    topics: [
      {
        id: 1,
        label: '주제 1',
        posterImage: topic2025_1,
      },
      {
        id: 2,
        label: '주제 2',
        posterImage: topic2025_2,
      },
    ],
  },
};

function CampTopicSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const sectionRef = useRef(null);
  const h2Ref = useRef(null);
  const campYear = useSelector(state => state.campTitle.value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            if (h2Ref.current) h2Ref.current.classList.add('animate');
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

  const currentCamp = campYear ? CAMP_DATA[campYear] : null;
  const years = Object.keys(CAMP_DATA).map(Number).sort((a, b) => b - a);

  return (
    <Section ref={sectionRef}>
      <H2 ref={h2Ref}>FIELD CAMP 주제 살펴보기</H2>
      <Dropdown title='FIELD CAMP' titleArr={years} placeholder='선택' />
      {currentCamp && (
        <FigureWrapper>
          {currentCamp.topics.map((topic, index) => (
            <Figure key={topic.id}>
              <Figcaption>{topic.label}</Figcaption>
              <Img
                src={topic.posterImage}
                alt={`${currentCamp.year} FIELD CAMP ${topic.label} 포스터`}
                style={{ cursor: 'pointer' }}
                onClick={() => setPreviewSrc(topic.posterImage)}
              />
            </Figure>
          ))}
        </FigureWrapper>
      )}
      {previewSrc && (
        <PreviewOverlay
          onClick={() => {
            setPreviewSrc(null);
          }}
        >
          <PreviewImage
            src={previewSrc}
            alt='FIELD CAMP 포스터 확대 보기'
            onClick={e => e.stopPropagation()}
          />
        </PreviewOverlay>
      )}
    </Section>
  );
}

export default CampTopicSection;


