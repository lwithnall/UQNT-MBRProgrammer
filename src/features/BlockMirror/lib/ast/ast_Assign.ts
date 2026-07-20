/*
 * Assignment operation
 * Code examples:
 * - x = 5
 * - testVar = "I'm a var! Or am I?"
 */

import type { Block } from 'blockly';
import { BLOCK_COLOURS, PYGEN_BLANK } from '../constants';
import type { AstConversionInput, BlockRegistrationContext } from '../types';

interface AssignState {
  targets: number;
  simple: boolean;
}
interface AssignBlock extends Block {
  targetCount_: number;
  simpleTarget_: boolean;
}

function astAssign({ context: { textToBlocks }, node }: AstConversionInput) {
  const targets = node.targets;
  const value = node.value;

  let values;
  const fields = {};
  const simpleTarget = targets.length === 1 && targets[0]._astname === 'Name';
  if (simpleTarget) {
    values = {};
    fields['VAR'] = textToBlocks.Sk.ffi.remapToJs(targets[0].id);
  } else {
    values = textToBlocks.convertElements('TARGET', targets, node);
  }
  values['VALUE'] = textToBlocks.convert(value, node);

  return textToBlocks.createBlock(
    'ast_Assign',
    node.lineno,
    fields,
    values,
    {
      inline: 'true',
    },
    {
      '@targets': targets.length,
      '@simple': simpleTarget,
    }
  );
}

export function registerAssign({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  const assignJson = {
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOURS.VARIABLES,
  };

  Blockly.Blocks['ast_Assign'] = {
    init: function () {
      this.jsonInit(assignJson);
      this.targetCount_ = 1;
      this.simpleTarget_ = true;
      this.updateShape_();
      Blockly.Extensions.apply('contextMenu_variableSetterGetter', this, false);
    },
    saveExtraState: function () {
      return { targets: this.targetCount_, simple: this.simpleTarget_ };
    },
    loadExtraState: function (state: AssignState) {
      this.targetCount_ = state.targets;
      this.simpleTarget_ = state.simple;
      this.updateShape_();
    },
    updateShape_: function () {
      if (!this.getInput('VALUE')) {
        this.appendDummyInput().appendField('set');
        this.appendValueInput('VALUE').appendField('=');
      }

      let i = 0;
      if (this.targetCount_ === 1 && this.simpleTarget_) {
        this.setInputsInline(true);
        if (!this.getInput('VAR_ANCHOR')) {
          this.appendDummyInput('VAR_ANCHOR').appendField(
            new Blockly.FieldVariable('variable'),
            'VAR'
          );
        }
        this.moveInputBefore('VAR_ANCHOR', 'VALUE');
      } else {
        this.setInputsInline(true);
        // Add new inputs.
        for (; i < this.targetCount_; i++) {
          if (!this.getInput('TARGET' + i)) {
            const input = this.appendValueInput('TARGET' + i);
            if (i !== 0) {
              input.appendField('and').setAlign(Blockly.inputs.Align.RIGHT);
            }
          }
          this.moveInputBefore('TARGET' + i, 'VALUE');
        }
        // Kill simple VAR
        if (this.getInput('VAR_ANCHOR')) {
          this.removeInput('VAR_ANCHOR');
        }
      }
      // Remove deleted inputs.
      while (this.getInput('TARGET' + i)) {
        this.removeInput('TARGET' + i);
        i++;
      }
    },
  };

  python.pythonGenerator.forBlock['ast_Assign'] = function (block, generator) {
    const aBlock = block as AssignBlock;

    // Create a list with any number of elements of any type.
    const value = generator.valueToCode(aBlock, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    const targets = new Array(aBlock.targetCount_);
    if (aBlock.targetCount_ === 1 && aBlock.simpleTarget_) {
      targets[0] = generator.getVariableName(aBlock.getFieldValue('VAR'));
    } else {
      for (let i = 0; i < aBlock.targetCount_; i++) {
        targets[i] = generator.valueToCode(aBlock, 'TARGET' + i, python.Order.NONE) || PYGEN_BLANK;
      }
    }
    return targets.join(' = ') + ' = ' + value + '\n';
  };

  textToBlocks.astRegistry['ast_Assign'] = astAssign;
}
