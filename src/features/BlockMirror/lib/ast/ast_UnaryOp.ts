import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

const UNARYOPS = [
  ["+", "UAdd"],
  ["-", "USub"],
  ["not", "Not"],
  ["~", "Invert"],
];

function astUnaryOp({context: {textToBlocks}, node}: AstConversionInput) {
  const op = node.op.name;
  const operand = node.operand;

  return textToBlocks.createBlock('ast_UnaryOp' + op, node.lineno, {}, {
    "VALUE": textToBlocks.convert(operand, node)
  }, {
    "inline": false
  });
}

export function registerUnaryOp({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  const blocks = UNARYOPS.map(function (unaryop) {
    return {
      "type": "ast_UnaryOp" + unaryop[1],
      "message0": unaryop[0] + " %1",
      "args0": [
        {"type": "input_value", "name": "VALUE"}
      ],
      "inputsInline": false,
      "output": null,
      "colour": (unaryop[1] === 'Not' ? BLOCK_COLOURS.LOGIC : BLOCK_COLOURS.MATH)
    };
  });

  Blockly.defineBlocksWithJsonArray(blocks);

  UNARYOPS.forEach(function (unaryop) {
    const fullName = "ast_UnaryOp" + unaryop[1];
    python.pythonGenerator.forBlock[fullName] = function (block, generator) {
      const order = (unaryop[1] === 'Not' ? python.Order.LOGICAL_NOT : python.Order.UNARY_SIGN);
      const argument1 = generator.valueToCode(block, 'VALUE', order) || PYGEN_BLANK;
      const code = unaryop[0] + (unaryop[1] === 'Not' ? ' ' : '') + argument1;
      return [code, order];
    };
  });

  textToBlocks.astRegistry['ast_UnaryOp'] = astUnaryOp;
}
