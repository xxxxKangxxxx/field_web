import {useRef, useEffect} from 'react';
import styled from 'styled-components';

const MainSection = styled.section`
  margin: 0 7.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 1024px) {
    margin: 0 15%;
  }
`;

const H3 = styled.h3`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.5rem;
  margin: ${props => props.$margin || '0'};
`;

const NanumH3 = styled(H3)`
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 700;
  gap: 2rem;
  font-size: 1.625rem;
  margin: 10rem 0 5rem 0;
  @media screen and (min-width: 1024px) {
    font-size: 2rem;
    margin: 5rem 0 3rem 0;
  }
`;

const Image = styled.img`
  margin: ${props => props.$margin || '0'};
  width: 140px;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${props => props.radius || ''};
  opacity: 0;
  transition: 3s;
  @media screen and (min-width: 1024px) {
    width: 160px;
    margin: 2rem 0;
  }
`;

const H2 = styled.h2`
  font-size: 1.7rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
`;

const GoblinH2 = styled(H2)`
  font-family: 'Goblin One';
  font-size: 1.875rem;
  @media screen and (min-width: 1024px) {
    font-size: 2rem;
    margin: 2rem;
  }
`;

function IntroSection() {
  const imgRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);
  return (
    <MainSection>
      <GoblinH2 $margin='5rem 0 2rem 0'>OUR GOAL</GoblinH2>
      <NanumH3>
        <span>꿈과 비전, 생각을 공유하는</span>
        <span>교류의 장을 만든다</span>
      </NanumH3>
      <Image ref={imgRef} src='fieldLogo.png' alt='필드 로고' $margin='3rem 0 3rem 0' />
    </MainSection>
  );
}

export default IntroSection;
