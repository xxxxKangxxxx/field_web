import styled from 'styled-components';
import theme from '../../theme';

const P = styled.p`
  font-size: ${props => (props.$fontSize ? props.$fontSize : '1rem')};
  color: ${theme.colors.white};
  font-weight: ${props => (props.$fontWeight ? props.$fontWeight : 300)};
  text-align: center;
  margin: ${props => (props.$margin ? props.$margin : '1rem 0')};
`;

export default function Notification() {
  return (
    <>
      <P $fontSize='1.5rem' $fontWeight='600' $margin='10rem 0 4rem 0'>
        지금은 모집기간이 아닙니다.
      </P>
      <P>필드는 매년 1월에 새로운 멤버를 모집합니다.</P>
    </>
  );
}
