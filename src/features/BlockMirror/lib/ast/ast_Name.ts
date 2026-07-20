import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astName({context: {textToBlocks}, node}: AstConversionInput) {
  const id = node.id;
  if (id.v == PYGEN_BLANK) {
    return null;
  } else {
    return textToBlocks.createBlock('ast_Name', node.lineno, {
      "VAR": id.v
    });
  }
}

export function registerName({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  const mixin = {
    customContextMenu: function(options: Array<{enabled: boolean; text: string; callback?: () => void}>) {
      let name: string;
      if (!this.isInFlyout){
        let opposite_type: string, contextMenuMsg: string;
        if (this.type === 'ast_Name') {
          opposite_type = 'ast_Assign';
          contextMenuMsg = Blockly.Msg['VARIABLES_GET_CREATE_SET'];
        } else {
          opposite_type = 'ast_Name';
          contextMenuMsg = Blockly.Msg['VARIABLES_SET_CREATE_GET'];
        }

        const option = {enabled: this.workspace.remainingCapacity() > 0};
        name = this.getField('VAR').getText();
        option.text = contextMenuMsg.replace('%1', name);
        const xmlField = document.createElement('field');
        xmlField.setAttribute('name', 'VAR');
        xmlField.appendChild(document.createTextNode(name));
        const xmlBlock = document.createElement('block');
        xmlBlock.setAttribute('type', opposite_type);
        xmlBlock.appendChild(xmlField);
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
      } else {
        if (this.type === 'ast_Name' || this.type === 'variables_get_reporter'){
          const renameOption = {
            text: Blockly.Msg.RENAME_VARIABLE,
            enabled: true,
            callback: Blockly.Constants.Variables.RENAME_OPTION_CALLBACK_FACTORY(this)
          };
          name = this.getField('VAR').getText();
          const deleteOption = {
            text: Blockly.Msg.DELETE_VARIABLE.replace('%1', name),
            enabled: true,
            callback: Blockly.Constants.Variables.DELETE_OPTION_CALLBACK_FACTORY(this)
          };
          options.unshift(renameOption);
          options.unshift(deleteOption);
        }
      }
    }
  };

  Blockly.Extensions.registerMixin('contextMenu_variableSetterGetter_forBlockMirror', mixin);

  Blockly.defineBlocksWithJsonArray([{
    "type": "ast_Name",
    "message0": "%1",
    "args0": [
      {"type": "field_variable", "name": "VAR", "variable": "%{BKY_VARIABLES_DEFAULT_NAME}"}
    ],
    "output": null,
    "colour": BLOCK_COLOURS.VARIABLES,
    "extensions": ["contextMenu_variableSetterGetter_forBlockMirror"]
  }]);

  python.pythonGenerator.forBlock['ast_Name'] = function(block, generator) {
    const code = generator.getVariableName(block.getFieldValue('VAR'),
        Blockly.Variables.NAME_TYPE);
    return [code, python.Order.ATOMIC];
  };

  textToBlocks.astRegistry['ast_Name'] = astName;
}
