/*
 * Assert keyword implementation
 * Code examples:
 * - assert x > 5
 * - assert y < 2
 */

import type { AstConversionInput, BlockRegistrationContext } from '../types';
import { BLOCK_COLOURS, PYGEN_BLANK } from '../constants';

function astAssert({ context: { textToBlocks }, node }: AstConversionInput) {
  const test = node.test;
  const msg = node.msg;
  if (msg == null) {
    return textToBlocks.createBlock(
      'ast_Assert',
      node.lineno,
      {},
      {
        TEST: textToBlocks.convert(test, node),
      }
    );
  } else {
    return textToBlocks.createBlock(
      'ast_AssertFull',
      node.lineno,
      {},
      {
        TEST: textToBlocks.convert(test, node),
        MSG: textToBlocks.convert(msg, node),
      }
    );
  }
}

export function registerAssert({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'ast_AssertFull',
      message0: 'assert %1 %2',
      args0: [
        { type: 'input_value', name: 'TEST' },
        { type: 'input_value', name: 'MSG' },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.LOGIC,
    },
    {
      type: 'ast_Assert',
      message0: 'assert %1',
      args0: [{ type: 'input_value', name: 'TEST' }],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.LOGIC,
    },
  ]);

  python.pythonGenerator.forBlock['ast_Assert'] = function (block, generator) {
    const test = generator.valueToCode(block, 'TEST', python.Order.ATOMIC) || PYGEN_BLANK;
    return 'assert ' + test + '\n';
  };

  python.pythonGenerator.forBlock['ast_AssertFull'] = function (block, generator) {
    const test = generator.valueToCode(block, 'TEST', python.Order.ATOMIC) || PYGEN_BLANK;
    const msg = generator.valueToCode(block, 'MSG', python.Order.ATOMIC) || PYGEN_BLANK;
    return 'assert ' + test + ', ' + msg + '\n';
  };

  textToBlocks.astRegistry['ast_Assert'] = astAssert;
}
