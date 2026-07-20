import {
  BLOCK_COLOURS,
  binopsBlocklyDisplayFull,
  binopsBlocklyDisplay,
  binopsBlocklyGenerate,
  PYGEN_BLANK,
  BINOPS_SIMPLE,
} from '../constants';
import type { AstConversionInput, BlockRegistrationContext } from '../types';

function astBinOp({ context: { textToBlocks }, node }: AstConversionInput) {
  const left = node.left;
  const op = node.op.name;
  const right = node.right;
  const blockName = BINOPS_SIMPLE.indexOf(op) >= 0 ? 'ast_BinOp' : 'ast_BinOpFull';

  return textToBlocks.createBlock(
    blockName,
    node.lineno,
    { OP: op },
    {
      A: textToBlocks.convert(left, node),
      B: textToBlocks.convert(right, node),
    },
    { inline: true }
  );
}

export function registerBinOps({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'ast_BinOpFull',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A' },
        { type: 'field_dropdown', name: 'OP', options: binopsBlocklyDisplayFull },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: null,
      colour: BLOCK_COLOURS.MATH,
    },
    {
      type: 'ast_BinOp',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A' },
        { type: 'field_dropdown', name: 'OP', options: binopsBlocklyDisplay },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: null,
      colour: BLOCK_COLOURS.MATH,
    },
  ]);

  python.pythonGenerator.forBlock['ast_BinOp'] = function (block, generator) {
    const tuple = binopsBlocklyGenerate[block.getFieldValue('OP')];
    const operator = tuple[0] + ' ';
    const order = tuple[1];
    const argument0 = generator.valueToCode(block, 'A', order) || PYGEN_BLANK;
    const argument1 = generator.valueToCode(block, 'B', order) || PYGEN_BLANK;
    const code = argument0 + operator + argument1;
    return [code, order];
  };

  textToBlocks.astRegistry['ast_BinOp'] = astBinOp;

  python.pythonGenerator.forBlock['ast_BinOpFull'] = python.pythonGenerator.forBlock['ast_BinOp'];
  textToBlocks.astRegistry['ast_BinOpFull'] = astBinOp;
}
