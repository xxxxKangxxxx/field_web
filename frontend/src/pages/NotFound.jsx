import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import theme from '../theme';

const PageSection = styled.section`
  height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;

  ${theme.media.desktop} {
    height: calc(100vh - 134px);
  }
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 900;
  text-align: center;
  margin: 0 0 2rem 0;
`;

const P = styled.p`
  margin: 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin: 3rem 0 0 0;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  font-size: 0.9rem;
  font-weight: 700;
  width: 6.5rem;
  height: 2rem;
  appearance: none;
  border: none;
  border-radius: 1.5rem;
  border: 1px solid white;
  background: ${theme.colors.black};
  color: ${theme.colors.white};
  margin: 0rem 0.5rem;
  &: hover {
    cursor: pointer;
  }
`;

const Img = styled.img`
  margin: 4rem auto;
  width: 5rem;
`;

function ButtonContanier() {
  const navigate = useNavigate();

  function clickHandler(destination) {
    navigate(destination);
  }
  return (
    <ButtonWrapper>
      <Button onClick={() => clickHandler(-1)}>이전</Button>
      <Button onClick={() => clickHandler('/')}>홈</Button>
    </ButtonWrapper>
  );
}

export default function NotFound() {
  return (
    <PageSection>
      <Img src='Notice.png' alt='느낌표!!' />
      <Title>페이지를 찾을 수 없습니다.</Title>
      <P>요청한 페이지를 찾을 수 없습니다.</P>
      <P>서비스 이용에 불편을 드려 죄송합니다.</P>
      <ButtonContanier />
    </PageSection>
  );
}
