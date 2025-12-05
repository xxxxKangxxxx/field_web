import React from 'react';
import styled from 'styled-components';

// 프로필 이미지 import
import kimhgImg from '../../assets/profiles/kimhg.jpg';
import kimsunjunImg from '../../assets/profiles/김성준.jpeg';
import kimyohanImg from '../../assets/profiles/김요한.jpeg';
import kwontaeyoungImg from '../../assets/profiles/권태영.jpeg';
import heojinyoungImg from '../../assets/profiles/허진영.jpeg';
import baehaeinImg from '../../assets/profiles/배해인.jpeg';

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
  transition: all 0.3s ease;
  opacity: ${props => props.$opacity || 1};
  transform: ${props => props.$scale ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${props => props.$highlight ? '0 0 20px rgba(255, 215, 0, 0.3)' : 'none'};
  
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
  white-space: pre-line;
  
  @media screen and (min-width: 1280px) {
    display: flex;
    flex-direction: column;
    order: ${props => props.order || ''};
    justify-content: end;
    margin-bottom: 3rem;
  }
`;

const IntroContainer = styled.div`
  margin: 2rem auto 4rem auto;
  text-align: left;
  max-width: 90%;
  white-space: pre-line;
  
  @media screen and (min-width: 1280px) {
    max-width: 90%;
  }
`;

const P = styled.p`
  margin: ${props => props.$margin || '0'};
  line-height: ${props => props.$line || ''};
  color: ${props => (props.color ? theme.colors[props.color] : '')};
  font-size: ${props => (props.$size ? props.$size : '1.25rem')};
  display: flex;
  flex-direction: column;
  max-width: ${props => props.$maxWidth || '408px'};
  font-weight: ${props => (props.$weight ? props.$weight : '')};
  @media screen and (min-width: 1280px) {
    font-size: ${props => (props.$desktopSize ? props.$desktopSize : '')};
    margin-top: ${props => props.$desktopMargin || ''};
  }
`;

function ManagerIntro({ selectedDepartment }) {
  const profiles = {
    leader: {
      id: 1,
      photo: kimhgImg,
      department: '총기획단',
      position: '총기획단장',
      name: '김현국',
      introTitle: 'FIELD와 함께 성장하는 여정',
      intro: '안녕하십니까. 필드 18기 총기획단장 김현국입니다.\n\n 유구한 역사를 자랑하는 전국산업공학도 모임, FIELD를 이끌어나갈 수 있다는 것에 큰 자긍심을 느낍니다. 25년도에 진행된 역대 최대규모의 필드캠프를 성공적으로 마무리했고, 이 긍정적 흐름을 이어가 FIELD를 산업공학도들의 학술적, 인적 교류의 장으로서 더욱 활성화시키겠습니다.\n\n총기획단장이라는 자리의 무게를 항상 인지하며 FIELD를 빛내기 위해 온 마음을 다하겠습니다.\n\n앞으로의 FIELD 많은 관심 부탁드립니다!'
    },
    viceLeader: {
      id: 2,
      photo: kimsunjunImg,
      department: '총기획단',
      position: '부총기획단장',
      name: '김성준',
      introTitle: '함께 만들어가는 미래',
      intro: '안녕하세요! FIELD 열여덟 번째 이야기에 부총기획단장으로 함께하게 된 김성준입니다.\n\n지금까지 이어져 온 이야기들처럼, 이번 기수의 이야기도 오래 기억될 수 있는 소중한 장면들로 채워지길 바랍니다. 저는 부총기획단장으로서 예산 관리와 인적 관리 등 맡은 책임을 다하며, 행사 준비와 활동 운영이 차질 없이 진행될 수 있도록 최선을 다하겠습니다! \n\n그럼 이제 여러분의 빛나는 순간들로, FIELD 18기만의 아름다운 이야기를 만들어 볼까요?'
    },
    departments: [
      {
        id: 3,
        photo: kimyohanImg,
        department: '기획부',
        position: '기획부장',
        name: '김요한',
        introTitle: '체계적인 기획으로',
        intro: '필드 18기 기획부장 김요한입니다.\n\n행사를 한 편의 이야기처럼 기획하며, 필드의 발자취를 세상에 남기겠습니다. 산업공학도의 열정과 가능성을 상징하는 공간으로 필드를 더 크게 성장시키겠습니다.'
      },
      {
        id: 4,
        photo: kwontaeyoungImg,
        department: '컴페티션부',
        position: '컴페티션부장',
        name: '권태영',
        introTitle: '최고의 대회 운영',
        intro: '안녕하십니까! 필드 18기 컴페티션부장 권태영입니다.\n\n 17기 컴페티션부원으로 활동하면서 컴페티션부의 역할과 프로세스를 체득하였습니다. 여기에 책임감을 더해 18기 컴페티션부장으로서 활동하게 되었습니다. 다양한 배경과 역량을 가진 부원들을 조화로이 통솔하고, 컴페티션의 양질의 측면에 있어 ‘향상’을 지향하는 컴페티션 부장이 되겠습니다. \n\n필드에서의 학술적 활동을 담당하는 책무를 맡은 만큼 보다 촘촘히, 꾸준하게 정진하겠습니다. \n\n앞으로의 FIELD 많은 관심 부탁드립니다.'
      },
      {
        id: 5,
        photo: heojinyoungImg,
        department: '홍보부',
        position: '홍보부장',
        name: '허진영',
        introTitle: '효과적인 홍보 전략',
        intro: '안녕하십니까. FIELD 18기 홍보부장 허진영입니다. \n\n홍보부는 FIELD의 다양한 활동과 성과를 알리고, 학회원 간 소통을 활성화하며 대외적으로는 산업공학도의 역량을 널리 전하는 역할을 맡고 있습니다. 저는 앞으로 책임감 있는 홍보 활동을 통해 FIELD의 가치와 의미를 보다 많은 분들께 전달하고자 합니다. \n\n산업공학을 향한 열정과 도전이 담긴 이야기를 성실히 전하며, FIELD가 더욱 발전할 수 있도록 최선을 다하겠습니다. \n\n많은 관심과 성원 부탁드립니다. 감사합니다.'
      },
      {
        id: 6,
        photo: baehaeinImg,
        department: '대외협력부',
        position: '대외협력부장',
        name: '배해인',
        introTitle: '든든한 파트너십',
        intro: '안녕하십니까. 필드 18기 대외협력부장 배해인입니다. \n\n산업공학도의 전국적 교류를 이끌어가는 FIELD에서, 외부와의 가교 역할을 맡게 되어 큰 책임감과 설렘을 느끼고 있습니다. \n대외협력부는 학회, 기업, 타 대학 단체 등 다양한 외부 주체와의 협력을 통해 FIELD의 활동을 널리 알리고, 산업공학도들이 더 넓은 무대에서 교류할 수 있도록 지원하는 부서입니다. \n\n저는 이 자리에서 FIELD의 위상을 더욱 높이고, 산업공학도의 가치와 가능성을 다양한 곳에 알리며 교류의 기회를 확장해 나가겠습니다. \n앞으로도 FIELD가 학술적·인적 네트워크의 장으로 자리매김할 수 있도록 최선을 다하겠습니다. \n\n많은 관심과 응원 부탁드립니다!'
      }
    ]
  };

  // 부서별 강조 여부 계산
  const isHighlighted = (department) => {
    return selectedDepartment === department;
  };

  const getOpacity = (department) => {
    if (!selectedDepartment) return 1;
    return isHighlighted(department) ? 1 : 0.5;
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
                $maxWidth='700px'
              >
              {profiles.leader.introTitle}
              </P>
              <P
                $size='1rem'
                $line='1.5'
                $margin='1rem 0 0 0'
                $desktopSize='0.8rem'
                $desktopMargin='2rem'
                $maxWidth='700px'
              >
              {profiles.leader.intro}
              </P>
            </Container>
          </ProfileLi>
      </Ul>
      <Ul $margin='4rem 0 2rem 0' $gap='5rem'>
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
                $maxWidth='700px'
              >
              {profiles.viceLeader.introTitle}
              </P>
              <P
                $size='1rem'
                $line='1.5'
                $margin='1rem 0 0 0'
                $desktopSize='0.8rem'
                $desktopMargin='2rem'
                $maxWidth='700px'
              >
              {profiles.viceLeader.intro}
              </P>
            </Container>
          </ProfileLi>
      </Ul>
      <Ul $margin='2rem 0 1rem 0' $desktopMargin='4rem 0 2rem 0'>
        {profiles.departments.map(item => (
          <Li 
            key={item.id}
            $opacity={getOpacity(item.department)}
            $scale={isHighlighted(item.department)}
            $highlight={isHighlighted(item.department)}
          >
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
      
      {/* 선택된 부장의 자기소개 */}
      {selectedDepartment && profiles.departments.find(item => item.department === selectedDepartment) && (
        <IntroContainer>
          <P
            $desktopSize='1rem'
            $line='1.3'
            $weight='800'
            $size='1.125rem'
            $maxWidth='100%'
          >
            {profiles.departments.find(item => item.department === selectedDepartment).introTitle}
          </P>
          <P
            $size='1rem'
            $line='1.5'
            $margin='1rem 0 0 0'
            $desktopSize='0.8rem'
            $maxWidth='100%'
          >
            {profiles.departments.find(item => item.department === selectedDepartment).intro}
          </P>
        </IntroContainer>
      )}
    </MainSection>
  );
}

export default ManagerIntro;
