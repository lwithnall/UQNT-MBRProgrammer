import * as Blockly from "blockly/core";
import * as python from "blockly/python";
import { BLOCK_COLOURS, ANNOTATION_OPTIONS, PYGEN_BLANK } from "../constants"

/**
 * registerAnnAssignFull()
 */
export function registerAnnAssignFull() {
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
function registerAnnAssignBasic() {
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

export function registerAnnAssign() {
  // Used interchangably, should be registered together
  registerAnnAssignFull();
  registerAnnAssignBasic();


}