import { Mosaic } from 'react-mosaic-component';
import { StudioWindow, WidgetTabGroup, StudioDndManager } from './index';
import { useStudio } from '../state';
import type { WindowId, WindowMosaicNode } from '../lib/types';
import { WidgetHosts, WidgetSlot } from './WidgetHost';

import 'react-mosaic-component/react-mosaic-component.css';
import '../styling/mosaic.css';

export function Studio() {
  const { studio, setMosaic } = useStudio();

  // Called by Mosaic component to handle mosaic structure changes
  const onChange = (newMosaic: WindowMosaicNode | null) => {
    if (newMosaic == null) throw new Error('Mosaic state should never be null');
    setMosaic(newMosaic);
  };

  return (
    <StudioDndManager>
      {/* Render singleton values for widget containers */}
      <WidgetHosts />
      <Mosaic<WindowId>
        renderTile={(windowId, path) => {
          const activeWidget = studio.windows[windowId].activeWidget;
          return (
            <StudioWindow
              id={windowId}
              path={path}
              toolbarControls={<WidgetTabGroup windowId={windowId} path={path} />}
            >
              <WidgetSlot widgetId={activeWidget} />
            </StudioWindow>
          );
        }}
        value={studio.mosaic}
        onChange={onChange}
      />
    </StudioDndManager>
  );
}
