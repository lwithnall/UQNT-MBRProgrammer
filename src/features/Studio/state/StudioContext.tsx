import { useState, createContext, useContext } from "react";
import { defaultStudio, type StudioState } from "../lib";

interface StudioContextType {
  studio: StudioState
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export function StudioProvider({ children }: React.PropsWithChildren) {
  const [studio, _] = useState<StudioState>(defaultStudio);

  return (
    <StudioContext.Provider value={{studio}}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error("useStudio must be used within StudioProvider");
  }
  return context;
}