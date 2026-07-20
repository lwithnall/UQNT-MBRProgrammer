import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astStarred({context: {textToBlocks}, node}: AstConversionInput) {
  const value = node.value;
  return textToBlocks.createBlock('ast_Starred', node.lineno, {}, {
    "VALUE": textToBlocks.convert(value, node)
  }, {
    "inline": true
  });
}

export function registerStarred({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": 'ast_Starred',
    "message0": "*%1",
    "args0": [
      {"type": "input_value", "name": "VALUE"}
    ],
    "inputsInline": false,
    "output": null,
    "colour": BLOCK_COLOURS.VARIABLES
  }]);

  python.pythonGenerator.forBlock['ast_Starred'] = function(block, generator) {
    const order = python.Order.NONE;
    const argument1 = generator.valueToCode(block, 'VALUE', order) || PYGEN_BLANK;
    const code = "*" + argument1;
    return [code, order];
  };

  textToBlocks.astRegistry['ast_Starred'] = astStarred;
}
