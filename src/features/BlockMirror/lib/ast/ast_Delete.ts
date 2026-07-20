import type { Block } from "blockly";
import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

interface DeleteState {
  targets: number;
}
interface DeleteBlock extends Block {
  targetCount_: number;
}

function astDelete({context: {textToBlocks}, node}: AstConversionInput) {
  const targets = node.targets;

  return textToBlocks.createBlock("ast_Delete", node.lineno, {},
    textToBlocks.convertElements("TARGET", targets, node),
    {
      "inline": "true",
    }, {
      "@targets": targets.length
    });
}

export function registerDelete({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.Blocks['ast_Delete'] = {
    init: function() {
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(BLOCK_COLOURS.VARIABLES);
      this.targetCount_ = 1;

      this.appendDummyInput()
          .appendField("delete");
      this.updateShape_();
    },
    saveExtraState: function () {
      return { "targets": this.targetCount_ };
    },
    loadExtraState: function (state: DeleteState) {
      this.targetCount_ = state.targets;
      this.updateShape_();
    },
    updateShape_: function () {
      let i = 0;
      for (; i < this.targetCount_; i++) {
        if (!this.getInput('TARGET' + i)) {
          const input = this.appendValueInput('TARGET' + i);
          if (i !== 0) {
            input.appendField(',').setAlign(Blockly.inputs.Align.RIGHT);
          }
        }
      }
      while (this.getInput('TARGET' + i)) {
        this.removeInput('TARGET' + i);
        i++;
      }
    },
  };

  python.pythonGenerator.forBlock['ast_Delete'] = function(block, generator) {
    const aBlock = block as DeleteBlock;
    const elements = new Array(aBlock.targetCount_);
    for (let i = 0; i < aBlock.targetCount_; i++) {
      elements[i] = generator.valueToCode(aBlock, 'TARGET' + i, python.Order.NONE) || PYGEN_BLANK;
    }
    return 'del ' + elements.join(', ') + "\n";
  };

  textToBlocks.astRegistry['ast_Delete'] = astDelete;
}
