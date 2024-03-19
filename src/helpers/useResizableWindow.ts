import { useEffect, useState } from 'react';
import parentPostMessage from './parentPostMessage';
import _debounce from 'lodash/debounce';

function useResizableWindow(ref: React.RefObject<HTMLDivElement>) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (isDragging && ref.current) {
        const size = {
          w: Math.max(340, Math.floor(e.clientX + 5)),
          h: Math.max(460, Math.floor(e.clientY + 5)),
        };
        parentPostMessage('resize', { size: size });
      }
    }

    function handlePointerUp() {
      setIsDragging(false);
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, ref]);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  return { handlePointerDown };
}

export default useResizableWindow;
