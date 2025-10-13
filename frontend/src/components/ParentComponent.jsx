import React, {useState, useEffect} from 'react';
import TextGenerator from './TextGenerator';

function ParentComponent({startHeight, text}) {
  const [shouldAnimate, setShouldAnimate] = useState(false); // 애니메이션 시작 여부를 관리하는 상태를 정의합니다.

  // 스크롤 이벤트 핸들러 함수를 정의합니다.
  const handleScroll = () => {
    const scrollPosition = window.scrollY; // 현재 스크롤 위치를 가져옵니다.
    const triggerHeight = startHeight; // 애니메이션을 시작할 스크롤 위치를 지정합니다. 필요에 따라 조정 가능합니다.
    console.log(window.scrollY);
    // 현재 스크롤 위치가 지정한 위치보다 크면 애니메이션을 시작합니다.
    if (scrollPosition > triggerHeight) {
      setShouldAnimate(true);
    }
  };

  // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너를 추가하고, 언마운트될 때 제거합니다.
  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 리스너를 추가합니다.
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트가 언마운트될 때 스크롤 이벤트 리스너를 제거합니다.
    };
  }, []); // 의존성 배열이 비어 있으므로 컴포넌트가 마운트될 때만 실행됩니다.

  return (
    <div style={{height: '2000px'}}>
      {/* 스크롤 높이에 따라 애니메이션을 시작하기 위해 shouldAnimate 상태를 props로 전달합니다. */}
      {shouldAnimate && <TextGenerator text={text} />}
    </div>
  );
}

export default ParentComponent; // ParentComponent 컴포넌트를 내보냅니다.
