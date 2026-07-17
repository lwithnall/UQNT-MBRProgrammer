import * as Blockly from "blockly/core";
import * as python from "blockly/python";
import { createContext, useContext, useEffect, useState } from "react";
import { TextToBlocks } from "../lib/textToBlocks";


/* Exposed code context API for external components */
interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}


const CodeContext = createContext<CodeContextType | undefined>(undefined);
const DEFAULT_CODE = '';


export function CodeProvider({children}: React.PropsWithChildren) {

  // Registering blocks for blockly and text->block conversion
  const loadedASTs = [];
  const textToBlocks = new TextToBlocks(Blockly, python);

  // Manage code state for entire context
  // Editors send updates to context, which proliferate to other editors
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  useEffect(() => {console.log(code)}, [code])

  return <CodeContext.Provider value={{code, setCode}}>{children}</CodeContext.Provider>
}


export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) throw new Error("Use useCode hook inside CodeProvider.");
  return context;
}
