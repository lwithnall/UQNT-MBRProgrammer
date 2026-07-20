import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS } from "../constants";

function astNameConstant({context: {textToBlocks}, node}: AstConversionInput) {
  const value = node.value;
  const Sk = textToBlocks.Sk;

  if (value === Sk.builtin.none.none$) {
    return textToBlocks.createBlock('ast_NameConstantNone', node.lineno, {});
  } else if (value === Sk.builtin.bool.true$) {
    return textToBlocks.createBlock('ast_NameConstantBoolean', node.lineno, {
      "BOOL": 'TRUE'
    });
  } else if (value === Sk.builtin.bool.false$) {
    return textToBlocks.createBlock('ast_NameConstantBoolean', node.lineno, {
      "BOOL": 'FALSE'
    });
  }
}

export function registerNameConstant({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "ast_NameConstantNone",
      "message0": "None",
      "args0": [],
      "output": "None",
      "colour": BLOCK_COLOURS.LOGIC
    },
    {
      "type": "ast_NameConstantBoolean",
      "message0": "%1",
      "args0": [
        {
          "type": "field_dropdown", "name": "BOOL", "options": [
            ["True", "TRUE"],
            ["False", "FALSE"]
          ]
        }
      ],
      "output": "Boolean",
      "colour": BLOCK_COLOURS.LOGIC
    }
  ]);

  python.pythonGenerator.forBlock['ast_NameConstantBoolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
    return [code, python.Order.ATOMIC];
  };

  python.pythonGenerator.forBlock['ast_NameConstantNone'] = function() {
    return ['None', python.Order.ATOMIC];
  };

  textToBlocks.astRegistry['ast_NameConstant'] = astNameConstant;
}
