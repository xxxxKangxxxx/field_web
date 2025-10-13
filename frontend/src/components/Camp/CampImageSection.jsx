import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import TextGenerator from '../TextGenerator';

const Section = styled.section`
  height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;

  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
    url(${props => props.src});
  background-position: center;
  background-size: ${props => (props.size ? props.size : 'cover')};
  background-repeat: no-repeat;
  @media screen and (max-width: 1024px) {
    justify-content: center;
  }
  @media screen and (min-width: 1024px) {
    justify-content: space-evenly;
    position: relative;
    flex: 1;
    width: 1/3;
  }
`;

const H2 = styled.h2`
  font-size: 1.5625rem;
  color: white;
  text-align: center;
  font-family: 'Goblin One';
  font-weight: bold;
  line-height: 2rem;
  position: relative;
  width: 100%;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  @media screen and (min-width: 1024px) {
    position: absolute;
    font-size: 30px;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
  }
`;

const P = styled.p`
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  color: white;
  text-align: center;
  letter-spacing: -0.1em;
  font-weight: bold;
  @media screen and (min-width: 1024px) {
    font-size: 25px;
  }
`;

const Span = styled.span`
  margin: 0 0 1rem 0;
`;

function CampImageSection({img, title, firstLine = '', secondLine = '', thirdLine = ''}) {
  const h2Ref = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [fontSize, setFontSize] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      });
    });

    if (h2Ref.current) {
      observer.observe(h2Ref.current);
    }

    return () => {
      if (h2Ref.current) {
        observer.unobserve(h2Ref.current);
      }
    };
  }, []);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setFontSize('30px');
    } else {
      setFontSize('25px');
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Section src={img}>
      <H2 ref={h2Ref}>{animate && <TextGenerator text={title} size={fontSize} />}</H2>
      <P>
        <Span>{firstLine}</Span>
        <Span>{secondLine}</Span>
        <Span>{thirdLine}</Span>
      </P>
    </Section>
  );
}

export default CampImageSection;
