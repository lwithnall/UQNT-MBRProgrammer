import { type MosaicNode } from "react-mosaic-component"
import { type IconType } from "react-icons"

// Basic unique identifier stuff
export type UID = string | number;
export type Window = UID;
export type Widget = UID;

/* Mapping widgets to their data */
export type WidgetMap = Record<Widget, WidgetData>;
export type WidgetData = {
  icon: IconType;                // Icon used to represent widget
  displayName: string;           // String used to represent widget
  content: React.ComponentType;  // JSX content for widget
}

/* (Mosaic) window holding rendered widget content */
export type WindowMap = Record<Window, WindowData>;
export type WindowData = {
  widgets: Widget[];
  activeWidget: Widget;
}

/* Stores current state of react-mosaic-component */
export type MosaicState = MosaicNode<Window>;

/* Store information for studio */
export interface StudioState {
  windows: WindowMap;
  mosaic: MosaicState;
}
