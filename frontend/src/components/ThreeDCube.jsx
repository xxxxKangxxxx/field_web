import styled from 'styled-components';

const CubeContainer = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
  perspective: 600px;
`;

const Cube = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transform: rotateX(45deg) rotateY(0deg) rotateZ(45deg);
  color: white;
  font-size: 100px;
`;

const CubeFace = styled.div`
  background-color: 'yellow';
  position: absolute;
  width: 100px;
  height: 100px;
`;

const FrontFace = styled(CubeFace)`
  line-height: 100px;
  transform: rotateY(0deg) translateZ(50px);
  font-size: 100px;
  text-align: center;
`;

const RightFace = styled(CubeFace)`
  transform: rotateY(90deg) translateZ(30px) rotate(270deg);
`;

const TopFace = styled(CubeFace)`
  transform: rotateX(-90deg) translateZ(50px);
`;

const ThreeDCube = () => {
  return (
    <CubeContainer>
      <Cube>
        <FrontFace>F</FrontFace>
        <RightFace>LD</RightFace>
        <TopFace>IE</TopFace>
      </Cube>
    </CubeContainer>
  );
};

export default ThreeDCube;
