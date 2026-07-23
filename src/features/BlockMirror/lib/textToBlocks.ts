import { Block } from 'blockly';
import type {
  BlockRegistrationContext,
  BlocklyAPI,
  PythonAPI,
  astNode,
  SkAPI,
  AstRegisterFunc,
  AstConversionFunc,
} from './types';

/**
 * TextToBlocks
 * Class for converting python code to blockly blocks
 * Registers to use via constructor
 */
export class TextToBlocks {
  context: BlockRegistrationContext;
  Sk: SkAPI;
  astRegistry: Record<string, AstConversionFunc>;
  strictAnnotations: Array<string>;

  constructor(Blockly: BlocklyAPI, python: PythonAPI, Sk: SkAPI) {
    this.context = {
      Blockly: Blockly,
      python: python,
      textToBlocks: this,
    };
    this.Sk = Sk;
    this.astRegistry = {};
    this.strictAnnotations = []; // placeholder
  }

  registerAst(astfunc: AstRegisterFunc) {
    astfunc(this.context);
  }

  /* */
  convert(node: astNode, parent: astNode) {
    const functionName = 'ast_' + node._astname;
    if (this.astRegistry[functionName] === undefined) {
      throw new Error('Could not find function: ' + functionName);
    }
    const context = this.context;
    node._parent = parent;
    return this.astRegistry[functionName]({ context, node, parent });
  }

  /*  */
  convertElements() {}

  /*  */
  createBlock(type, lineNumber, fields?, values?, settings?, mutations?, statements?): Block {
    return 'Im a block :D';
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
