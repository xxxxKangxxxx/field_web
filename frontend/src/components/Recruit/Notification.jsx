import { useEffect, useState } from 'react';
import styled from 'styled-components';
import theme from '../../theme';
import { LoadDateData } from '../../lib/Apiservice';

const P = styled.p`
  font-size: ${props => (props.$fontSize ? props.$fontSize : '1rem')};
  color: ${theme.colors.white};
  font-weight: ${props => (props.$fontWeight ? props.$fontWeight : 300)};
  text-align: center;
  margin: ${props => (props.$margin ? props.$margin : '0.75rem 0')};
`;

const Banner = styled.div`
  max-width: 640px;
  margin: 8rem auto 0;
  padding: 1.75rem 2.5rem;
  border-radius: 1.25rem;
  border: 1px solid
    ${({ active }) =>
      active ? 'rgba(255, 213, 79, 0.85)' : 'rgba(255, 255, 255, 0.12)'};
  background: ${({ active }) =>
    active
      ? 'linear-gradient(135deg, rgba(255,213,79,0.22), rgba(255,255,255,0.05))'
      : 'rgba(255, 255, 255, 0.06)'};
  box-shadow: ${({ active }) =>
    active ? '0 0 26px rgba(255, 213, 79, 0.55)' : 'none'};
  backdrop-filter: blur(14px);
  transition: all 0.3s ease;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${theme.colors.yellow};
  color: #000;
  margin-bottom: 0.5rem;
`;

export default function Notification() {
  const [hasActiveRecruit, setHasActiveRecruit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkActiveRecruit = async () => {
      setIsLoading(true);
      try {
        const response = await LoadDateData();
        // 활성 모집이 있으면 response에 데이터가 옴 (null이면 없음)
        setHasActiveRecruit(!!response);
      } catch {
        setHasActiveRecruit(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkActiveRecruit();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Banner active={hasActiveRecruit}>
      {hasActiveRecruit ? (
        <>
          <Badge>모집 중</Badge>
          <P $fontSize='1.5rem' $fontWeight='600'>
            지금 필드 신규 멤버를 모집 중입니다.
          </P>
          <P>아래에서 자세한 모집 일정을 확인하고 지원해주세요.</P>
        </>
      ) : (
        <>
          <P $fontSize='1.5rem' $fontWeight='600'>
            지금은 모집기간이 아닙니다.
          </P>
          <P>필드는 매년 1월에 새로운 멤버를 모집합니다.</P>
        </>
      )}
    </Banner>
  );
}
