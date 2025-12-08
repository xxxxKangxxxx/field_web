import styled from 'styled-components';
import TimelineDetail from './TimelineDetail';

const Container = styled.div`
  width: 95%;
  padding: 50px 0;
  position: relative;
  margin: 50px auto;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    background: #f5f7fa;
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
`;

const MainSection = styled.section`
  position: relative;
  background: #050608;
  padding: 80px 0;

  /* 위·아래로 살짝 퍼지는 빛나는 라인 효과 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.95) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    box-shadow: 0 0 18px rgba(255, 255, 255, 0.7);
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  @media screen and (min-width: 1280px) {
    margin: 0 15%;
  }
`;

function TimelineSection() {
  return (
    <MainSection>
      <GoblinH2 $margin='5rem 0'>Road of FIELD</GoblinH2>
      <Container>
        <TimelineDetail
          float='right'
          direction='ltr'
          firstTitle='FIELD의 시작'
          year='2008'
          description='2008년 필드는 3개의 학교 (서울대학교, KAIST, POSTECH)에서 첫 학술 및 인적 교류를
            시작했습니다.'
        />

        <TimelineDetail
          float='left'
          direction='rtl'
          firstTitle='첫 FIELD CAMP 개최'
          year='2009'
          description='고려대학교, 연세대학교 참여시작 매년 동부 인재 개발원의 후원을 받아 캠프 주최 및 참여,
            자체 세미나 진행, FIELD SNS 생성'
        />

        <TimelineDetail
          float='right'
          direction='ltr'
          firstTitle='대한산업공학회'
          secondTitle='산하 공식 단체 인준'
          year='2016'
          description='전국 대학교를 대상으로 모든 산업공학도의 캠프 주최 및 참여'
        />

        <TimelineDetail
          float='left'
          direction='rtl'
          firstTitle='전국 단위 활동'
          year='2017'
          description='전국 단위 FIELD 활동 및 삼성 SDS 시연회에 FIELD STAFF로 참가'
        />

        <TimelineDetail
          float='right'
          direction='ltr'
          firstTitle='고교 방문 설명회 진행'
          year='2018'
          description='고등학생들을 대상으로 한 멘토링 진행'
        />

        <TimelineDetail
          float='left'
          direction='rtl'
          firstTitle='FIELD 유튜브 개설'
          year='2022'
          description='FIELD 유튜브 계정 개설 및 산업공학 관련 영상 제작'
        />
      </Container>
    </MainSection>
  );
}

export default TimelineSection;
