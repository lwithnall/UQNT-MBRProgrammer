import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astYieldFrom({context: {textToBlocks}, node}: AstConversionInput) {
  const value = node.value;
  return textToBlocks.createBlock("ast_YieldFrom", node.lineno, {}, {
    "VALUE": textToBlocks.convert(value, node)
  });
}

export function registerYieldFrom({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_YieldFrom",
    "message0": "yield from %1",
    "args0": [
      {"type": "input_value", "name": "VALUE"}
    ],
    "inputsInline": false,
    "output": null,
    "colour": BLOCK_COLOURS.FUNCTIONS,
  }]);

  python.pythonGenerator.forBlock['ast_YieldFrom'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', python.Order.LAMBDA) || PYGEN_BLANK;
    return ["yield from " + value, python.Order.LAMBDA];
  };

  textToBlocks.astRegistry['ast_YieldFrom'] = astYieldFrom;
}
