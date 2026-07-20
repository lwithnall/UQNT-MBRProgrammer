import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astExpr({context: {textToBlocks}, node, parent}: AstConversionInput) {
  const value = node.value;
  const converted = textToBlocks.convert(value, node);

  if (converted.constructor === Array) {
    return converted[0];
  } else if (textToBlocks.isTopLevel(parent)) {
    return [textToBlocks.convert(value, node)];
  } else {
    return textToBlocks.createBlock("ast_Expr", node.lineno, {}, {
      "VALUE": textToBlocks.convert(value, node)
    });
  }
}

export function registerExpr({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Expr",
    "message0": "do nothing with %1",
    "args0": [
      {"type": "input_value", "name": "VALUE"}
    ],
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BLOCK_COLOURS.PYTHON,
  }]);

  python.pythonGenerator.forBlock['ast_Expr'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', python.Order.ATOMIC) || PYGEN_BLANK;
    return value+"\n";
  };

  textToBlocks.astRegistry['ast_Expr'] = astExpr;
}
