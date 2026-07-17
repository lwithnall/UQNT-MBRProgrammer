// @ts-nocheck

import { type BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, ANNOTATION_OPTIONS, PYGEN_BLANK } from "../constants"

/**
 * registerAnnAssignFull()
 */
function registerAnnAssignFull({Blockly, python}: BlockRegistrationContext) {
  const annAssignFullJson = {
    "message0": "set %1 : %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TARGET",
      },
      {
        "type": "input_value",
        "name": "ANNOTATION",
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BLOCK_COLOURS.VARIABLES
  }

  interface AnnAssignFullState {
    initialized: boolean;
  }

  Blockly.Blocks["ast_AnnAssignFull"] = {
    init: function () {
      this.jsonInit(annAssignFullJson);
      this.initialized_ = true;
      this.updateShape_();
    },
    saveExtraState: function () {
      return {"initialized": this.initialized_};
    },
    loadExtraState: function (state: AnnAssignFullState) {
      this.initialized_ = state["initialized"];
      this.updateShape_();
    },
    updateShape_: function () {
      if (this.initialized_ && !this.getInput("VALUE")) {
        this.appendValueInput("VALUE")
          .appendField("=")
          .setAlign(Blockly.inputs.Align.RIGHT);
      }
      if (!this.initialized_ && this.getInput("VALUE")) {
        this.removeInput("VALUE");
      }
    }
  }
  
  python.pythonGenerator.forBlock['ast_AnnAssignFull'] = function(block, generator) {
    let target = generator.valueToCode(block, 'TARGET', python.Order.NONE) || PYGEN_BLANK;
    let annotation = generator.valueToCode(block, 'ANNOTATION', python.Order.NONE) || PYGEN_BLANK;
    let value = "";
    if (this.initialized_) {
      value = " = " + generator.valueToCode(block, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    }
    return target + ": " + annotation + value + "\n";
  };
}

/**
 * registerAnnAssignBasic()
 */
function registerAnnAssignBasic({Blockly, python}: BlockRegistrationContext) {
  const annAssignJson = {
    "message0": "set %1 : %2 = %3",
    "args0": [
      {
        "type": "field_variable",
        "name": "TARGET",
      },
      {
        "type": "field_dropdown",
        "name": "ANNOTATION",
        "options": ANNOTATION_OPTIONS,
      },
      {
        "type": "value_input",
        "name": "VALUE",
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BLOCK_COLOURS.VARIABLES,
  }

  interface AnnAssignState {
    str: boolean;
    initialized: boolean;
  }

  Blockly.Blocks["ast_AnnAssign"] = {
    init: function() {
      this.jsonInit(annAssignJson);
      this.strAnnotations_ = false;
      this.initialized_ = true;
    },
    saveExtraState: function () {
      return { "str": this.strAnnotations_, "initialized": this.initialized_ };
    },
    loadExtraState: function (state: AnnAssignState) {
      this.strAnnotations_ = state.str;
      this.initialized_ = state.initialized;
      this.updateShape_();
    },
    updateShape_: function () {
      if (this.initialized_ && !this.getInput('VALUE')) {
        this.appendValueInput('VALUE')
          .appendField('=')
          .setAlign(Blockly.inputs.Align.RIGHT);
      }
      if (!this.initialized_ && this.getInput('VALUE')) {
        this.removeInput('VALUE');
      }
    }
  }

  python.pythonGenerator.forBlock['ast_AnnAssign'] = function(block, generator) {
    var target = generator.getVariableName(block.getFieldValue('TARGET'));
    let annotation = block.getFieldValue('ANNOTATION');
    if ("strAnnotations_" in block && block.strAnnotations_) {
      annotation = generator.quote_(annotation);
    }
    let value = "";
    if (this.initialized_) {
      value = " = " + generator.valueToCode(block, 'VALUE', python.Order.NONE) || PYGEN_BLANK;
    }
    return target + ": " + annotation + value + "\n";
  };
}

function astAnnAssign(node, parent) {
  let target = node.target;
  let annotation = node.annotation;
  let value = node.value;

  let values = {};
  let mutations = {'@initialized': false};
  if (value !== null) {
    values['VALUE'] = this.convert(value, node);
    mutations['@initialized'] = true;
  }

  // TODO: This controls whether the annotation is stored in __annotations__
  let simple = node.simple;
  let builtinAnnotation = this.getBuiltinAnnotation(annotation);

  if (target._astname === 'Name' && target.id.v !== python.pythonGenerator.blank && builtinAnnotation !== false) {
    mutations['@str'] = annotation._astname === 'Str'
    return BlockMirrorTextToBlocks.create_block("ast_AnnAssign", node.lineno, {
      'TARGET': target.id.v,
      'ANNOTATION': builtinAnnotation,
    },
    values,
    {
      "inline": "true",
    }, mutations);
  } else {
    values['TARGET'] = this.convert(target, node);
    values['ANNOTATION'] = this.convert(annotation, node);
    return BlockMirrorTextToBlocks.create_block("ast_AnnAssignFull", node.lineno, {},
      values,
      {
        "inline": "true",
      }, mutations);
  }
}


export function registerAnnAssign(context: BlockRegistrationContext) {
  // Should be registered together
  registerAnnAssignFull(context);
  registerAnnAssignBasic(context);

  context.textToBlocks.astRegistry['ast_AnnAssign'] = astAnnAssign;
}