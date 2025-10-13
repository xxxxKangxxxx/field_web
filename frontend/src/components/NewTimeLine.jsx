import {useEffect, useState} from 'react';
import styled from 'styled-components';
import NewTimeLineContent from './NewTimeLineContent';

const TimelineSection = styled.section`
  margin: 0 7.5%;
  @media (min-width: 1024px) {
    margin: 0 15%;
  }
`;

const Title = styled.h2`
  font-size: 1.875rem;
  margin: 5rem 0 2rem 0;
  font-family: 'Goblin One';
  text-align: center;
`;

const ContentDiv = styled.div`
  width: 100%;
  display: flex;
`;

const SVGDiv = styled.div`
  position: absolute;

  @media (min-width: 1024px) {
    left: calc(50% - 16px);
  }
`;

const TIMELINECONTENT = {
  day1: [
    'Day 1 - 2023.08.09 (수)',
    [
      ['개회식', 'KAIST 산업 및 시스템공학과 김우창 학과장님의 환영인사 및 식순소개를 진행합니다.'],
      [
        '연사초청 1,2부',
        '자율주행로봇 개발 전문기업인 트위니의 천홍석 대표님 강의, 한국과학기술정보연구원(KISTI) 김상국 연구원님 강의가 제공됩니다.',
      ],
      [
        '레크레이션',
        'FIELD 기획부 주최 레크레이션 프로그램은 인적 교류와 친목 증진을 목표로 하며, 일상 벗어나 자유로운 소통과 편안한 분위기를 제공합니다.',
      ],
      [
        'OHT / 레고 AGB 실험실견학',
        'KAIST의 OHT 실험실과 레고 AGV 실험실 견학 프로그램은 산업공학의 실무적 응용을 시각적으로 체험할 수 있는 기회를 제공합니다. ',
      ],
      [
        '컴페티션 자율 준비',
        '팀원과 함께 주어진 주제에 따라 문제를 정의하고, 산업공학 지식을 활용하여 창의적으로 해결책을 도출하며, 전공 역량과 팀워크를 향상시키는 시간을 제공합니다.',
      ],
    ],
  ],
  day2: [
    'Day 2 - 2023.08.10 (목)',
    [
      [
        '컴페티션 예선',
        '20개조로 구성된 참가자들이 각 조에 배정된 주제를 본인들만의 역량을 발휘해 발표를 진행합니다.',
      ],
      [
        '컴페티션 결선',
        'KAIST 교수 등과 모든 참가자들에게 컴페티션 예선에서 진행했던 프로젝트에 더불어 발표를 진행합니다.',
      ],
      [
        '산공인의 밤',
        '전국 산업공학도들의 인적 교류를 위한 자리가 준비되어 정보 교류와 친목도모의 시간을 갖습니다.',
      ],
    ],
  ],

  day3: [
    'Day 3 - 2023.08.11 (금)',
    [
      [
        '시상식 및 폐회식',
        '본인들만의 전공 지식과 역량으로 각 주제별 우수한결과를 도출한 상위 3개 조에 상을 수여하며 FIELDCAMP를 마무리합니다.',
      ],
    ],
  ],
};

export default function NewTimeLine() {
  const [height, setHeight] = useState(0);

  function calcDashoffset(scrollY, element, length) {
    const ratio = (scrollY - element.offsetTop) / element.offsetHeight;
    let value;
    const temp = length - length * ratio;
    if (temp < 0) {
      value = 0;
    } else if (temp > length) {
      value = length;
    } else {
      value = temp;
    }

    return value;
  }

  function scrollHandler(content, path, pathLength) {
    const scrollY = window.scrollY + window.innerHeight * 0.7;
    const offset = calcDashoffset(scrollY, content, pathLength);
    path.style.strokeDashoffset = offset;
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setHeight(1600);
        return 1600;
      }
      setHeight(1500);
      return 1500;
    };

    const content = document.querySelector('.contentDiv');
    const path = document.querySelector('.path');
    if (content && path) {
      const pathLength = handleResize();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;

      window.addEventListener('scroll', () => scrollHandler(content, path, pathLength));
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return (
    <>
      <Title>Time Line</Title>
      <TimelineSection>
        <ContentDiv className='contentDiv'>
          <SVGDiv>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='30'
              height={height}
              fill='none'
              stroke='currentColor'
              strokeWidth='6'
            >
              <path className='path' d={`M 16 10  v${height}`} />
            </svg>
          </SVGDiv>
          <NewTimeLineContent data={TIMELINECONTENT} />
        </ContentDiv>
      </TimelineSection>
    </>
  );
}
