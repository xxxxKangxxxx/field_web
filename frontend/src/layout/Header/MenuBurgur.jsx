import styled, {keyframes, css} from 'styled-components';
import theme from '../../theme';

const downRight = keyframes`
  0% {
    transform: rotate(0deg) ;
    transform-origin: left top; 
  }
  100% {
    transform: rotate(45deg) translate(6px,-5px);
    transform-origin: left top; 
  }
`;

const upLeft = keyframes`
  0% {
    transform: rotate(0deg) ;
    transform-origin: left bottom; 
  }
  100% {
    transform: rotate(-45deg) translate(6px,5px);
    transform-origin: left bottom;
  }
`;

const RotatingLines = styled.svg`
  width: 30px;
  height: 30px;
`;

const RotatingGroup = styled.g`
  stroke: ${theme.colors.white};
  stroke-width: 3;
`;

const RotatingLine = styled.line`
  stroke: ${theme.colors.white};
  stroke-width: 3;
  display: ${({$open}) => ($open ? 'none' : '')};
`;

const RotatingLineTop = styled.line`
  stroke: ${theme.colors.white};
  stroke-width: 3;
  animation: ${({$open}) =>
    $open
      ? css`
          ${downRight} 0.3s forwards
        `
      : 'none'};
`;

const RotatingLineBottom = styled.line`
  stroke: ${theme.colors.white};
  stroke-width: 3;
  animation: ${({$open}) =>
    $open
      ? css`
          ${upLeft} 0.3s forwards
        `
      : 'none'};
`;

export default function MenuBurgur({ $open }) {
  return (
    <RotatingLines xmlns='http://www.w3.org/2000/svg'>
      <RotatingGroup>
        <RotatingLineTop $open={$open} x1='0' y1='5' x2='30' y2='5' />
        <RotatingLine $open={$open} x1='0' y1='15' x2='30' y2='15' />
        <RotatingLineBottom $open={$open} x1='0' y1='25' x2='30' y2='25' />
      </RotatingGroup>
    </RotatingLines>
  );
}
