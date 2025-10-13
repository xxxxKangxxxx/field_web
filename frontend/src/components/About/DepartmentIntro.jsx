import React, {useState, useRef, useEffect} from 'react';
import styled, {keyframes} from 'styled-components';
import theme from '../../theme';

const H2 = styled.h2`
  font-size: 1.875rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
`;

const NanumH2 = styled(H2)`
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 700;
  @media screen and (min-width: 1280px) {
    margin: 2rem 0;
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  margin: ${props => props.$margin || '0'};
  @media screen and (min-width: 1280px) {
    width: 56%;
    padding: 0;
    margin: 0;
  }
`;

const Dt = styled.dt`
  font-size: 1.5625rem;
  font-weight: 900;
  @media screen and (min-width: 1280px) {
    font-size: 1.5rem;
  }
`;

const Dd = styled.dd`
  font-size: 1rem;
  word-break: keep-all;
  line-height: 1.2;
  margin: 0.5rem 0 1.1rem 0;
`;

const Dl = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
  @media screen and (min-width: 1280px) {
    margin: 0;
  }
`;

const CardUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @media screen and (min-width: 1280px) {
    gap: 1rem;
  }
`;

const CardKeyWordLi = styled.li`
  padding: 0;
  margin: ${props => props.$margin || '0'};
  @media screen and (min-width: 1280px) {
    margin: ${props => props.$desktopMargin || ''};
  }
`;

const wobble = keyframes`
0% { transform: translateX(0%); }
  15% { transform: translateX(-5%) rotate(-1deg); }
  45% { transform: translateX(3%) rotate(3deg); }
  60% { transform: translateX(-2%) rotate(-2deg); }
  100% { transform: translateX(0%); }
`;

const underlineAnimation = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: calc(100% - 10px);
  }
`;

const CardKeyWordSpan = styled.span`
  display: inline-block;
  padding: 0.8rem 1.0rem;
  border-radius: 1.25rem;
  background: ${props => `rgba(${props.color}, 0.2)`};
  color: ${props => `rgb(${props.color})`};
  font-size: 0.9rem;
  font-weight: 600;
  animation: ${wobble} 1s ease;
  white-space: nowrap;
`;

const CardHashTagUl = styled.ul`
  margin: ${props => props.$margin || '0'};
  display: flex;
  flex-direction: column;
  color: ${theme.colors.yellow};
  gap: 0.5rem;
  font-weight: bold;
  @media screen and (min-width: 1280px) {
    flex-direction: row;
    gap: 0.2rem;
    margin: 0;
  }
`;

const CardHashTagLi = styled.li`
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.yellow};
`;

const ActivityUl = styled.ul`
  display: flex;
  flex-direction: column;
  margin: ${props => props.$margin || '0'};
  gap: 0.5rem;
  border: 2px solid white;
  border-radius: 1rem;
  padding: 1rem 0.3rem 1rem 1.3rem;
  text-indent: -0.8rem;
  word-break: keep-all;
  flex-grow: 1;
  margin-top: 1rem;
  @media screen and (min-width: 1280px) {
    height: 250px;
    gap: 1.2rem;
    margin: 1rem 0 0 0;
    padding: 2rem 0.3rem 2rem 1.3rem;
    display: flex;
    justify-content: center;
  }
`;

const ActivityLi = styled.li`
  font-size: 0.9rem;
  @media screen and (min-width: 1280px) {
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  background-color: black;
  color: white;
  cursor: pointer;
  width: 25%;
  border: none;
  padding: 0.375rem 0;
  border-radius: 1rem;
  font-size: 0.8rem;

  ${props =>
    props.$isActive &&
    `
    background-color: ${theme.colors.gray};
    color: white;
  `}
  @media screen and (min-width: 1280px) {
    font-size: 1rem;
    width: 25%;
  }
`;

const ButtonWrapper = styled.div`
  margin: 2rem 0 0 0;
  @media screen and (min-width: 1280px) {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }
`;

const H3 = styled.h3`
  align-items: center;
  font-size: 1.25rem;
  text-align: center;
  border: 2px solid white;
  margin: ${props => props.$margin || '0'};
  border-radius: 1rem;
  padding: 1.5rem 0;
  overflow: hidden;
  height: 120px;
  display: flex;
  justify-content: center;
`;

const CardContainer = styled.div`
  display: ${props => (props.$visible ? 'block' : 'none')};
  @media screen and (min-width: 1280px) {
    margin: 3rem 0;
  }
`;

const FlexCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  padding: 0.5rem 0;
`;

const TitleWrapper = styled.div`
  display: inline-block;
`;

const FlexRow = styled.div`
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 4%;
    height: 400px;
  }
`;

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  @media screen and (min-width: 1280px) {
    width: 380px;
  }
`;

const Span = styled.span`
  @media screen and (min-width: 1280px) {
    font-size: 1.1rem;
  }
  
  &.title {
    font-size: 1.15rem;
    font-weight: 700;
    color: ${props => props.theme.colors.yellow};
    position: relative;
    margin-top: -0.3rem;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 0;
      height: 2px;
      background-color: ${props => props.theme.colors.yellow};
      animation: ${underlineAnimation} 1s ease forwards;
    }
  }

  &.department {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: -0.3rem;
  }
