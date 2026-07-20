import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astIfExp({context: {textToBlocks}, node}: AstConversionInput) {
  const test = node.test;
  const body = node.body;
  const orelse = node.orelse;

  return textToBlocks.createBlock("ast_IfExp", node.lineno, {}, {
    "TEST": textToBlocks.convert(test, node),
    "BODY": textToBlocks.convert(body, node),
    "ORELSE": textToBlocks.convert(orelse, node)
  });
}

export function registerIfExp({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_IfExp",
    "message0": "%1 if %2 else %3",
    "args0": [
      {"type": "input_value", "name": "BODY"},
      {"type": "input_value", "name": "TEST"},
      {"type": "input_value", "name": "ORELSE"}
    ],
    "inputsInline": true,
    "output": null,
    "colour": BLOCK_COLOURS.LOGIC
  }]);

  python.pythonGenerator.forBlock['ast_IfExp'] = function(block, generator) {
    const test = generator.valueToCode(block, 'TEST', python.Order.CONDITIONAL) || PYGEN_BLANK;
    const body = generator.valueToCode(block, 'BODY', python.Order.CONDITIONAL) || PYGEN_BLANK;
    const orelse = generator.valueToCode(block, 'ORELSE', python.Order.CONDITIONAL) || PYGEN_BLANK;
    return [body + " if " + test + " else " + orelse + "\n", python.Order.CONDITIONAL];
  };

  textToBlocks.astRegistry['ast_IfExp'] = astIfExp;
}
