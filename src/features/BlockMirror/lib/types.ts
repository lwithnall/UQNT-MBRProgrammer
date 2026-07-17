import type * as BlocklyModule from "blockly/core";
import type * as PythonModule from "blockly/python";
//@ts-expect-error - porting from old js module, I am NOT typing this thing
import type * as SkModule from "../../../vendor/skulpt/main";
import type { TextToBlocks } from "./textToBlocks";

export type BlocklyAPI = typeof BlocklyModule;
export type PythonAPI = typeof PythonModule;
export type SkAPI = typeof SkModule;

export interface BlockRegistrationContext {
  Blockly: BlocklyAPI;
  python: PythonAPI;
  textToBlocks: TextToBlocks;
}

export interface AstConversionInput {
  context: BlockRegistrationContext,
  // @ts-expect-error - same as earlier
  node,
  // @ts-expect-error - same as earlier and same as just then !!
  parent,
}

export type astRegisterFunc = (context: BlockRegistrationContext) => void;
