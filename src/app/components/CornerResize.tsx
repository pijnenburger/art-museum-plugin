import * as React from 'react';
import { useRef } from 'react';

import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import '../styles/ui.css';

import useResizableWindow from '../../helpers/useResizableWindow';

// Resizing

const CornerResize = ({}) => {
  const cornerRef = useRef(null);
  const { handlePointerDown } = useResizableWindow(cornerRef);

  return (
    <div ref={cornerRef} onPointerDown={handlePointerDown}>
      <svg id="corner" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.0001 10.7072L10.7072 16.0001H9.29297L16.0001 9.29297V10.7072Z" className="handle_line" />
        <path d="M16 0V0.707107L0.707108 16H0L7.55191e-05 15.2929L15.2929 7.55191e-05L16 0Z" className="handle_line" />
        <path d="M16.0001 5.70718L5.70718 16.0001H4.29297L16.0001 4.29297V5.70718Z" className="handle_line" />
      </svg>
    </div>
  );
};
export default React.memo(CornerResize);
