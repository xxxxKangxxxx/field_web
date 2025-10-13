import React from 'react';
import styled from 'styled-components';
import CampMainSection from '../components/Camp/CampMainSection';
import CampIntroSection from '../components/Camp/CampIntroSection';
import CampImageSection from '../components/Camp/CampImageSection';
import CampTopicSection from '../components/Camp/CampTopicSection';
import CampTimeLine from '../components/Camp/CampTimeLine';

const ImgSectionWrapper = styled.div`
  @media screen and (min-width: 1280px) {
    display: flex;
  }
`;

function CampPage() {
  return (
    <main>
      <CampMainSection />
      <CampIntroSection />
      <ImgSectionWrapper>
        <CampImageSection
          title='ON/OFF blended'
          img='camp2.webp'
          firstLine='사전 데모데이를 통해'
          secondLine='팀원들과 교류할 수 있는'
          thirdLine='기회를 제공합니다.'
        />
        <CampImageSection
          title='Various Program'
          img='camp3.webp'
          firstLine='다양한 인적, 학술적 교류 활성화'
          secondLine='프로그램을 진행합니다.'
        />
        <CampImageSection
          title='Connection with Specialist'
          img='camp4.webp'
          firstLine='산업공학과 출신 기업인,'
          secondLine='교수님과 소통하세요.'
        />
      </ImgSectionWrapper>
      <CampTopicSection />
      <CampTimeLine />
    </main>
  );
}

export default CampPage;
