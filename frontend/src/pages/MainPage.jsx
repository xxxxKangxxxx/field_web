import styled from 'styled-components';
import TitleSection from '../components/Main/TitleSection';
import IntroSection from '../components/Main/IntroSection';
import FieldIntroSection from '../components/Main/FieldIntroSection';
import ActivitySection from '../components/Main/ActivitySection';
import ReviewSection from '../components/Main/ReviewSection';

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

function MainPage() {
  return (
    <>
      <AccessibilityHidden>메인페이지</AccessibilityHidden>
      <TitleSection />
      <IntroSection />
      <FieldIntroSection />
      <ActivitySection />
      <ReviewSection />
    </>
  );
}

export default MainPage;
