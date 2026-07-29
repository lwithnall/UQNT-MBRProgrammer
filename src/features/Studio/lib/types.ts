import { type IconType } from 'react-icons';
import type { MosaicNode } from 'react-mosaic-component';
import { type UniqueIdentifier } from '@dnd-kit/abstract';

// Basic unique identifier stuff
export type WidgetId = UniqueIdentifier;
export type WindowId = UniqueIdentifier;
export type WindowMosaicNode = MosaicNode<WindowId>;
export type DropSide = 'top' | 'bottom' | 'left' | 'right';

/*
 * Data required to render a widget into a window
 *   icon: the icon on the corresponding widget tab
 *   displayName: the text on the corresponding widget tab (only icon if null)
 *   content: React component loaded by window when widget is active
 */
export type WidgetData = {
  icon: IconType;
  displayName: string | null;
  content: React.ComponentType;
};
export type WidgetMap = Record<WidgetId, WidgetData>;

/* (Mosaic) window holding widget tabs and rendered content
 *  widgets: available widget tabs
 *  activeWidget: selected widget, will render this widgets content
 */
export type WindowData = {
  widgets: WidgetId[];
  activeWidget: WidgetId;
};
export type WindowMap = Record<WindowId, WindowData>;

// Stores data required to render studio windows + widget content
export type StudioState = {
  windows: WindowMap;
  mosaic: WindowMosaicNode;
};
