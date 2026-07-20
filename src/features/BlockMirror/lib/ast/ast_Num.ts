import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS } from "../constants";

function astNum({context: {textToBlocks}, node}: AstConversionInput) {
  const n = node.n;
  return textToBlocks.createBlock("ast_Num", node.lineno, {
    "NUM": textToBlocks.Sk.ffi.remapToJs(n)
  });
}

export function registerNum({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Num",
    "message0": "%1",
    "args0": [
      { "type": "field_number", "name": "NUM", "value": 0 }
    ],
    "output": "Number",
    "colour": BLOCK_COLOURS.MATH
  }]);

  python.pythonGenerator.forBlock['ast_Num'] = function(block) {
    let code = parseFloat(block.getFieldValue('NUM'));
    let order;
    if (code == Infinity) {
      code = 'float("inf")';
      order = python.pythonGenerator.ORDER_FUNCTION_CALL;
    } else if (code == -Infinity) {
      code = '-float("inf")';
      order = python.pythonGenerator.ORDER_UNARY_SIGN;
    } else {
      order = code < 0 ? python.pythonGenerator.ORDER_UNARY_SIGN :
              python.pythonGenerator.ORDER_ATOMIC;
    }
    return [code, order];
  };

  textToBlocks.astRegistry['ast_Num'] = astNum;
}
