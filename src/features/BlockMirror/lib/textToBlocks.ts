// @ts-nocheck
// i am NOT typing the Sk module stuff holy BORING

import { BlockRegistrationContext } from "../components/CodeContext";
import { default as Sk } from "../../../vendor/skulpt/main";

/* 
 * Default ast registration functions
 * TextToBlocks instance will support conversion for these blocks
 */
const astRegistrationFuncs: Array<(context: BlockRegistrationContext) => void> = [
  registerAnnAssign,
];

function registerBlocks(registerContext: BlockRegistrationContext) {
  astRegistrationFuncs.forEach((regfunc) => regfunc(registerContext));
}


/**
 * TextToBlocks
 * Class for converting python code to blockly blocks
 * Registers to use via constructor
 */
export class TextToBlocks {
  astRegistry: Record<string, (registerContext, node, parent) => void>;

  constructor(Blockly, python) {
    this.astRegistry = {};
    this.Sk = Sk;
    this.Blockly = Blockly;
    this.python = python;
  }

  /* */
  convert(node, parent) {
    let functionName = 'ast_' + node._astname;
    if (this.astRegistry[functionName] === undefined) {
      throw new Error("Could not find function: " + functionName);
    }
    node._parent = parent;
    return this.astRegistry[functionName](node, parent);
  }
}
