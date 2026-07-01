import { WidgetTab } from "./WidgetTab";
import { widgets } from "../lib";

export function WidgetTabGroup() {
  const widgetList = ["info", "help", "code", "blockly"];

  return (
    <div>
      {widgetList.map((id, idx) => {
        const { icon, displayName }= widgets[id];
        return <WidgetTab id={id} index={idx} icon={icon} label={displayName} />
      })}
    </div>
  )
}