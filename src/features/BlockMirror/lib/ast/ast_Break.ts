import type { AstConversionInput, BlockRegistrationContext } from '../types';
import { BLOCK_COLOURS } from '../constants';

function astBreak({ context: { textToBlocks }, node }: AstConversionInput) {
  return textToBlocks.createBlock('ast_Break', node.lineno);
}

export function registerBreak({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'ast_Break',
      message0: 'break',
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.CONTROL,
    },
  ]);

  python.pythonGenerator.forBlock['ast_Break'] = function () {
    return 'break\n';
  };

  textToBlocks.astRegistry['ast_Break'] = astBreak;
}
