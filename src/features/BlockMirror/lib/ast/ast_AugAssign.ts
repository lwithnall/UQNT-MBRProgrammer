import type { Block } from 'blockly';
import type { BlockRegistrationContext, AstConversionInput } from '../types';
import {
  BINOPS_SIMPLE,
  binopsAugassignDisplay,
  binopsAugassignDisplayFull,
  binopsAugassignPreposition,
  binopsBlocklyGenerate,
  BLOCK_COLOURS,
  PYGEN_BLANK,
} from '../constants';

interface AugAssignState {
  simple: boolean;
  options: boolean;
  preposition: string;
}
interface AugAssignBlock extends Block {
  simpleTarget_: boolean;
  allOptions_: boolean;
  initialPreposition_: string;
}

function astAugAssign({ context: { textToBlocks }, node }: AstConversionInput) {
  const target = node.target;
  const op = node.op.name;
  const value = node.value;

  const values = { VALUE: textToBlocks.convert(value, node) };
  const fields = { OP_NAME: op };
  const simpleTarget = target._astname === 'Name';
  if (simpleTarget) {
    fields['VAR'] = textToBlocks.Sk.ffi.remapToJs(target.id);
  } else {
    values['TARGET'] = textToBlocks.convert(value, node);
  }

  const preposition = op;
  const allOptions = BINOPS_SIMPLE.indexOf(op) === -1;

  return textToBlocks.createBlock(
    'ast_AugAssign',
    node.lineno,
    fields,
    values,
    {
      inline: 'true',
    },
    {
      '@options': allOptions,
      '@simple': simpleTarget,
      '@preposition': preposition,
    }
  );
}

export function registerAugAssign({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.Blocks['ast_AugAssign'] = {
    init: function () {
      this.simpleTarget_ = true;
      this.allOptions_ = false;
      this.initialPreposition_ = 'by';
      this.appendDummyInput('OP')
        .appendField(
          new Blockly.FieldDropdown(
            () => {
              return this.allOptions_ ? binopsAugassignDisplayFull : binopsAugassignDisplay;
            },
            (val: string) => {
              this.sourceBlock_.updatePreposition_(val);
            }
          ),
          'OP_NAME'
        )
        .appendField(' ');
      this.appendDummyInput('PREPOSITION_ANCHOR')
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField('by', 'PREPOSITION');
      this.appendValueInput('VALUE');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLOURS.VARIABLES);
      this.updateShape_();
      this.updatePreposition_(this.initialPreposition_);
    },
    saveExtraState: function () {
      return {
        simple: this.simpleTarget_,
        options: this.allOptions_,
        preposition: this.initialPreposition_,
      };
    },
    loadExtraState: function (state: AugAssignState) {
      this.simpleTarget_ = state.simple;
      this.allOptions_ = state.options;
      this.initialPreposition_ = state.preposition;
    },
    updatePreposition_: function (value: string) {
      const preposition = binopsAugassignPreposition[value];
      this.setFieldValue(preposition, 'PREPOSITION');
    },
    updateShape_: function () {
      // Add new inputs.
      this.getField('OP_NAME').getOptions(false);
      if (this.simpleTarget_) {
        if (!this.getInput('VAR_ANCHOR')) {
          this.appendDummyInput('VAR_ANCHOR').appendField(
            new Blockly.FieldVariable('variable'),
            'VAR'
          );
          this.moveInputBefore('VAR_ANCHOR', 'PREPOSITION_ANCHOR');
        }
        if (this.getInput('TARGET')) {
          this.removeInput('TARGET');
        }
      } else {
        if (this.getInput('VAR_ANCHOR')) {
          this.removeInput('VAR_ANCHOR');
        }
        if (!this.getInput('TARGET')) {
          this.appendValueInput('TARGET');
          this.moveInputBefore('TARGET', 'PREPOSITION_ANCHOR');
        }
      }
    },
  };

  python.pythonGenerator.forBlock['ast_AugAssign'] = function (block, generator) {
    const aaBlock = block as AugAssignBlock;

    // Create a list with any number of elements of any type.
    let target;
    if (aaBlock.simpleTarget_) {
      target = generator.getVariableName(aaBlock.getFieldValue('VAR'));
    } else {
      target = generator.valueToCode(block, 'TARGET', python.Order.NONE) || PYGEN_BLANK;
    }

    const operator = binopsBlocklyGenerate[aaBlock.getFieldValue('OP_NAME')][0];
    const value = generator.valueToCode(aaBlock, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    return target + operator + '= ' + value + '\n';
  };

  textToBlocks.astRegistry['ast_AugAssign'] = astAugAssign;
}
