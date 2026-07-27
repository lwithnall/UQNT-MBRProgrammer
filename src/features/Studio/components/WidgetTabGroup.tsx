import { WidgetTab } from './index';
import { useStudio } from '../state';
import { widgets } from '../lib/constants';
import { type WindowId } from '../lib/types';
import { type MosaicPath } from 'react-mosaic-component';

export interface WidgetTabGroupProps {
  windowId: WindowId;
  path: MosaicPath;
}

/**
 * WidgetTabGroup
 * Renders ordered collection of widget tabs.
 * Used to render widget selections for each window.
 */
export function WidgetTabGroup({ windowId, path }: WidgetTabGroupProps) {
  const { studio, setActiveWidget } = useStudio();
  const windowData = studio.windows[windowId];

  return (
    <div className="flex gap-1">
      {windowData.widgets.map((widgetId, idx) => {
        const { icon, displayName } = widgets[widgetId];
        return (
          <WidgetTab
            widgetId={widgetId}
            key={widgetId}
            index={idx}
            icon={icon}
            label={displayName}
            path={path}
            selected={studio.windows[windowId].activeWidget === widgetId}
            onClick={() => setActiveWidget(windowId, widgetId)}
          />
        );
      })}
    </div>
  );
}
