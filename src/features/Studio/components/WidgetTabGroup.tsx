import { WidgetTab } from "./WidgetTab";
import { type WindowId, widgets } from "../lib";
import { useStudio } from "../state";

export interface WidgetTabGroupProps {
  windowId: WindowId;
}


/**
 * WidgetTabGroup
 * Renders ordered collection of widget tabs.
 * Used to render widget selections for each window.
 */
export function WidgetTabGroup({ windowId }: WidgetTabGroupProps) {
  const { studio } = useStudio()
  const windowData = studio.windows[windowId];

  return (
    <div>
      {windowData.widgets.map((widgetId, idx) => {
        const { icon, displayName }= widgets[widgetId];
        return <WidgetTab id={widgetId} key={widgetId} index={idx} icon={icon} label={displayName} />
      })}
    </div>
  )
}
