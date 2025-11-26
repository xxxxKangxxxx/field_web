import styled from 'styled-components';
import FieldIntro from './FieldIntro';

const FieldIntro1 = '/FieldIntro1.png';
const FieldIntro2 = '/FieldIntro2.png';
const FieldIntro3 = '/FieldIntro3.png';

const MainSection = styled.section`
  margin: 0 7.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 769px) {
    margin: 10rem 15%;
  }
`;

function FieldIntroSection() {
  return (
    <MainSection>
      <FieldIntro
        title='열정으로 뭉친 산업공학도'
        content='열정 가득한 산업공학도들의 모임인 FIELD는 학술적 활동은 물론 인적 교류에도 항상 열정적으로 참여합니다.'
        backgroundImage={FieldIntro1}
      />
      <FieldIntro
        title='하나 되는 FIELD'
        content='FIELD는 모든 구성원들의 화합을 지향합니다. 이를 통해 FIELD만의 유대감을 형성할 수 있습니다.'
        backgroundImage={FieldIntro2}
      />
      <FieldIntro
        title='오늘보다 더 나은 내일'
        content='내 옆의 동료가 미래에 산업을 이끌어나갈 리더로 함께 성장하기를 바라며 FIELD는 오늘도 더 높은 목표를 향해 나아갑니다.'
        backgroundImage={FieldIntro3}
      />
    </MainSection>
  );
}

export default FieldIntroSection;
