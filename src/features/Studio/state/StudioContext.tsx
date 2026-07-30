import { useState, createContext, useContext } from 'react';
import { defaultStudio } from '../lib/constants';
import type { StudioState, WidgetId, WindowId, WindowMosaicNode, DropSide } from '../lib/types';
import {
  createBalancedTreeFromLeaves,
  getLeaves,
  type MosaicNode,
  type MosaicPath,
} from 'react-mosaic-component';
import * as utils from '../lib/studioUtils';

interface StudioContextType {
  studio: StudioState;
  autoArrangeMosaic: () => void;
  windowFromId: (id: WindowId | WidgetId) => WindowId | WidgetId | null;
  getWidgetIndex: (windowId: WindowId, widgetId: WidgetId) => number;
  setMosaic: (newMosaic: WindowMosaicNode) => void;
  getWindowContent: (windowId: WindowId) => React.ComponentType;
  widgetCount: (windowId: WindowId) => number;
  setActiveWidget: (windowId: WindowId, widgetId: WidgetId) => void;
  changeWidgetIndex: (windowId: WindowId, oldIndex: number, newIndex: number) => void;
  transferWidget: (
    widgetId: WidgetId,
    sourceWindowId: WindowId,
    targetWindowId: WindowId,
    sourceWindowPath: MosaicPath,
    index?: number
  ) => void;
  spawnWindowFromWidget: (
    widgetId: WidgetId,
    sourceId: WindowId,
    sourcePath: MosaicPath,
    targPath: MosaicPath,
    dropSide: DropSide
  ) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: React.PropsWithChildren) {
  const [studio, setStudio] = useState<StudioState>(defaultStudio);

  const autoArrangeMosaic = () => {
    const leaves = getLeaves(studio.mosaic);
    const newMosaic = createBalancedTreeFromLeaves(leaves);
    if (newMosaic === null) return;
    setStudio((studio) => {
      return { ...studio, mosaic: newMosaic };
    });
  };

  const widgetCount = (windowId: WindowId) => {
    return utils.widgetCount(studio, windowId);
  };

  const windowFromId = (id: WindowId | WidgetId) => {
    return utils.windowFromId(studio, id);
  };

  const getWidgetIndex = (windowId: WindowId, widgetId: WidgetId) => {
    return utils.getWidgetIndex(studio, windowId, widgetId);
  };

  const setMosaic = (mosaic: MosaicNode<WindowId>) => {
    setStudio((studio) => utils.setMosaic(studio, mosaic));
  };

  const setActiveWidget = (windowId: WindowId, widgetId: WidgetId) => {
    setStudio((studio) => utils.setActiveWidget(studio, windowId, widgetId));
  };

  const getWindowContent = (windowId: WindowId) => {
    return utils.getWindowContent(studio, windowId);
  };

  const changeWidgetIndex = (windowId: WindowId, oldIndex: number, newIndex: number) => {
    setStudio((studio) => utils.changeWidgetIndex(studio, windowId, oldIndex, newIndex));
  };

  const transferWidget = (
    widgetId: WidgetId,
    sourceWindowId: WindowId,
    targetWindowId: WindowId,
    sourceWindowPath: MosaicPath,
    index?: number
  ) => {
    setStudio((studio) =>
      utils.transferWidget(
        studio,
        widgetId,
        sourceWindowId,
        targetWindowId,
        sourceWindowPath,
        index
      )
    );
  };

  const spawnWindowFromWidget = (
    widgetId: WidgetId,
    sourceId: WindowId,
    sourcePath: MosaicPath,
    targPath: MosaicPath,
    dropSide: DropSide
  ) => {
    setStudio((studio) =>
      utils.spawnWindowFromWidget(studio, widgetId, sourceId, sourcePath, targPath, dropSide)
    );
  };

  return (
    <StudioContext.Provider
      value={{
        studio,
        autoArrangeMosaic,
        setMosaic,
        windowFromId,
        getWidgetIndex,
        getWindowContent,
        widgetCount,
        setActiveWidget,
        changeWidgetIndex,
        transferWidget,
        spawnWindowFromWidget,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error('useStudio must be used within StudioProvider');
  }
  return context;
}
