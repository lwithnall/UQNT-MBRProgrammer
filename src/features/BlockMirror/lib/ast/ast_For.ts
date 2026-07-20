import type { AstConversionInput, BlockRegistrationContext } from "../types";
import { BLOCK_COLOURS, PYGEN_BLANK } from "../constants";

function astFor({context: {textToBlocks}, node}: AstConversionInput) {
  const target = node.target;
  const iter = node.iter;
  const body = node.body;
  const orelse = node.orelse;

  let blockName = 'ast_For';
  const bodies: Record<string, unknown> = {'BODY': textToBlocks.convertBody(body, node)};

  if (orelse.length > 0) {
    blockName = "ast_ForElse";
    bodies['ELSE'] = textToBlocks.convertBody(orelse, node);
  }

  return textToBlocks.createBlock(blockName, node.lineno, {}, {
    "ITER": textToBlocks.convert(iter, node),
    "TARGET": textToBlocks.convert(target, node)
  }, {}, {}, bodies);
}

export function registerFor({Blockly, python, textToBlocks}: BlockRegistrationContext) {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "ast_For",
      "message0": "for each item %1 in list %2 : %3 %4",
      "args0": [
        { "type": "input_value", "name": "TARGET" },
        { "type": "input_value", "name": "ITER" },
        { "type": "input_dummy" },
        { "type": "input_statement", "name": "BODY" }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": BLOCK_COLOURS.CONTROL,
    },
    {
      "type": "ast_ForElse",
      "message0": "for each item %1 in list %2 : %3 %4 else: %5 %6",
      "args0": [
        { "type": "input_value", "name": "TARGET" },
        { "type": "input_value", "name": "ITER" },
        { "type": "input_dummy" },
        { "type": "input_statement", "name": "BODY" },
        { "type": "input_dummy" },
        { "type": "input_statement", "name": "ELSE" }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": BLOCK_COLOURS.CONTROL,
    }
  ]);

  const forGenerator = function(block: Blockly.Block, generator: Blockly.CodeGenerator) {
    const argument0 = generator.valueToCode(block, 'TARGET', python.Order.RELATIONAL) || PYGEN_BLANK;
    const argument1 = generator.valueToCode(block, 'ITER', python.Order.RELATIONAL) || PYGEN_BLANK;
    const branchBody = generator.statementToCode(block, 'BODY') || python.PASS;
    let code = 'for ' + argument0 + ' in ' + argument1 + ':\n' + branchBody;

    if (block.getInputTargetBlock('ELSE')) {
      const branchElse = generator.statementToCode(block, 'ELSE');
      if (branchElse) {
        code += 'else:\n' + branchElse;
      }
    }
    return code;
  };

  python.pythonGenerator.forBlock['ast_For'] = forGenerator;
  python.pythonGenerator.forBlock['ast_ForElse'] = forGenerator;

  textToBlocks.astRegistry['ast_For'] = astFor;
  textToBlocks.astRegistry['ast_ForElse'] = astFor;
}
