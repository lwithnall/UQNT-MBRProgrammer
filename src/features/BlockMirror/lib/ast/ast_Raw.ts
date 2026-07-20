import type { BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS } from "../constants";

export function registerRaw({Blockly, python}: BlockRegistrationContext) {
  let multilineInputType = "field_multilinetext";

  if (!Blockly.registry.hasItem(Blockly.registry.Type.FIELD, multilineInputType)) {
    if (typeof registerFieldMultilineInput === "function") {
      registerFieldMultilineInput();
    } else {
      multilineInputType = "field_input";
    }
  }

  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Raw",
    "message0": "Code Block: %1 %2",
    "args0": [
      {"type": "input_dummy"},
      {"type": multilineInputType, "name": "TEXT", "value": ''}
    ],
    "colour": BLOCK_COLOURS.PYTHON,
    "previousStatement": null,
    "nextStatement": null,
  }]);

  python.pythonGenerator.forBlock['ast_Raw'] = function(block) {
    return block.getFieldValue('TEXT') + "\n";
  };
}
