import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astYield({context: {textToBlocks}, node}: AstConversionInput) {
  const value = node.value;

  if (value == null) {
    return textToBlocks.createBlock("ast_Yield", node.lineno);
  } else {
    return textToBlocks.createBlock("ast_YieldFull", node.lineno, {}, {
      "VALUE": textToBlocks.convert(value, node)
    });
  }
}

export function registerYield({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "ast_YieldFull",
      "message0": "yield %1",
      "args0": [
        {"type": "input_value", "name": "VALUE"}
      ],
      "inputsInline": false,
      "output": null,
      "colour": BLOCK_COLOURS.FUNCTIONS,
    },
    {
      "type": "ast_Yield",
      "message0": "yield",
      "inputsInline": false,
      "output": null,
      "colour": BLOCK_COLOURS.FUNCTIONS,
    }
  ]);

  python.pythonGenerator.forBlock['ast_Yield'] = function() {
    return ["yield", python.Order.LAMBDA];
  };

  python.pythonGenerator.forBlock['ast_YieldFull'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', python.Order.LAMBDA) || PYGEN_BLANK;
    return ["yield " + value, python.Order.LAMBDA];
  };

  textToBlocks.astRegistry['ast_Yield'] = astYield;
}
