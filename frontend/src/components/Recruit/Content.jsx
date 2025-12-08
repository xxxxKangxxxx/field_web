import {useEffect, useState} from 'react';
import styled, {keyframes} from 'styled-components';
import theme from '../../theme';
import {LoadDateData} from '../../lib/Apiservice';
import ContentWrapper from './UI/ContentWrapper';

const P = styled.p`
  font-size: ${props => (props.$fontSize ? props.$fontSize : '1rem')};
  color: ${props => (props.$color ? theme.colors[props.$color] : theme.colors.black)};
  font-weight: 700;
  text-align: center;
  margin: ${props => (props.$margin ? props.$margin : '1rem 0')};
  word-break: keep-all;
`;

const ContentBox = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.65rem;
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SubTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  padding: 0 1rem 0 0;
  margin: 0 0 1.5rem 0;
  font-weight: 800;
`;

const OneLine = styled.span`
  display: block;
  margin: 0 0 0.5rem 0;
  text-indent: ${props => (props.$textIndent ? props.$textIndent : '')};
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 0.5rem 0;
`;

const WhiteMessage = styled.img`
  width: 1.5rem;
  margin: 0 0.2rem 0 0.4rem;
`;

const DateP = styled(P)`
  text-align: left;
  display: flex;
  padding: 0 0.5rem 0 0;
  letter-spacing: -2px;
  @media (min-width: 768px) {
    letter-spacing: 0;
  }
`;

const AddressLink = styled.a`
  text-decoration: none;
  color: ${theme.colors.white};
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0.4rem 0 0;
`;
const BoxSize = styled.div`
  margin: 0 auto;
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpin = styled.div`
  margin: 1.5rem auto 1.5rem;
  width: 5rem;
  height: 5rem;
  border: 0.2rem solid transparent;
  border-top-color: ${theme.colors.black};
  border-radius: 50%;
  animation: ${spin} 0.5s linear infinite;
`;

const Emoji = styled.span`
  margin: 0 0.35rem 0 0;
`;

function InfoGroup({subtitle, content}) {
  return (
    <ContentWrapper>
      <SubTitle>{subtitle}</SubTitle>
      <P $fontSize='1.25rem' $color='white' $>
        {content}
      </P>
    </ContentWrapper>
  );
}

function InfoGroupWithBox({subtitle, content}) {
  return (
    <ContentWrapper>
      <SubTitle>{subtitle}</SubTitle>
      <ContentBox>
        <BoxSize>{content}</BoxSize>
      </ContentBox>
    </ContentWrapper>
  );
}

const APPLYMETHOD = (
  <>
    <P $margin='0.5rem 0 0.8rem 0'>
      <OneLine>필드 리틀리 혹은 필드 블로그에서 지원서 </OneLine>
      <OneLine>다운로드 후 서류 작성하여 아래 이메일로 제출</OneLine>
    </P>
    <FlexRow>
      👉
      <WhiteMessage src='MessageWhite.png' alt='하얀색 Messege 아이콘' width={20} />
      <address>
        <AddressLink href='mailto:iefieldcamp24@gmail.com' target='_blank'>
          iefieldcamp26@gmail.com
        </AddressLink>
      </address>
      👈
    </FlexRow>
  </>
);

export default function Content() {
  const [dateData, setDateData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function dateDataLocalStored(scheduleData) {
    const now = new Date();
    localStorage.setItem('모집일정', JSON.stringify(scheduleData));
    localStorage.setItem('모집일정-lastUpdate', now.getTime().toString());
  }

  async function initialSetup() {
    setIsLoading(true);
    try {
      const response = await LoadDateData();
      // response가 null이면 활성 모집이 없는 경우
      if (response) {
      dateDataLocalStored(response);
      setDateData(response);
      } else {
        // 활성 모집이 없을 때는 빈 데이터로 설정
        setDateData(null);
      }
      setIsLoading(false);
    } catch {
      setIsError(true);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const now = new Date();
    const lastUpdate = localStorage.getItem('모집일정-lastUpdate');
    const lastUpdateTime = lastUpdate ? new Date(parseInt(lastUpdate, 10)) : null;
    if (!lastUpdate || now - lastUpdateTime > 60 * 60 * 1000) {
      initialSetup();
    } else {
      const storedData = JSON.parse(localStorage.getItem('모집일정'));
      setDateData(storedData);
    }
  }, []);

  let recruitmentContent;

  if (isError) {
    recruitmentContent = (
      <>
        <P>데이터를 불러오지 못했습니다</P>
        <P>새로고침을 통해 다시 한번 시도해주세요</P>
      </>
    );
  } else if (isLoading) {
    recruitmentContent = <LoadingSpin />;
  } else if (dateData && dateData.schedules && dateData.schedules.length > 0) {
    const formatDate = (date) => date.replace(/-/g, '.');

    // 모집 일정 리스트
    recruitmentContent = (
      <>
        {dateData.schedules.map((schedule, index) => {
          const emojiByType =
            schedule.type === 'application' ? '📄' :
            schedule.type === 'doc_result' ? '✅' :
            schedule.type === 'interview' ? '💬' :
            schedule.type === 'final_result' ? '🏁' :
            '📅';

          const legacyEmoji =
            schedule.title?.includes('서류') ? '📄' :
            schedule.title?.includes('면접') ? '💬' :
            schedule.title?.includes('발표') ? '✅' :
            '📅';

          const emoji = schedule.type ? emojiByType : legacyEmoji;

          let dateText = '';
          if (schedule.startDate) {
            if (schedule.endDate && schedule.endDate !== schedule.startDate) {
              dateText = `${formatDate(schedule.startDate)} ~ ${formatDate(schedule.endDate)}`;
            } else {
              dateText = formatDate(schedule.startDate);
            }
          } else if (schedule.date) {
            // 레거시 데이터용
            dateText = schedule.date;
          }

          return (
            <DateP key={index}>
              <Emoji>{emoji}</Emoji>
              {`${schedule.title}: ${dateText}`}
            </DateP>
          );
        })}
      </>
    );
  } else {
    // dateData가 null이거나 schedules가 없을 때
    recruitmentContent = (
      <P>현재 진행 중인 모집이 없습니다.</P>
    );
  }

  return (
    <>
      <InfoGroup subtitle='😀 지원자격' content='산업공학을 주/복수/부전공하는 대학생' />
      <InfoGroupWithBox subtitle='💎 지원 방법' content={APPLYMETHOD} />
      <InfoGroup subtitle='📚 활동 기간' content='매년 3월 ~ 12월 (10개월)' />
      <InfoGroupWithBox subtitle='📆 모집 일정' content={recruitmentContent} />
    </>
  );
}
