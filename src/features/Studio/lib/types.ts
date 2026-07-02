import { type MosaicNode } from "react-mosaic-component";
import { type IconType } from "react-icons";
import { type UniqueIdentifier } from "@dnd-kit/abstract";

// Basic unique identifier stuff
export type WindowId = UniqueIdentifier;
export type WidgetId = UniqueIdentifier;

/* Mapping widgets to their data */
export type WidgetMap = Record<WidgetId, WidgetData>;
export type WidgetData = {
  icon: IconType;                // Icon used to represent widget
  displayName: string | null;    // String used to represent widget
  content: React.ComponentType;  // JSX content for widget
}

/* (Mosaic) window holding rendered widget content */
export type WindowMap = Record<WindowId, WindowData>;
export type WindowData = {
  widgets: WidgetId[];
  activeWidget: WidgetId;
}

/* Stores current state of react-mosaic-component */
export type MosaicState = MosaicNode<WindowId>;

/* Store information for studio */
export interface StudioState {
  windows: WindowMap;
  mosaic: MosaicState;
}
