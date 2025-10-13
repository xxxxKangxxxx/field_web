import styled from 'styled-components';
import theme from '../../theme';
import TextGenerator from '../TextGenerator';

const TitleContainer = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 7.5%;
  justify-content: space-around;
  @media screen and (min-width: 1024px) {
    margin: 0 15%;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1280px) {
    flex-direction: row;
    gap: 20px;
  }
`;

const H2 = styled.h2`
  font-size: 1.7rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
`;

const NanumH2 = styled(H2)`
  font-size: 1.5rem;
  font-family: 'Nanum Myeongjo', serif;
  line-height: 1.3;
  word-break: keep-all;
  font-weight: 800;
  @media screen and (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const GoblinH3 = styled.h3`
  word-break: keep-all;
  margin: ${props => props.$margin || '0'};
  line-height: ${props => props.$line || ''};
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: ${props => (props.size ? props.size : '1rem')};
  display: flex;
  flex-direction: column;
  font-weight: ${props => (props.$weight ? props.$weight : '')};
  font-family: 'Goblin One';
  @media screen and (min-width: 1280px) {
    min-width: 50%;
  }
`;

const FirstAlphabet = styled.span`
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  display: inline;
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: ${props => props.$position || ''};
  bottom: 1rem;
  @media (min-width: 1280px) {
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

const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Span = styled.span`
  @media screen and (min-width: 1280px) {
    display: inline;
  }
`;

function TitleSection() {
  return (
    <TitleContainer>
      <NanumH2>전국 대학생 산업공학도 모임</NanumH2>
      <ContentContainer>
        <GoblinH3 size='2rem' $line='1.4'>
          <Span>
            <FirstAlphabet color='red'>F</FirstAlphabet>
            <TextGenerator
              text='u t u r e'
              $margin='0'
              align=''
              size='2rem'
              $weight='100'
              height='0'
              spacing='-6px'
              time='0.1'
            />
          </Span>
          <Span>
            <FirstAlphabet color='yellow'>I</FirstAlphabet>
            <TextGenerator
              text='n d u s t r i a l'
              $margin='0'
              align=''
              size='2rem'
              $weight='100'
              height='0'
              spacing='-6px'
              time='0.1'
            />
          </Span>
          <Span>
            <FirstAlphabet color='yellow'>E</FirstAlphabet>
            <TextGenerator
              text='n g i n e e r i n g'
              $margin='0'
              align=''
              size='2rem'
              $weight='100'
              height='0'
              spacing='-6px'
              time='0.1'
            />
          </Span>
          <Span>
            <FirstAlphabet color='blue'>L</FirstAlphabet>
            <TextGenerator
              text='e a d e r s'
              $margin='0'
              align=''
              size='2rem'
              $weight='100'
              height='0'
              spacing='-6px'
              time='0.1'
            />
          </Span>
          <Span>
            <FirstAlphabet color='blue'>D</FirstAlphabet>
            <TextGenerator
              text='r e a m e r s'
              $margin='0'
              align=''
              size='2rem'
              $weight='100'
              height='0'
              spacing='-6px'
              time='0.1'
            />
          </Span>
        </GoblinH3>

        <TextGenerator
          size='16px'
          $height='1.5'
          $margin='2rem 0 0 0'
          text="FIELD란, ‘Future Industrial Engineering Leaders and Dreamers’ 의 약자로, 미래의 핵심
          리더들이 될 산업공학도들이 모여 서로의 꿈과 비전, 생각 등을 공유할 수 있는 교류의 장을
          만든다는 목표 아래 모인 '전국 대학생 산업공학도 모임' 입니다."
          $desktopSize='0.8rem'
          time='0.03'
          $justify='end'
          $desktopAlign='left'
          align='left'
        />
      </ContentContainer>
      <FlexCenter>
        <Figure $position='absolute'>
          <Icon src='transfer-down-light.svg' />
          <IconFigcaption>아래로 스크롤하세요</IconFigcaption>
        </Figure>
      </FlexCenter>
    </TitleContainer>
  );
}

export default TitleSection;
