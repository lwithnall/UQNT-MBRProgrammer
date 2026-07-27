import { Mosaic } from 'react-mosaic-component';
import { StudioWindow, WidgetTabGroup, StudioDndManager } from './index';
import { useStudio } from '../state';
import type { WindowId, WindowMosaicNode } from '../lib/types';

import 'react-mosaic-component/react-mosaic-component.css';
import '../styling/mosaic.css';

export function Studio() {
  const { studio, setMosaic, getWindowContent } = useStudio();

  // Called by Mosaic component to handle mosaic structure changes
  const onChange = (newMosaic: WindowMosaicNode | null) => {
    if (newMosaic == null) throw new Error('Mosaic state should never be null');
    setMosaic(newMosaic);
  };

  return (
    <StudioDndManager>
      <Mosaic<WindowId>
        renderTile={(windowId, path) => {
          // Content to load into active window content area
          const WindowContent = getWindowContent(windowId);
          return (
            <StudioWindow
              id={windowId}
              path={path}
              toolbarControls={<WidgetTabGroup windowId={windowId} path={path} />}
            >
              <WindowContent />
            </StudioWindow>
          );
        }}
        value={studio.mosaic}
        onChange={onChange}
      />
    </StudioDndManager>
  );
}
