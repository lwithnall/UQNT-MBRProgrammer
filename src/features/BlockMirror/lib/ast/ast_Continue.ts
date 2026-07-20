import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS } from "../constants";

function astContinue({context: {textToBlocks}, node}: AstConversionInput) {
  return textToBlocks.createBlock("ast_Continue", node.lineno);
}

export function registerContinue({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Continue",
    "message0": "continue",
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BLOCK_COLOURS.CONTROL,
  }]);

  python.pythonGenerator.forBlock['ast_Continue'] = function() {
    return "continue\n";
  };

  textToBlocks.astRegistry['ast_Continue'] = astContinue;
}
