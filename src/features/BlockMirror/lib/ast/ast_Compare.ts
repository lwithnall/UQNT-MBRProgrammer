import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

const COMPARES = [
  ["==", "Eq"],
  ["!=", "NotEq"],
  ["<", "Lt"],
  ["<=", "LtE"],
  [">", "Gt"],
  [">=", "GtE"],
  ["is", "Is"],
  ["is not", "IsNot"],
  ["in", "In"],
  ["not in", "NotIn"],
];

const COMPARES_GENERATE: Record<string, string> = {};
COMPARES.forEach(function (compare) {
  COMPARES_GENERATE[compare[1]] = compare[0];
});

function astCompare({context: {textToBlocks}, node}: AstConversionInput) {
  const ops = node.ops;
  const left = node.left;
  const values = node.comparators;
  let resultBlock = textToBlocks.convert(left, node);
  for (let i = 0; i < values.length; i += 1) {
    resultBlock = textToBlocks.createBlock("ast_Compare", node.lineno, {
      "OP": ops[i].name
    }, {
      "A": resultBlock,
      "B": textToBlocks.convert(values[i], node)
    }, {
      "inline": "true"
    });
  }
  return resultBlock;
}

export function registerCompare({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Compare",
    "message0": "%1 %2 %3",
    "args0": [
      {"type": "input_value", "name": "A"},
      {"type": "field_dropdown", "name": "OP", "options": COMPARES},
      {"type": "input_value", "name": "B"}
    ],
    "inputsInline": true,
    "output": null,
    "colour": BLOCK_COLOURS.LOGIC
  }]);

  python.pythonGenerator.forBlock['ast_Compare'] = function(block, generator) {
    const operator = ' ' + COMPARES_GENERATE[block.getFieldValue('OP')] + ' ';
    const order = python.Order.RELATIONAL;
    const argument0 = generator.valueToCode(block, 'A', order) || PYGEN_BLANK;
    const argument1 = generator.valueToCode(block, 'B', order) || PYGEN_BLANK;
    const code = argument0 + operator + argument1;
    return [code, order];
  };

  textToBlocks.astRegistry['ast_Compare'] = astCompare;
}
