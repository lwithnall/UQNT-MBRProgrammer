// CSS
// <link rel="stylesheet" href="../lib/codemirror/codemirror.css">

// TODO: check skulpt files to see how they do these imports

//BlockMirrorTextEditor = require('./text_editor.js');

//BlockMirror = require('./block_mirror.js');

//module.exports = BlockMirror.BlockMirror;

/*

// Blockly
require('../../blockly/blockly_compressed.js');
require('../../blockly/blocks_compressed.js');
require('../../blockly/msg/js/en.js');
require('../../blockly/python_compressed.js');

// CodeMirror
require('../lib/codemirror/codemirror.js');



require('./text_editor.js');
require('./block_editor.js');
require('./blockly_shims.js');
require('./text_to_blocks.js');

require('./block_mirror.js');

require('./text_to_blocks.js');

    <!-- CodeMirror -->

    <script src="" type="text/javascript"></script>
    <script src="../lib/codemirror/python.js" type="text/javascript"></script>

    <!-- Skulpt -->
    <script src="../../skulpt/dist/skulpt.js" type="text/javascript"></script>
    <script src="../../skulpt/dist/skulpt-stdlib.js" type="text/javascript"></script>

    <!-- BlockMirror -->
    <link rel="stylesheet" href="../src/block_mirror.css">
    <script src="../src/blockly_shims.js" type="text/javascript"></script>
    <script src="../src/block_mirror.js" type="text/javascript"></script>
    <script src="../src/text_editor.js" type="text/javascript"></script>
    <script src="../src/block_editor.js" type="text/javascript"></script>
    <script src="../src/text_to_blocks.js" type="text/javascript"></script>
    <script src="../src/ast/ast_functions.js" type="text/javascript"></script>

    <script src="../src/ast/ast_For.js" type="text/javascript"></script>
    <script src="../src/ast/ast_If.js" type="text/javascript"></script>
    <script src="../src/ast/ast_While.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Num.js" type="text/javascript"></script>
    <script src="../src/ast/ast_BinOp.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Name.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Assign.js" type="text/javascript"></script>
    <script src="../src/ast/ast_AnnAssign.js" type="text/javascript"></script>
    <script src="../src/ast/ast_AugAssign.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Str.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Expr.js" type="text/javascript"></script>
    <script src="../src/ast/ast_UnaryOp.js" type="text/javascript"></script>
    <script src="../src/ast/ast_BoolOp.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Compare.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Assert.js" type="text/javascript"></script>
    <script src="../src/ast/ast_NameConstant.js" type="text/javascript"></script>
    <script src="../src/ast/ast_List.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Tuple.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Set.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Dict.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Starred.js" type="text/javascript"></script>
    <script src="../src/ast/ast_IfExp.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Attribute.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Call.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Raise.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Delete.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Subscript.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Comp.js" type="text/javascript"></script>
    <script src="../src/ast/ast_FunctionDef.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Lambda.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Return.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Yield.js" type="text/javascript"></script>
    <script src="../src/ast/ast_YieldFrom.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Global.js" type="text/javascript"></script>
    <!--<script src="../src/ast/ast_Nonlocal.js" type="text/javascript"></script>-->
    <script src="../src/ast/ast_Break.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Continue.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Try.js" type="text/javascript"></script>
    <script src="../src/ast/ast_ClassDef.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Import.js" type="text/javascript"></script>
    <script src="../src/ast/ast_With.js" type="text/javascript"></script>
    <script src="../src/ast/ast_Comment.js" type="text/javascript"></script>

 */

import { BlockMirrorTextToBlocks } from "./text_to_blocks";

import "./ast/ast_AnnAssign";
import "./ast/ast_Assert";
import "./ast/ast_Assign";
import "./ast/ast_Attribute";
import "./ast/ast_AugAssign";
import "./ast/ast_BinOp";
import "./ast/ast_BoolOp";
import "./ast/ast_Break";
import "./ast/ast_Call";
import "./ast/ast_ClassDef";
import "./ast/ast_Comment";
import "./ast/ast_Comp";
import "./ast/ast_Compare";
import "./ast/ast_Continue";
import "./ast/ast_Delete";
import "./ast/ast_Dict";
import "./ast/ast_Expr";
import "./ast/ast_For";
import "./ast/ast_FunctionDef";
import "./ast/ast_functions";
import "./ast/ast_Global";
import "./ast/ast_If";
import "./ast/ast_IfExp";
import "./ast/ast_Import";
import "./ast/ast_JoinedStr";
import "./ast/ast_Lambda";
import "./ast/ast_List";
import "./ast/ast_Name";
import "./ast/ast_NameConstant";
import "./ast/ast_Nonlocal";
import "./ast/ast_Num";
import "./ast/ast_Raise";
import "./ast/ast_Raw";
import "./ast/ast_Return";
import "./ast/ast_Set";
import "./ast/ast_Starred";
import "./ast/ast_Str";
import "./ast/ast_Subscript";
import "./ast/ast_Try";
import "./ast/ast_Tuple";
import "./ast/ast_UnaryOp";
import "./ast/ast_While";
import "./ast/ast_With";
import "./ast/ast_Yield";
import "./ast/ast_YieldFrom";

console.log(Blockly.Blocks);

