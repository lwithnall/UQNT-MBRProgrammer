import * as Blockly from "blockly/core";
import { BlockMirrorTextToBlocks } from "../text_to_blocks";
import * as python from "blockly/python";
BlockMirrorTextToBlocks.BLOCKS.push({
    "type": "ast_Continue",
    "message0": "continue",
    "inputsInline": false,
    "previousStatement": null,
    "nextStatement": null,
    "colour": BlockMirrorTextToBlocks.COLOR.CONTROL,
});

python.pythonGenerator.forBlock['ast_Continue'] = function(block, generator) {
    return "continue\n";
};

BlockMirrorTextToBlocks.prototype['ast_Continue'] = function (node, parent) {
    return BlockMirrorTextToBlocks.create_block("ast_Continue", node.lineno);
};
