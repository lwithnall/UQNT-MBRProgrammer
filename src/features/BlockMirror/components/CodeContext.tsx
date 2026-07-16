import { createContext, useContext, useEffect, useState } from "react";
import * as Blockly from "blockly/core";
import "../lib/register";

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);
const DEFAULT_CODE = '';


export function CodeProvider({children}: React.PropsWithChildren) {
  const [code, setCode] = useState<string>(DEFAULT_CODE);

  useEffect(() => {console.log(code)}, [code])

  return <CodeContext.Provider value={{code, setCode}}>{children}</CodeContext.Provider>
}


export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) throw new Error("Use useCode hook inside CodeProvider.");
  return context;
}
