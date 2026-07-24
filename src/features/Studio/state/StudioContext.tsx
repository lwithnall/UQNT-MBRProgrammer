import { useState, createContext, useContext } from 'react';
import { defaultStudio, widgets } from '../lib/constants';
import type { StudioState, WindowId, WindowMosaicNode } from '../lib/types';

interface StudioContextType {
  studio: StudioState; // Window and widget tab layout for studio
  setMosaic: (newMosaic: WindowMosaicNode) => void;
  getWindowContent: (windowId: WindowId) => React.ComponentType;
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

  return (
    <StudioContext.Provider value={{ studio, setMosaic, getWindowContent }}>
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
