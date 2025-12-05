import styled from 'styled-components';
import DepartmentIntro from './DepartmentIntro';

const MainSection = styled.section`
  margin: 7.5%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1280px) {
    margin: 0 15%;
  }
`;

function DepartmentSection({ selectedDepartment, setSelectedDepartment }) {
  return (
    <MainSection>
      <DepartmentIntro 
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
      />
    </MainSection>
  );
}

export default DepartmentSection;
