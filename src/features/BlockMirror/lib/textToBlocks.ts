import type { 
  BlockRegistrationContext, 
  BlocklyAPI, 
  PythonAPI, 
  SkAPI,
  astRegisterFunc
} from "./types";


/**
 * TextToBlocks
 * Class for converting python code to blockly blocks
 * Registers to use via constructor
 */
export class TextToBlocks {
  Blockly: BlocklyAPI;
  python: PythonAPI;
  Sk: SkAPI;
  astRegistry: Record<string, (node, parent) => void>;
  strictAnnotations: boolean;

  constructor(Blockly: BlocklyAPI, python: PythonAPI, Sk: SkAPI) {
    this.astRegistry = {};
    this.Blockly = Blockly;
    this.python = python;
    this.Sk = Sk;
  }

  registerAst(astfunc: astRegisterFunc) {
    const context: BlockRegistrationContext = {
      Blockly: this.Blockly, 
      python: this.python,
      textToBlocks: this
    };
    astfunc(context);
  }

  /* */
  convert(node, parent) {
    const functionName = 'ast_' + node._astname;
    if (this.astRegistry[functionName] === undefined) {
      throw new Error("Could not find function: " + functionName);
    }
    node._parent = parent;
    return this.astRegistry[functionName](node, parent);
  }

  /* */
  getBuiltinAnnotation(annotation) {
    let result = false;
    // Can we turn it into a basic type?
    if (annotation._astname === 'Name') {
        result = this.Sk.ffi.remapToJs(annotation.id);
    } else if (annotation._astname === 'Str') {
        result = this.Sk.ffi.remapToJs(annotation.s);
    }

    // Potentially filter out unknown annotations
    if (result !== false && this.strictAnnotations) {
        if (this.strictAnnotations.indexOf(result) !== -1) {
            return result;
        } else {
            return false;
        }
    } else {
        return result;
    }
  }
}
