import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS } from "../constants";

function astComment({context: {textToBlocks}, node, parent}: AstConversionInput) {
  // Called with comment text as node when invoked from convertBody
  const txt = typeof node === 'string' ? node : node;
  const lineno = parent ?? 0;
  const commentText = txt.slice(1);
  return textToBlocks.createBlock("ast_Comment", lineno, {
    "BODY": commentText
  });
}

export function registerComment({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Comment",
    "message0": "# Comment: %1",
    "args0": [{"type": "field_input", "name": "BODY", "text": "will be ignored"}],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BLOCK_COLOURS.PYTHON,
  }]);

  python.pythonGenerator.forBlock['ast_Comment'] = function(block) {
    const text_body = block.getFieldValue('BODY');
    return '#'+text_body+'\n';
  };

  textToBlocks.astRegistry['ast_Comment'] = astComment;
}
