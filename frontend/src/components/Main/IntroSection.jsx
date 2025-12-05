import {useRef, useEffect} from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const MainSection = styled.section`
  margin: 0 7.5%;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${theme.media.desktop} {
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

  & > span {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;

    &:nth-child(1) {
      transition-delay: 0.2s;
    }
    &:nth-child(2) {
      transition-delay: 0.4s;
    }

    &.animate {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${theme.media.tablet} {
    margin: 8rem 0 4rem 0;
  }

  ${theme.media.mobile} {
    font-size: 1.5rem;
    margin: 6rem 0 3rem 0;
    gap: 1.5rem;

    & > span {
      transform: translateY(20px);
      
      &.animate {
        transform: translateY(0);
      }
    }
  }

  ${theme.media.desktop} {
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

  ${theme.media.mobile} {
    width: 120px;
  }

  ${theme.media.desktop} {
    width: 160px;
    margin: 2rem 0;
  }
`;

const H2 = styled.h2`
  font-size: 1.7rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;

  ${theme.media.mobile} {
    font-size: 1.5rem;
  }
`;

const GoblinH2 = styled(H2)`
  font-family: 'Goblin One';
  font-size: 1.875rem;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.animate {
    opacity: 1;
    transform: translateY(0);
  }

  ${theme.media.mobile} {
    font-size: 1.625rem;
    transform: translateY(20px);
    
    &.animate {
      transform: translateY(0);
    }
  }

  ${theme.media.desktop} {
    font-size: 2rem;
    margin: 2rem;
  }
`;

function IntroSection() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const h2Ref = useRef(null);
  const h3Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // H2 애니메이션
            if (h2Ref.current) {
              h2Ref.current.classList.add('animate');
            }
            // H3의 span들 애니메이션
            if (h3Ref.current) {
              const spans = h3Ref.current.querySelectorAll('span');
              spans.forEach(span => span.classList.add('animate'));
            }
            // 이미지 애니메이션
            if (imgRef.current) {
              imgRef.current.style.opacity = 1;
            }
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
  }, []);

  return (
    <MainSection ref={sectionRef}>
      <GoblinH2 ref={h2Ref} $margin='5rem 0 2rem 0'>OUR GOAL</GoblinH2>
      <NanumH3 ref={h3Ref}>
        <span>꿈과 비전, 생각을 공유하는</span>
        <span>교류의 장을 만든다</span>
      </NanumH3>
      <Image ref={imgRef} src='fieldLogo.png' alt='필드 로고' $margin='3rem 0 3rem 0' />
    </MainSection>
  );
}

export default IntroSection;
