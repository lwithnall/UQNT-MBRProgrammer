import { type AstConversionInput, type BlockRegistrationContext } from "../types";
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
    const target = generator.valueToCode(block, 'TARGET', python.Order.NONE) || PYGEN_BLANK;
    const annotation = generator.valueToCode(block, 'ANNOTATION', python.Order.NONE) || PYGEN_BLANK;
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
        "type": "input_value",
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
    const target = generator.getVariableName(block.getFieldValue('TARGET'));
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

function astAnnAssign({context: {textToBlocks}, node, parent}: AstConversionInput) {
  const target = node.target;
  const annotation = node.annotation;
  const value = node.value;

  const values = {};
  const mutations = {'@initialized': false};
  if (value !== null) {
    values['VALUE'] = textToBlocks.convert(value, node);
    mutations['@initialized'] = true;
  }

  // TODO: This controls whether the annotation is stored in __annotations__
  // const simple = node.simple;
  
  const builtinAnnotation = textToBlocks.getBuiltinAnnotation(annotation);

  if (target._astname === 'Name' && target.id.v !== PYGEN_BLANK && builtinAnnotation !== false) {
    mutations['@str'] = annotation._astname === 'Str'
    return textToBlocks.create_block("ast_AnnAssign", node.lineno, {
      'TARGET': target.id.v,
      'ANNOTATION': builtinAnnotation,
    },
    values,
    {
      "inline": "true",
    }, mutations);
  } else {
    values['TARGET'] = textToBlocks.convert(target, node);
    values['ANNOTATION'] = textToBlocks.convert(annotation, node);
    return textToBlocks.create_block("ast_AnnAssignFull", node.lineno, {},
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