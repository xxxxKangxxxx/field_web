import React from 'react';
import styled from 'styled-components';
import DepartmentSection from '../components/About/DepartmentSection';
import ManagerIntro from '../components/About/ManagerIntro';
import TimelineSection from '../components/About/TimelineSection';
import TitleSection from '../components/About/TitleSection';

const AccessibilityHidden = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

function AboutPage() {
  return (
    <>
      <AccessibilityHidden>어바웃 필드</AccessibilityHidden>
      <TitleSection />
      <TimelineSection />
      <ManagerIntro />
      <DepartmentSection />
    </>
  );
}

export default AboutPage;
