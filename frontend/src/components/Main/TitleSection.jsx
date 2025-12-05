import styled, {keyframes} from 'styled-components';
import theme from '../../theme';
import TextGenerator from '../TextGenerator';

const TitleContainer = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;

  ${theme.media.desktop} {
    font-size: 3.125rem;
    margin: 0 15%;
  }
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: ${props => props.$position || ''};
  bottom: 1rem;

  ${theme.media.desktop} {
    display: none;
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const Icon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  order: 2;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const IconFigcaption = styled.figcaption`
  font-size: 0.625rem;
`;

function TitleSection() {
  return (
    <TitleContainer>
      <TextGenerator
        text="Let's Lead The Industry"
        $fontFamily='Goblin One, cursive'
        spacing='0'
        $desktopSize='2rem'
      />
      <TextGenerator
        text='To A Broader FIELD'
        $fontFamily='Goblin One, cursive'
        spacing='0'
        $desktopSize='2rem'
      />
      <Figure $position='absolute'>
        <Icon src='transfer-down-light.svg' />
        <IconFigcaption>아래로 스크롤하세요</IconFigcaption>
      </Figure>
    </TitleContainer>
  );
}

export default TitleSection;
