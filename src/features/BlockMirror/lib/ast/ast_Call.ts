/*
 * Block for calling a procedure with no return value
 */

import { BLOCK_COLOURS } from '../constants';
import type { BlockRegistrationContext } from '../types';

export function registerCall({ Blockly, python, textToBlocks }: BlockRegistrationContext) {
  Blockly.Blocks['ast_Call'] = {
    init: function () {
      this.inputsInline(true);
      this.givenColour_ = BLOCK_COLOURS.FUNCTIONS;
      this.arguments_ = [];
      this.argumentVarModels_ = [];
      this.argumentCount_ = 0;
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
      this.showParameterNames_ = false;
      this.returns_ = true;
      this.isMethod_ = false;
      this.name_ = null;
      this.message_ = 'function';
      this.premessage_ = '';
      this.module_ = '';
      this.updateShape_();
    },

    saveExtraState: function () {},
    loadExtraState: function () {},

    /**
     * Return name of procedure this block calls
     * @return {string} procedure name
     * @this Blockly.Block
     */
    getProcedureCall: function () {
      return this.name_;
    },

    /**
     * Notification that a procedure is renaming.
     * If the name matches this block's procedure, rename it.
     * Also rename if it was previously null.
     * @param {string} oldName Previous name of procedure.
     * @param {string} newName Renamed procedure.
     * @this Blockly.Block
     */
    renameProcedure: function (oldName: string, newName: string) {
      if (this.name_ === null || Blockly.Names.equals(oldName, this.name_)) {
        this.name_ = newName;
        this.updateShape_();
      }
    },

    /**
     * Notification that the procedure's parameters have changed.
     * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
     * @param {!Array.<string>} paramIds IDs of params (consistent for each
     *     parameter through the life of a mutator, regardless of param renaming),
     *     e.g. ['piua', 'f8b_', 'oi.o'].
     * @private
     * @this Blockly.Block
     */
    setProcedureParameters_: function (paramNames: string[], paramIds: string[]) {
      // Data structures:
      // this.arguments = ['x', 'y'] -> existing param names.
      // this.quarkIds_ = ['piua', 'f8b_'] -> existing param IDs.
      // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
      //     -> Look-up of paramIds to connections plugged into the call block.
      // NOTE: quarkConnections_ may include IDs that no longer exist, but
      //       which might reappear if a param is reattached in the mutator.
      const defBlock = Blockly.Procedures.getDefinition(this.getProcedureCall(), this.workspace);
      const mutatorOpen = defBlock && defBlock.mutator && defBlock.mutator.isVisible();
      if (!mutatorOpen) {
        this.quarkConnections_ = {};
        this.quarkIds_ = null;
      }
      if (!paramIds) {
        // Reset the quarks (a mutator is about to open).
        return false;
      }
      // Test arguments (arrays of strings) for changes. '\n' is not a valid
      // argument name character, so it is a valid delimiter here.
      if (paramNames.join('\n') == this.arguments_.join('\n')) {
        // No change.
        this.quarkIds_ = paramIds;
        return false;
      }
      if (paramIds.length !== paramNames.length) {
        throw RangeError('paramNames and paramIds must be the same length.');
      }
      this.setCollapsed(false);
      if (!this.quarkIds_) {
        // Initialize tracking for this block.
        this.quarkConnections_ = {};
        this.quarkIds_ = [];
      }
      // Switch off rendering while the block is rebuilt.
      var savedRendered = this.rendered;
      this.rendered = false;
      // Update the quarkConnections_ with existing connections.
      for (let i = 0; i < this.arguments_.length; i++) {
        var input = this.getInput('ARG' + i);
        if (input) {
          let connection = input.connection.targetConnection;
          this.quarkConnections_[this.quarkIds_[i]] = connection;
          if (mutatorOpen && connection && paramIds.indexOf(this.quarkIds_[i]) === -1) {
            // This connection should no longer be attached to this block.
            connection.disconnect();
            connection.getSourceBlock().bumpNeighbours_();
          }
        }
      }
      // Rebuild the block's arguments.
      this.arguments_ = [].concat(paramNames);
      this.argumentCount_ = this.arguments_.length;
      // And rebuild the argument model list.
      this.argumentVarModels_ = [];
      /*
            // acbart: Function calls don't create variables, what do they know?
            for (let i = 0; i < this.arguments_.length; i++) {
                let argumentName = this.arguments_[i];
                var variable = Blockly.Variables.getVariable(
                    this.workspace, null, this.arguments_[i], '');
                if (variable) {
                    this.argumentVarModels_.push(variable);
                }
            }*/

      this.updateShape_();
      this.quarkIds_ = paramIds;
      // Reconnect any child blocks.
      if (this.quarkIds_) {
        for (let i = 0; i < this.arguments_.length; i++) {
          var quarkId = this.quarkIds_[i];
          if (quarkId in this.quarkConnections_) {
            let connection = this.quarkConnections_[quarkId];
            if (!connection?.reconnect(this, 'ARG' + i)) {
              // Block no longer exists or has been attached elsewhere.
              delete this.quarkConnections_[quarkId];
            }
          }
        }
      }
      // Restore rendering and show the changes.
      this.rendered = savedRendered;
      if (this.rendered) {
        this.render();
      }
      return true;
    },
    updateShape_: function () {},
  };
}
