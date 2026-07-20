import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astAttribute({context: {textToBlocks}, node}: AstConversionInput) {
  const value = node.value;
  const attr = node.attr;

  if (value._astname == "Name") {
    return textToBlocks.createBlock("ast_Attribute", node.lineno, {
      "VALUE": textToBlocks.Sk.ffi.remapToJs(value.id),
      "ATTR": textToBlocks.Sk.ffi.remapToJs(attr)
    });
  } else {
    return textToBlocks.createBlock("ast_AttributeFull", node.lineno, {
      "ATTR": textToBlocks.Sk.ffi.remapToJs(attr)
    }, {
      "VALUE": textToBlocks.convert(value, node)
    });
  }
}

export function registerAttribute({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "ast_AttributeFull",
      "lastDummyAlign0": "RIGHT",
      "message0": "%1 . %2",
      "args0": [
        {"type": "input_value", "name": "VALUE"},
        {"type": "field_input", "name": "ATTR", "text": "default"}
      ],
      "inputsInline": true,
      "output": null,
      "colour": BLOCK_COLOURS.OO,
    },
    {
      "type": "ast_Attribute",
      "message0": "%1 . %2",
      "args0": [
        {"type": "field_variable", "name": "VALUE", "variable": "variable"},
        {"type": "field_input", "name": "ATTR", "text": "attribute"}
      ],
      "inputsInline": true,
      "output": null,
      "colour": BLOCK_COLOURS.OO,
    }
  ]);

  python.pythonGenerator.forBlock['ast_Attribute'] = function(block, generator) {
    const value = generator.getVariableName(block.getFieldValue('VALUE'));
    const attr = block.getFieldValue('ATTR');
    const code = value + "." + attr;
    return [code, python.Order.MEMBER];
  };

  python.pythonGenerator.forBlock['ast_AttributeFull'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    const attr = block.getFieldValue('ATTR');
    const code = value + "." + attr;
    return [code, python.Order.MEMBER];
  };

  textToBlocks.astRegistry['ast_Attribute'] = astAttribute;
}
