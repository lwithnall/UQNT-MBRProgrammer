/* eslint-disable react-refresh/only-export-components */

import { useState, createContext, useContext } from "react"
import type { StudioState } from "./lib/types"
import { defaultStudio } from "./lib/constants";

interface StudioContextType {
  studio: StudioState;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);


/* Hook wrapper for studio context */
export const useStudio = (): StudioContextType => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within StudioProvider.");
  }
  return context;
}


/* Studio context provider */
export function StudioProvider({children}: React.PropsWithChildren) {
  const [studio, setStudio] = useState<StudioState>(defaultStudio);

  return (
    <StudioContext.Provider
      value={{studio,}}
    >
      {children}
    </StudioContext.Provider>
  )
}
