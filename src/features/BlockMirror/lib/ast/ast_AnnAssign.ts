/*
 * Annotated assign implementation
 * Code examples:
 * - `x: int = 10`
 * - `y: string = "hello"`
 * - `obj.x : int`
 */

import type { AstConversionInput, BlockRegistrationContext } from '../types';
import { BLOCK_COLOURS, ANNOTATION_OPTIONS, PYGEN_BLANK } from '../constants';
import type { Block } from 'blockly';

interface AnnAssignState {
  str: boolean;
  initialized: boolean;
}
interface AnnAssignBlock extends Block {
  strAnnotations_: boolean;
  initialized_: boolean;
}
interface AnnAssignFullState {
  initialized: boolean;
}
interface AnnAssignFullBlock extends Block {
  initialized_: boolean;
}

/**
 * registerAnnAssignBasic
 * ----------------------
 * Basic annotated assign implementations
 */
function registerAnnAssignBasic({ Blockly, python }: BlockRegistrationContext) {
  const annAssignJson = {
    message0: 'set %1 : %2 = %3',
    args0: [
      {
        type: 'field_variable',
        name: 'TARGET',
      },
      {
        type: 'field_dropdown',
        name: 'ANNOTATION',
        options: ANNOTATION_OPTIONS,
      },
      {
        type: 'input_value',
        name: 'VALUE',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOURS.VARIABLES,
  };

  Blockly.Blocks['ast_AnnAssign'] = {
    init: function () {
      this.jsonInit(annAssignJson);
      this.strAnnotations_ = false;
      this.initialized_ = true;
    },
    saveExtraState: function () {
      return { str: this.strAnnotations_, initialized: this.initialized_ };
    },
    loadExtraState: function (state: AnnAssignState) {
      this.strAnnotations_ = state.str;
      this.initialized_ = state.initialized;
      this.updateShape_();
    },
    updateShape_: function () {
      if (this.initialized_ && !this.getInput('VALUE')) {
        // Typical block
        this.appendValueInput('VALUE').appendField('=').setAlign(Blockly.inputs.Align.RIGHT);
      }
      if (!this.initialized_ && this.getInput('VALUE')) {
        // Block generated from code without value input (e.g. `x: int`)
        this.removeInput('VALUE');
      }
    },
  };

  python.pythonGenerator.forBlock['ast_AnnAssign'] = function (block, generator) {
    const aBlock = block as AnnAssignBlock;
    const target = generator.getVariableName(aBlock.getFieldValue('TARGET'));
    let annotation = aBlock.getFieldValue('ANNOTATION');
    if (aBlock.strAnnotations_) {
      annotation = generator.quote_(annotation);
    }
    let value = '';
    if (aBlock.initialized_) {
      value = ' = ' + generator.valueToCode(aBlock, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    }
    return target + ': ' + annotation + value + '\n';
  };
}

/**
 * registerAnnAssignFull
 * ---------------------
 * Allows for more complex assignment operations
 * e.g. types not in ANNOTATION_OPTIONS list
 */
function registerAnnAssignFull({ Blockly, python }: BlockRegistrationContext) {
  const annAssignFullJson = {
    message0: 'set %1 : %2',
    args0: [
      {
        type: 'input_value',
        name: 'TARGET',
      },
      {
        type: 'input_value',
        name: 'ANNOTATION',
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: BLOCK_COLOURS.VARIABLES,
  };

  Blockly.Blocks['ast_AnnAssignFull'] = {
    init: function () {
      this.jsonInit(annAssignFullJson);
      this.initialized_ = true;
      this.updateShape_();
    },
    saveExtraState: function () {
      return { initialized: this.initialized_ };
    },
    loadExtraState: function (state: AnnAssignFullState) {
      this.initialized_ = state['initialized'];
      this.updateShape_();
    },
    updateShape_: function () {
      if (this.initialized_ && !this.getInput('VALUE')) {
        // Typical block instance
        this.appendValueInput('VALUE').appendField('=').setAlign(Blockly.inputs.Align.RIGHT);
      }
      if (!this.initialized_ && this.getInput('VALUE')) {
        // Block is converted from text without a VALUE input
        // e.g. code `x:int` generates block without value input
        this.removeInput('VALUE');
      }
    },
  };

  python.pythonGenerator.forBlock['ast_AnnAssignFull'] = function (block, generator) {
    const aBlock = block as AnnAssignFullBlock;
    const target = generator.valueToCode(aBlock, 'TARGET', python.Order.NONE) || PYGEN_BLANK;
    const annotation =
      generator.valueToCode(aBlock, 'ANNOTATION', python.Order.NONE) || PYGEN_BLANK;
    let value = '';
    if (aBlock.initialized_) {
      value = ' = ' + generator.valueToCode(block, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    }
    return target + ': ' + annotation + value + '\n';
  };
}

/**
 * astAnnAssign
 * ------------
 * Function to convert python code to a block
 */
function astAnnAssign({ context: { textToBlocks }, node }: AstConversionInput) {
  const target = node.target;
  const annotation = node.annotation;
  const value = node.value;

  const values = {};
  const mutations = { '@initialized': false };
  if (value !== null) {
    values['VALUE'] = textToBlocks.convert(value, node);
    mutations['@initialized'] = true;
  }

  // TODO: This controls whether the annotation is stored in __annotations__
  // const simple = node.simple;

  const builtinAnnotation = textToBlocks.getBuiltinAnnotation(annotation);

  if (target._astname === 'Name' && target.id.v !== PYGEN_BLANK && builtinAnnotation !== false) {
    mutations['@str'] = annotation._astname === 'Str';
    return textToBlocks.createBlock(
      'ast_AnnAssign',
      node.lineno,
      {
        TARGET: target.id.v,
        ANNOTATION: builtinAnnotation,
      },
      values,
      {
        inline: 'true',
      },
      mutations
    );
  } else {
    values['TARGET'] = textToBlocks.convert(target, node);
    values['ANNOTATION'] = textToBlocks.convert(annotation, node);
    return textToBlocks.createBlock(
      'ast_AnnAssignFull',
      node.lineno,
      {},
      values,
      {
        inline: 'true',
      },
      mutations
    );
  }
}

export function registerAnnAssign(context: BlockRegistrationContext) {
  // Should be registered together
  registerAnnAssignFull(context);
  registerAnnAssignBasic(context);

  context.textToBlocks.astRegistry['ast_AnnAssign'] = astAnnAssign;
}
