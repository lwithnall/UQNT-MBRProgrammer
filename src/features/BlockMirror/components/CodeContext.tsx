// // @ts-expect-error - I AM NOT ADDING TYPING FOR THIS THING AAAAAARRRRGHHH
// import * as Sk from '../../../vendor/skulpt/main';
import * as Blockly from 'blockly/core';
import * as enModule from 'blockly/msg/en';
// import * as python from 'blockly/python';
import { createContext, useContext, useState } from 'react';
import { DEFAULT_CODE } from '../lib/constants';

// MUST COME AFTER BLOCKLY AND PYTHON IMPORTS
// Registers blockly blocks / python generators / whatnot
import 'blockly/blocks';
import '../lib/astRegister';
import '../lib/blockly_shims';

/*
 * Hack-ish: should be en by default but throws error without this
 * quick fix and it works
 */
const en = 'default' in enModule ? enModule.default : enModule;
Blockly.setLocale(en);

/* Exposed code context API for external components */
interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
}
const CodeContext = createContext<CodeContextType | undefined>(undefined);

/**
 * Code context for studio workspace;
 * Handles set-up & synchronisation for block and code editors
 */
export function CodeProvider({ children }: React.PropsWithChildren) {
  // Code stade of studio, should be same between registered editors
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  // useEffect(() => {
  //   console.log(`Code updating too: ${code}`);
  // }, [code]);

  return <CodeContext.Provider value={{ code, setCode }}>{children}</CodeContext.Provider>;
}

// eslint-disable-next-line
export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) throw new Error('Use useCode hook inside CodeProvider.');
  return context;
}
