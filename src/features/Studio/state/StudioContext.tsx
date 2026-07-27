import { useState, createContext, useContext } from 'react';
import { defaultStudio, widgets } from '../lib/constants';
import type { StudioState, WidgetId, WindowId, WindowMosaicNode } from '../lib/types';

interface StudioContextType {
  studio: StudioState;
  setMosaic: (newMosaic: WindowMosaicNode) => void;
  getWindowContent: (windowId: WindowId) => React.ComponentType;
  setActiveWidget: (windowId: WindowId, widgetId: WidgetId) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: React.PropsWithChildren) {
  const [studio, setStudio] = useState<StudioState>(defaultStudio);

  /** Update studio's mosaic value */
  const setMosaic = (newMosaic: WindowMosaicNode) => {
    setStudio({
      ...studio,
      mosaic: newMosaic,
    });
  };

  /**
   * Get the div element to render for a given window
   * >>> Content associated with it's active widget
   */
  const getWindowContent = (windowId: WindowId) => {
    return widgets[studio.windows[windowId].activeWidget].content;
  };

  const setActiveWidget = (windowId: WindowId, widgetId: WidgetId) => {
    setStudio({
      ...studio,
      windows: {
        ...studio.windows,
        [windowId]: {
          ...studio.windows[windowId],
          activeWidget: widgetId,
        },
      },
    });
  };

  return (
    <StudioContext.Provider value={{ studio, setMosaic, getWindowContent, setActiveWidget }}>
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
