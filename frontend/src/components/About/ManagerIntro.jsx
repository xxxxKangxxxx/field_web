import React from 'react';
import styled from 'styled-components';

// 프로필 이미지 import
import leaderImg from '../../assets/profiles/leader.png';

const MainSection = styled.section`
  margin: 7.5%;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 1280px) {
    margin: 0 15%;
  }
`;

const H2 = styled.h2`
  font-size: 1.7rem;
  margin: ${props => props.$margin || '0'};
  text-align: center;
`;

const NanumH2 = styled(H2)`
  font-size: 1.625rem;
  font-family: 'Nanum Myeongjo', serif;
  line-height: 1.3;
  word-break: keep-all;
  display: flex;
  font-weight: 600;
  flex-direction: column;
`;

const Ul = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: ${props => props.$gap || '2rem'};
  margin: ${props => props.$margin || '0'};
  @media screen and (min-width: 1280px) {
    margin: ${props => props.$desktopMargin || ''};
  }
`;

const Li = styled.li`
  width: 40%;
  @media screen and (min-width: 1280px) {
    width: 20%;
  }
`;

const Image = styled.img`
  margin: ${props => props.$margin || '0'};
  width: 120px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  @media screen and (min-width: 1280px) {
    width: 220px;
    height: 250px;
  }
`;

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: ${props => props.position || ''};
  bottom: 1rem;
`;

const ProfileLi = styled.li`
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: row;
    gap: 130px;
  }
`;

const Figcaption = styled.figcaption`
  margin: ${props => props.$margin || '0'};
  line-height: 1.5;
  text-align: center;
  font-size: ${props => props.$size || '1.25rem'};
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
`;

const Container = styled.div`
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: column;
    order: ${props => props.order || ''};
    justify-content: end;
    margin-bottom: 3rem;
  }
`;

const P = styled.p`
  margin: ${props => props.$margin || '0'};
  line-height: ${props => props.$line || ''};
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: ${props => (props.$size ? props.$size : '1.25rem')};
  display: flex;
  flex-direction: column;
  max-width: 408px;
  font-weight: ${props => (props.$weight ? props.$weight : '')};
  @media screen and (min-width: 1280px) {
    font-size: ${props => (props.$desktopSize ? props.$desktopSize : '')};
    margin-top: ${props => props.$desktopMargin || ''};
  }
`;

function ManagerIntro() {
  const profiles = {
    leader: {
      id: 1,
      photo: leaderImg,
      department: '총기획단',
      position: '총기획단장',
      name: '박찬',
      introTitle: 'FIELD와 함께 성장하는 여정',
      intro: '안녕하세요. FIELD 17기 총기획단장 박찬입니다. 저희 FIELD는 여러분의 꿈을 실현시켜드리는 최고의 파트너가 되겠습니다.'
    },
    viceLeader: {
      id: 2,
      photo: leaderImg, // 임시로 같은 이미지 사용
      department: '총기획단',
      position: '부총기획단장',
      name: '김서연',
      introTitle: '함께 만들어가는 미래',
      intro: '안녕하세요. FIELD 17기 부총기획단장 김서연입니다. 여러분과 함께 성장하고 발전하는 FIELD가 되도록 노력하겠습니다.'
    },
    departments: [
      {
        id: 3,
        photo: leaderImg, // 임시로 같은 이미지 사용
        department: '기획부',
        position: '기획부장',
        name: '김여진',
        introTitle: '체계적인 기획으로',
        intro: 'FIELD의 모든 행사와 프로그램을 기획하고 운영합니다.'
      },
      {
        id: 4,
        photo: leaderImg, // 임시로 같은 이미지 사용
        department: '컴페티션부',
        position: '컴페티션부장',
        name: '김규범',
        introTitle: '최고의 대회 운영',
        intro: '공정하고 수준 높은 대회를 만들어갑니다.'
      },
      {
        id: 5,
        photo: leaderImg, // 임시로 같은 이미지 사용
        department: '홍보부',
        position: '홍보부장',
        name: '김보람',
        introTitle: '효과적인 홍보 전략',
        intro: 'FIELD의 가치를 널리 알립니다.'
      },
      {
        id: 6,
        photo: leaderImg, // 임시로 같은 이미지 사용
        department: '대외협력부',
        position: '대외협력부장',
        name: '김영훈',
        introTitle: '든든한 파트너십',
        intro: '다양한 기관과의 협력을 통해 FIELD를 발전시킵니다.'
      }
    ]
  };

  return (
    <MainSection>
      <NanumH2 $margin='5rem 0'>
        <span>17기 단장단과 함께</span>
        <span>여러분의 꿈을 실현하세요.</span>
      </NanumH2>
      <Ul $margin='2rem 0' $gap='5rem'>
        <ProfileLi>
            <Figure>
              <Image
              src={profiles.leader.photo}
                width='250px'
                height='300px'
                radius='50%'
              alt={profiles.leader.name}
              />
              <Figcaption $margin='3rem 0'>
                <P $weight='900' $desktopSize='1rem'>
                {profiles.leader.position}
                </P>
                <P $weight='900' $desktopSize='1rem'>
                {profiles.leader.name}
                </P>
              </Figcaption>
            </Figure>
            <Container>
              <P
                $desktopSize='1rem'
                $line='1.3'
                $weight='800'
                $desktopMargin='1rem'
                $size='1.125rem'
              >
              {profiles.leader.introTitle}
              </P>
              <P
                $size='1rem'
                $line='1.5'
                $margin='1rem 0 0 0'
                $desktopSize='0.8rem'
                $desktopMargin='2rem'
              >
              {profiles.leader.intro}
              </P>
            </Container>
          </ProfileLi>
      </Ul>
      <Ul $margin='4rem 0' $gap='5rem'>
        <ProfileLi>
            <Figure>
              <Image
              src={profiles.viceLeader.photo}
                width='250px'
                height='300px'
                radius='50%'
              alt={profiles.viceLeader.name}
              />
              <Figcaption $margin='3rem 0'>
                <P $weight='900' $desktopSize='1rem'>
                {profiles.viceLeader.position}
                </P>
                <P $weight='900' $desktopSize='1rem'>
                {profiles.viceLeader.name}
                </P>
              </Figcaption>
            </Figure>
            <Container order='-1'>
              <P
                $desktopSize='1rem'
                $line='1.3'
                $weight='800'
                $desktopMargin='1rem'
                $size='1.125rem'
              >
              {profiles.viceLeader.introTitle}
              </P>
              <P
                $size='1rem'
                $line='1.5'
                $margin='1rem 0 0 0'
                $desktopSize='0.8rem'
                $desktopMargin='2rem'
              >
              {profiles.viceLeader.intro}
              </P>
            </Container>
          </ProfileLi>
      </Ul>
      <Ul $margin='4rem 0' $desktopMargin='10rem 0'>
        {profiles.departments.map(item => (
          <Li key={item.id}>
            <Figure>
              <Image
                src={item.photo}
                width='200px'
                height='250px'
                radius='50%'
                alt={item.name}
              />
              <Figcaption $margin='1rem 0'>
                <P $weight='900' $desktopSize='0.8rem' $size='1rem'>
                  {item.position}
                </P>
                <P $weight='900' $desktopSize='0.8rem' $size='1rem'>
                  {item.name}
                </P>
              </Figcaption>
            </Figure>
          </Li>
        ))}
      </Ul>
    </MainSection>
  );
}

export default ManagerIntro;
