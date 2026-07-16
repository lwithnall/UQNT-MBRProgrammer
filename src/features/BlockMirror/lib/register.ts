import * as Blockly from "blockly/core";
import * as python from "blockly/python";

import {registerAnnAssignFull, registerAnnAssign} from "./ast/ast_AnnAssign";


registerAnnAssignFull();
registerAnnAssign();
