import * as Blockly from "blockly/core";
import * as python from "blockly/python";
// @ts-expect-error - I AM NOT ADDING TYPING FOR THIS THING AAAAAARRRRGHHH
import * as Sk from "../../../vendor/skulpt/main";
import { createContext, useContext, useEffect, useState } from "react";
import { TextToBlocks } from "../lib/textToBlocks";
import { defaultAstList } from "../lib/astRegistrations";

/* Exposed code context API for external components */
interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}


const CodeContext = createContext<CodeContextType | undefined>(undefined);
const DEFAULT_CODE = '';


export function CodeProvider({children}: React.PropsWithChildren) {
  // Register python features usable in blockly / code editor
  const textToBlocks = new TextToBlocks(Blockly, python, Sk);
  for (const ast of defaultAstList) {
    textToBlocks.registerAst(ast);
  }

  // Manage code state for entire context
  // Editors send updates to context, which proliferate to other editors
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  useEffect(() => {console.log(code)}, [code])

  return <CodeContext.Provider value={{code, setCode}}>{children}</CodeContext.Provider>
}

// eslint-disable-next-line
export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) throw new Error("Use useCode hook inside CodeProvider.");
  return context;
}
