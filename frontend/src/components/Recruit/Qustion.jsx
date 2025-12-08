import {useState} from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import ContentWrapper from './UI/ContentWrapper';

const SubTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-weight: 800;
`;

const Box = styled.button`
  border: none;
  font-family: 'SUIT';
  text-align: left;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.65rem;
  color: ${theme.colors.black};
  width: 100%;
  max-height: ${({$expanded}) => ($expanded === 'true' ? '8rem' : '4rem')};
  transition: max-height 0.5s ease;
  cursor: pointer;
  div img {
    transform: rotate(${({$expanded}) => ($expanded === 'true' ? '0deg' : '180deg')});
    transition: transform 0.3s ease;
  }

  margin: 0 0 1.5rem 0;

  @media (min-width: 768px) {
    padding: 0.5rem 0 0.5rem 0.3rem;
  }
`;

const P = styled.p`
  width: 90%;
  font-size: ${props => (props.$fontSize ? props.$fontSize : '0.75rem')};
  font-weight: ${props => (props.$fontWeight ? props.$fontWeight : '700')};
  margin: 0.5rem 0 0.5rem 0;
  word-break: keep-all;
  text-indent: -1rem;
  padding: 0 0 0 1.5rem;
`;

const DownImg = styled.img`
  margin: 0 0.5rem 0 0;
  width: 2rem;
`;

const QueBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QUSANS = [
  {
    id: 1,
    qes: 'Q. 부서 별 인원 구성은 어떻게 되나요?',
    ans: 'A. 각 부서별로 10명 ~ 15명으로 구성됩니다!  지난 기수의 경우 기획부 10명, 대외협력부 14명, 컴페티션부 12명, 홍보부 10명으로 구성되었습니다.',
  },
  {
    id: 2,
    qes: 'Q. 전체 회의는 어디서 진행하나요?',
    ans: 'A. 수도권 대학교 강의실에서 진행합니다! 작년의 경우 동국대, 홍익대, 숭실대, 한양대 등에서 진행했습니다.',
  },
  {
    id: 3,
    qes: 'Q. FIELD CAMP 컴페티션에 FIELD 멤버도  참여할 수 있나요?',
    ans: 'A. 아니요. FIELD CAMP 기간 동안 FIELD 멤버들은 FIELD CAMP에 참가한 참가자들을 도와주는 스태프 역할을 합니다.',
  },
  {
    id: 4,
    qes: 'Q. 비수도권 거주자나 지방 대학 소속 학생들도 지원가능한가요?',
    ans: 'A. 저희 FIELD는 전국 대학생 산업공학도 모임으로 비수도권 거주자 혹은 지방 대학생이어도 지원 가능합니다.',
  },
  {
    id: 5,
    qes: 'Q. 휴학생/대학원생도 지원 가능 한가요?',
    ans: 'A. 산업공학을 주/복수/부전공하는 대학(원)생이라면 누구나 지원 가능합니다! 휴학생도 신입생도 모두 가능입니다.',
  },
];

function QuestionBox({qes, ans}) {
  const [toggle, setToggle] = useState(false);
  function toggleHandler() {
    setToggle(!toggle);
  }
  return (
    <Box $expanded={toggle.toString()} onClick={() => toggleHandler()}>
      <QueBox>
        <P $fontSize='0.875rem' $fontWeight='900'>
          {qes}
        </P>
        <DownImg src='Expand_down.png' alt='DownArrow' />
      </QueBox>
      {toggle && <P>{ans}</P>}
    </Box>
  );
}

export default function Question() {
  return (
    <ContentWrapper>
      <SubTitle>자주 묻는 질문</SubTitle>
      {QUSANS.map(item => (
        <QuestionBox key={item.id} qes={item.qes} ans={item.ans} />
      ))}
    </ContentWrapper>
  );
}