`;

function DepartmentIntro() {
  const [selectCategory, setSelectCategory] = useState('기획부');
  const category = ['기획부', '대외협력부', '컴페티션부', '홍보부'];
  const [animate, setAnimate] = useState(false);
  const cardRef = useRef(null);
  const handleButtonClick = item => {
    setSelectCategory(item);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      });
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  return (
    <>
      <NanumH2 $margin='3rem 0'>부서소개</NanumH2>
      <ButtonWrapper>
        {category.map(item => (
          <Button
            key={item}
            $isActive={selectCategory === item}
            onClick={() => handleButtonClick(item)}
          >
            {item}
          </Button>
        ))}
      </ButtonWrapper>

      <CardContainer $visible={selectCategory === '기획부'}>
        <FlexRow>
          <Card $margin='1rem 0' ref={cardRef}>
            <Dl>
              <Dt>기획부</Dt>
              <Dd>
                FIELD 인적, 학술적 교류를 활성화하기 위한 컨텐츠를 기획하고 진행, 총괄하는 부서
              </Dd>
            </Dl>
            <CardUl>
              <CardKeyWordLi $margin='0 0 0 35%' $desktopMargin='0 0 0 50%'>
                {animate && <CardKeyWordSpan color='255, 188, 19'>대인관계능력</CardKeyWordSpan>}
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 5%'>
                {animate && <CardKeyWordSpan color='245, 215, 57'>리더십</CardKeyWordSpan>}
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 35%'>
                {animate && <CardKeyWordSpan color='255, 134, 46'>창의력</CardKeyWordSpan>}
              </CardKeyWordLi>
            </CardUl>
            <CardHashTagUl $margin='2rem 0'>
              <CardHashTagLi>#FIELD인싸</CardHashTagLi>
              <CardHashTagLi>#FIELD에너지</CardHashTagLi>
              <CardHashTagLi>#즐거움이공존하는이곳</CardHashTagLi>
            </CardHashTagUl>
          </Card>
          <ActivityContainer>
            <H3>
              <FlexCenter>
                <TitleWrapper>
                  <Span className="title">What&apos;s Activity</Span>
                </TitleWrapper>
                <Span className="department">Planning Department</Span>
              </FlexCenter>
            </H3>
            <ActivityUl $margin='1rem 0'>
              <ActivityLi>- FIELD 유튜브 콘텐츠 기획 및 촬영</ActivityLi>
              <ActivityLi>- FIELD CAMP 레크레이션</ActivityLi>
              <ActivityLi>- 산공인의 밤 기획 및 총괄</ActivityLi>
              <ActivityLi>- FIELD 내의 인적 교류를 위한 콘텐츠 기획</ActivityLi>
            </ActivityUl>
          </ActivityContainer>
        </FlexRow>
      </CardContainer>

      <CardContainer $visible={selectCategory === '대외협력부'}>
        <FlexRow>
          <Card $margin='1rem 0'>
            <Dl>
              <Dt>대외협력부</Dt>
              <Dd>
                FIELD 내부와 외부의 교류를 담당하며 전반적인 활동에 필요한 인적, 물적 자원 관리를
                하는 부서
              </Dd>
            </Dl>
            <CardUl>
              <CardKeyWordLi $margin='0 0 0 5%'>
                <CardKeyWordSpan color='19, 99, 255'>말하기능력</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 50%' $desktopMargin='0 0 0 60%'>
                <CardKeyWordSpan color='99, 202, 247'>소통능력</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 15%' $desktopMargin='0 0 0 25%'>
                <CardKeyWordSpan color='30, 154, 244'>친화력</CardKeyWordSpan>
              </CardKeyWordLi>
            </CardUl>
            <CardHashTagUl $margin='2rem 0'>
              <CardHashTagLi>#FIELD연결고리</CardHashTagLi>
              <CardHashTagLi>#FIELD의심장</CardHashTagLi>
              <CardHashTagLi>#소통과화합이중시되는곳</CardHashTagLi>
            </CardHashTagUl>
          </Card>
          <ActivityContainer>
            <H3>
              <FlexCenter>
                <TitleWrapper>
                  <Span className="title">What&apos;s Activity</Span>
                </TitleWrapper>
                <Span className="department">External Cooperation Department</Span>
              </FlexCenter>
            </H3>
            <ActivityUl $margin='2rem 0'>
              <ActivityLi>- 기업 컨텍 및 대외업무 총괄</ActivityLi>
              <ActivityLi>- 고교 산업공학과 진로지도 강연</ActivityLi>
              <ActivityLi>- 산업공학과 출신 기업인 인터뷰</ActivityLi>
              <ActivityLi>- FIELD CAMP 인적 관리 및 조별 스태프 업무 수행</ActivityLi>
            </ActivityUl>
          </ActivityContainer>
        </FlexRow>
      </CardContainer>

      <CardContainer $visible={selectCategory === '컴페티션부'}>
        <FlexRow>
          <Card $margin='1rem 0'>
            <Dl>
              <Dt>컴페티션부</Dt>
              <Dd>
                FIELD 내 진행하는 학술교류에 관한 업무와 FIELD CAMP 컴페티션에 대한 자료와
                평가기준을 만드는 부서
              </Dd>
            </Dl>
            <CardUl>
              <CardKeyWordLi $margin='0 0 0 55%'>
                <CardKeyWordSpan color='192, 255, 162'>봉사심</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 5%'>
                <CardKeyWordSpan color='42, 284, 108'>열정</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 30%'>
                <CardKeyWordSpan color='30, 244, 52'>자기주장력</CardKeyWordSpan>
              </CardKeyWordLi>
            </CardUl>
            <CardHashTagUl $margin='2rem 0'>
              <CardHashTagLi>#FIELD열정맨</CardHashTagLi>
              <CardHashTagLi>#FIELD브레인</CardHashTagLi>
              <CardHashTagLi>#지식과열정이융합되는곳</CardHashTagLi>
            </CardHashTagUl>
          </Card>
          <ActivityContainer>
            <H3>
              <FlexCenter>
                <TitleWrapper>
                  <Span className="title">What&apos;s Activity</Span>
                </TitleWrapper>
                <Span className="department">Competition Department</Span>
              </FlexCenter>
            </H3>
            <ActivityUl $margin='2rem 0'>
              <ActivityLi>- FIELD 전체 회의 세미나</ActivityLi>
              <ActivityLi>- FIELD 스터디 주관</ActivityLi>
              <ActivityLi>- FIELD 내,외부 학술 교류</ActivityLi>
              <ActivityLi>- FIELD CAMP 컴페티션 주제 선정</ActivityLi>
              <ActivityLi>- FIELD CAMP 컴페티션 심사</ActivityLi>
            </ActivityUl>
          </ActivityContainer>
        </FlexRow>
      </CardContainer>

      <CardContainer $visible={selectCategory === '홍보부'}>
        <FlexRow>
          <Card $margin='1rem 0'>
            <Dl>
              <Dt>홍보부</Dt>
              <Dd>FIELD와 산업공학을 알리는 전반적인 홍보물을 기획하고 제작하는 부서</Dd>
            </Dl>
            <CardUl>
              <CardKeyWordLi $margin='0 0 0 5%'>
                <CardKeyWordSpan color='180, 19, 255'>팀워크</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 60%'>
                <CardKeyWordSpan color='244, 99, 247'>열정</CardKeyWordSpan>
              </CardKeyWordLi>
              <CardKeyWordLi $margin='0 0 0 25%'>
                <CardKeyWordSpan color='251, 76, 139'>창의성</CardKeyWordSpan>
              </CardKeyWordLi>
            </CardUl>
            <CardHashTagUl $margin='2rem 0'>
              <CardHashTagLi>#FIELD알리미</CardHashTagLi>
              <CardHashTagLi>#FIELD소통창구</CardHashTagLi>
              <CardHashTagLi>#창의와개성이표출되는곳</CardHashTagLi>
            </CardHashTagUl>
          </Card>
          <ActivityContainer>
            <H3>
              <FlexCenter>
                <TitleWrapper>
                  <Span className="title">What&apos;s Activity</Span>
                </TitleWrapper>
                <Span className="department">Public Relation Department</Span>
              </FlexCenter>
            </H3>
            <ActivityUl $margin='2rem 0'>
              <ActivityLi>- FIELD 홍보 카드뉴스 제작</ActivityLi>
              <ActivityLi>- 산업공학 홍보 카드뉴스 제작</ActivityLi>
              <ActivityLi>- FIELD CAMP 홍보물 제작</ActivityLi>
              <ActivityLi>- FIELD 활동 촬영</ActivityLi>
              <ActivityLi>- FIELD 활동기록 책자 제작</ActivityLi>
            </ActivityUl>
          </ActivityContainer>
        </FlexRow>
      </CardContainer>
    </>
  );
}

export default DepartmentIntro;
