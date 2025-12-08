import {useState} from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import ContentWrapper from './UI/ContentWrapper';

const SubTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin: 0 0 1rem 0;
  font-weight: 800;
`;

const QuestionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.65rem;
  color: ${theme.colors.black};
  margin: 0 0 2rem 0;
  font-weight: 400;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0 0.5rem 0;
  @media (min-width: 768px) {
    padding: 0 0 0.5rem 5%;
  }
`;

const Question = styled.h3`
  font-size: 1.2rem;
  letter-spacing: -0.05rem;
  font-weight: 900;
  margin: 0 0 0.8rem 0;
  width: 100%;
  padding: 1rem 0 0 7.5%;
`;

const Answer = styled.li`
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  margin: 1rem 0 1rem 0.1rem;
  word-break: keep-all;
  letter-spacing: -0.05rem;
  padding: 0 5% 0 6%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 0.5rem 0 1rem 0;
  width: 100%;
  max-width: 500px;

  ${props =>
    props.$activelink &&
    `button[name="${props.$activelink}"]{
    background: ${theme.colors.gray};

  }
`}

  @media (min-width: 768px) {
    max-width: 600px;
  }
`;

const DepartmentButton = styled.button`
  font-family: 'SUIT';
  padding: 0.3rem 0.6rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  appearance: none;
  border: none;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  font-weight: 600;
  cursor: pointer;

  @media (min-width: 768px) {
    padding: 0.5rem 1.3rem;
  }
`;

const Number = styled.span`
  display: inline-block;
  width: 0.7rem;
  padding: 0 0.2rem 0 0;
`;

const DEPARTMENTINFO = {
  planning: {
    department: '기획부',
    explain: [
      '타인과 소통하며 협업 하기를 원하는 분!',
      '인적, 학술적 교류 활성화를 중요시 하는 분!',
      '컨텐츠 제작 및 기획에 관심이 많으신 분!',
      '리더십있고 창의력이 넘치시는 분!',
    ],
    activity: [
      '인적, 학술적 콘텐츠 기획 및 진행',
      'FIELD 유튜브 콘텐츠 기획 및 촬영',
      'FIELD CAMP 레크레이션 및 산공인의 밤을 기획',
    ],
  },
  external: {
    department: '대외협력부',
    explain: [
      '커뮤네케이션 및 협업 능력이 투철하신 분!',
      '유연성과 적응력이 뛰어나신 분!',
      '항상 적극적인 자세가 갖춰져 있는 분!',
      '자기 효능감이 뛰어나신 분!',
    ],
    activity: [
      '고교 산업공학과 진로지도 강연',
      '산업공학과 출신 기업인 인터뷰',
      'FIELD CAMP 인적 관리 및 기업 컨택',
    ],
  },
  competition: {
    department: '컴페티션부',
    explain: [
      'FIELD 활동에 대한 의지가 강하신 분!',
      '학술적 정보 제공을 중요시 하는 분!',
      '세미나를 직접 기획하고 발표한 경험이 있는 분!',
      '자기 주장력이 강하고 봉사심이 투철하신 분!',
    ],
    activity: [
      'FIELD 세미나 및 학술 교류 주관',
      'FIELD CAMP 컴페티션 주제 선정',
      'FIELD CAMP 컴페티션 자료, 평가 기준 제작',
    ],
  },
  relation: {
    department: '홍보부',
    explain: [
      '부서 활동에 열정을 보여줄 수 있는 분!',
      '팀워크를 중요시하는 분!',
      '필드와 트렌드를 만들고 싶은 분!',
      '산업공학 홍보에 관심이 많으신 분!',
    ],
    activity: [
      '산업공학과 및 FIELD 홍보 카드뉴스 제작',
      'FIELD 활동 책자 및 신문 제작',
      'FIELD CAMP 홍보물 제작 및 홍보',
    ],
  },
};

function DepartmentBox({part, p, target}) {
  return (
    <QuestionBox>
      <Question>{`${DEPARTMENTINFO[part].department}${p}`}</Question>
      <ul>
        {DEPARTMENTINFO[part][target].map((item, index) => (
          <Answer key={item}>
            <Number>{`${index + 1}.`}</Number>
            {item}
          </Answer>
        ))}
      </ul>
    </QuestionBox>
  );
}

export default function Department() {
  const [selectedDepartment, setSelectedDepartment] = useState('planning');
  function DepartmentHandler(name) {
    setSelectedDepartment(name);
  }
  return (
    <ContentWrapper $margin='5rem 0'>
      <SubTitle>모집 분야</SubTitle>
      <ButtonWrapper $activelink={selectedDepartment}>
        {Object.keys(DEPARTMENTINFO).map(item => (
          <DepartmentButton key={item} name={item} onClick={() => DepartmentHandler(item)}>
            {DEPARTMENTINFO[item].department}
          </DepartmentButton>
        ))}
      </ButtonWrapper>
      <DepartmentBox part={selectedDepartment} p='는 어떤 인재를 원하나요' target='explain' />
      <DepartmentBox part={selectedDepartment} p='는 어떤 활동을 하나요' target='activity' />
    </ContentWrapper>
  );
}
