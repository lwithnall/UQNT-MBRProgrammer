import { type MosaicNode } from "react-mosaic-component"
import { type IconType } from "react-icons"

// Basic unique identifier stuff
export type UID = string | number;
export type WindowID = UID;
export type WidgetID = UID;

/* Mapping widgets to their data */
export type WidgetMap = Record<WidgetID, WidgetData>;
export type WidgetData = {
  icon: IconType;                // Icon used to represent widget
  displayName: string;           // String used to represent widget
  content: React.ComponentType;  // JSX content for widget
}

/* (Mosaic) window holding rendered widget content */
export type WindowMap = Record<WindowID, WindowData>;
export type WindowData = {
  widgets: WidgetID[];
  activeWidget: WidgetID;
}

/* Stores current state of react-mosaic-component */
export type MosaicState = MosaicNode<WindowID>;

/* Store information for studio */
export interface StudioState {
  windows: WindowMap;
  mosaic: MosaicState;
}
