import styled from 'styled-components';
import TextGenerator from '../TextGenerator';

const TitleContainer = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  @media screen and (min-width: 1024px) {
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
  @media screen and (min-width: 1024px) {
    display: none;
  }
`;

const Icon = styled.img`
  width: 1.875rem;
  height: 1.875rem;
  order: 2;
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
