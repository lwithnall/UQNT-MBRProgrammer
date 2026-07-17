import type * as Blockly from "blockly/core";
import type * as python from "blockly/python";
import type { TextToBlocks } from "./textToBlocks";

export interface BlockRegistrationContext {
  Blockly: typeof Blockly;
  python: typeof python;
  textToBlocks: TextToBlocks;
}
