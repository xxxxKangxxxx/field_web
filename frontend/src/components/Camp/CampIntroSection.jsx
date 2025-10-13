import React from 'react';
import styled from 'styled-components';
import theme from '../../theme';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  margin: 0 7.5%;
  @media screen and (min-width: 1024px) {
    margin: 0 15%;
  }
`;

const H2 = styled.h2`
  font-size: 1.625rem;
  margin: 6rem 0 2rem 0;
  text-align: center;
  font-family: Nanum Myeongjo;
  font-weight: 800;
`;

const Dl = styled.dl``;

const Dt = styled.dt`
  font-size: 1.25rem;
  margin: 2.5rem 0 1.25rem 0;
  color: ${props => (props.$color ? theme.colors[props.$color] : theme.colors.yellow)};
  font-family: 'SUIT-Heavy';
`;

const Dd = styled.dd`
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
  margin: ${props => props.$margin || '0 0 2.5rem 0'};
`;

function CampIntroSection() {
  return (
    <Section>
      <H2>FIELD CAMP 소개</H2>
      <Dl>
        <Dt $color='red'>FIELD CAMP란</Dt>
        <Dd>
          FIELD CAMP는 대한산업공학회 주최, FIELD 주관의 전국 대학생 산업공학도 학술 및 인적 교류
          캠프로 여름방학 중 2박 3일간 진행됩니다. 지역적 한계로 교류가 어려운 전국의
          산업공학도들에게 인적교류의 장을 제공하고자 하는 목적의 행사입니다.
        </Dd>
        <Dt $color='blue'>산업공학적 문제해결력</Dt>
        <Dd>
          참가자들은 컴페티션 주제를 함께 해결하며 산업공학적인 문제해결력을 높이고, 선배
          산업공학도를 만나 산업공학도로서의 마인드를 배울 수 있는 학술교류를 통해 미래의 리더로
          나아가기 위한 역량을 기를 수 있습니다.
        </Dd>
        <Dt>컴페티션</Dt>
        <Dd $margin='0 0 15rem 0'>
          컴페티션이란 FIELD CAMP의 핵심 행사로서, 전국의 산업공학도들이 함께 모여 제시되는 문제에
          대하여 산업공학적 시각으로 함께 해결하고 겨루는 단기 프로젝트 공모전입니다. 해마다 달리
          주어지는 주제에 맞추어 문제를 정의하고, 산업공학적 지식을 활용하여 참신한 해결방안을
          강구함으로써 선의의 경쟁을 유도하고, 전공 역량과 팀워크를 기를 수 있습니다.
        </Dd>
      </Dl>
    </Section>
  );
}

export default CampIntroSection;
