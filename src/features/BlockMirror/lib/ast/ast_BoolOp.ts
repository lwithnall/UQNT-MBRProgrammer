import type { AstConversionInput, BlockRegistrationContext } from '../types';
import { BLOCK_COLOURS, boolopsBlocklyDisplay, PYGEN_BLANK } from '../constants';

function astBoolOp({ context: { textToBlocks }, node }: AstConversionInput) {
  const op = node.op;
  const values = node.values;
  let resultBlock = textToBlocks.convert(values[0], node);
  for (let i = 1; i < values.length; i += 1) {
    resultBlock = textToBlocks.createBlock(
      'ast_BoolOp',
      node.lineno,
      { OP: op.name },
      {
        A: resultBlock,
        B: textToBlocks.convert(values[i], node),
      },
      { inline: 'true' }
    );
  }
  return resultBlock;
}

export function registerBoolOp({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'ast_BoolOp',
      message0: '%1 %2 %3',
      args0: [
        { type: 'input_value', name: 'A' },
        { type: 'field_dropdown', name: 'OP', options: boolopsBlocklyDisplay },
        { type: 'input_value', name: 'B' },
      ],
      inputsInline: true,
      output: null,
      colour: BLOCK_COLOURS.LOGIC,
    },
  ]);

  python.pythonGenerator.forBlock['ast_BoolOp'] = function (block, generator) {
    const operator = block.getFieldValue('OP') === 'And' ? 'and' : 'or';
    const order = operator === 'and' ? python.Order.LOGICAL_AND : python.Order.LOGICAL_OR;
    const argument0 = generator.valueToCode(block, 'A', order) || PYGEN_BLANK;
    const argument1 = generator.valueToCode(block, 'B', order) || PYGEN_BLANK;
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, order];
  };

  textToBlocks.astRegistry['ast_BoolOp'] = astBoolOp;
}
