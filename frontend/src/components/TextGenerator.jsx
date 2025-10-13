import {AnimatePresence, motion, useAnimation} from 'framer-motion'; // framer-motion에서 motion, useAnimation, AnimatePresence를 불러옵니다.
import {useEffect} from 'react'; // 리액트의 useEffect 훅을 불러옵니다.
import {v4 as uuidv4} from 'uuid'; // uuid 라이브러리에서 v4를 불러옵니다.
import styled from 'styled-components'; // styled-components를 불러옵니다.

// 텍스트 애니메이션을 담당하는 컨테이너를 스타일드 컴포넌트로 정의합니다.
const TextGenerateContainer = styled.span`
  font-size: ${props => props.$size || '1.28rem'}; // 폰트 크기를 설정합니다.
  font-weight: ${props => props.$weight || 'bold'}; // 폰트 굵기를 설정합니다.
  text-align: ${props => props.$align || 'center'}; // 텍스트를 가운데 정렬합니다.
  line-height: ${props => props.$height || '2'};
  font-family: ${props => props.$fontFamily || ''};
  margin: ${props => props.$margin || ''};
  letter-spacing: ${props => props.$spacing || ''};
  text-rendering: optimizeSpeed;
  @media screen and (min-width: 1024px) {
    font-size: ${props => props.$desktopSize || ''};
    align-self: ${props => props.$justify || ''};
    text-align: ${props => props.$desktopAlign || ''};
  }
`;

// 텍스트 애니메이션 예시를 담당하는 함수형 컴포넌트를 정의합니다.
function TextGenerator({
  text,
  size,
  align,
  $margin,
  weight,
  height,
  spacing,
  time = 0.3,
  $desktopSize,
  $justify,
  $fontFamily,
  $desktopAlign,
}) {
  const animationControl = useAnimation(); // 애니메이션을 제어하는 useAnimation 훅을 사용합니다.
  const wordsArray = text.split(' '); // 주어진 텍스트를 공백을 기준으로 분할하여 단어 배열로 만듭니다.

  // 컴포넌트가 마운트될 때 한 번만 실행되는 useEffect 훅을 사용하여 애니메이션을 시작합니다.
  useEffect(() => {
    const animateText = async () => {
      // 비동기 함수를 정의합니다.
      await animationControl.start('visible'); // visible 상태로 애니메이션을 시작합니다.
      await animationControl.start('hidden'); // hidden 상태로 애니메이션을 시작합니다.
    };
    animateText(); // animateText 함수를 호출하여 애니메이션을 실행합니다.
  }, [animationControl]); // useEffect의 종속성 배열에 animationControl을 추가하여 애니메이션이 업데이트될 때마다 실행됩니다.

  return (
    <TextGenerateContainer
      $size={size}
      $align={align}
      $margin={$margin}
      $weight={weight}
      $height={height}
      $spacing={spacing}
      $desktopSize={$desktopSize}
      $justify={$justify}
      $fontFamily={$fontFamily}
      $desktopAlign={$desktopAlign}
    >
      <AnimatePresence>
        {' '}
        {/* AnimatePresence 컴포넌트를 사용하여 애니메이션을 관리합니다. */}
        <motion.span
          className='text-container' // 텍스트 컨테이너의 클래스 이름을 지정합니다.
          initial='hidden' // 초기 상태를 hidden으로 설정합니다.
          animate='visible' // 애니메이션을 visible 상태로 시작합니다.
          exit='hidden' // 애니메이션을 hidden 상태로 종료합니다.
          variants={{
            visible: {opacity: 1, transition: {duration: 2}}, // visible 상태의 애니메이션 속성을 정의합니다.
            hidden: {opacity: 0, y: 20, transition: {duration: 0.5}}, // hidden 상태의 애니메이션 속성을 정의합니다.
          }}
          onAnimationComplete={() => animationControl.set({opacity: 0})} // 애니메이션이 완료된 후에 opacity를 설정합니다.
        >
          {wordsArray.map((word, idx) => (
            <motion.span
              $justify={$justify}
              style={{
                // wordsArray의 마지막 요소인 경우 패딩 적용
                paddingRight: idx === wordsArray.length - 1 ? '10px' : '',
              }}
              key={uuidv4()} // 고유한 키를 생성합니다.
              variants={{
                visible: {opacity: 1, y: 0}, // visible 상태의 애니메이션 속성을 정의합니다.
                hidden: {opacity: 0, y: 20}, // hidden 상태의 애니메이션 속성을 정의합니다.
              }}
              transition={{duration: 0.5, delay: idx * time}} // 애니메이션 지속 시간과 지연을 설정합니다.
              initial='hidden' // 초기 상태를 hidden으로 설정합니다.
              animate='visible' // 애니메이션을 visible 상태로 시작합니다.
              exit='hidden' // 애니메이션을 hidden 상태로 종료합니다.
            >
              {word} {/* 단어를 렌더링합니다. */}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </TextGenerateContainer>
  );
}

export default TextGenerator; // AnimationExample 컴포넌트를 내보냅니다.
