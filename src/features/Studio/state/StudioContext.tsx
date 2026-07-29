import { useState, createContext, useContext } from 'react';
import { defaultStudio } from '../lib/constants';
import type { StudioState, WidgetId, WindowId, WindowMosaicNode, DropSide } from '../lib/types';
import { type MosaicNode, type MosaicPath } from 'react-mosaic-component';
import * as utils from '../lib/studioUtils';

interface StudioContextType {
  studio: StudioState;
  windowFromId: (id: WindowId | WidgetId) => WindowId | WidgetId | null;
  setMosaic: (newMosaic: WindowMosaicNode) => void;
  getWindowContent: (windowId: WindowId) => React.ComponentType;
  widgetCount: (windowId: WindowId) => number;
  setActiveWidget: (windowId: WindowId, widgetId: WidgetId) => void;
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

  const widgetCount = (windowId: WindowId) => {
    return utils.widgetCount(studio, windowId);
  };

  const windowFromId = (id: WindowId | WidgetId) => {
    return utils.windowFromId(studio, id);
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
        setMosaic,
        windowFromId,
        getWindowContent,
        widgetCount,
        setActiveWidget,
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
