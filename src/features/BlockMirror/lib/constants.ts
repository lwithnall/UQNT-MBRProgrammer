import * as Blockly from "blockly/core";
import DarkTheme from "@blockly/theme-dark"; 
import { toolbox } from "./toolbox";

/* CodeContext loads editors with this value */
export const DEFAULT_CODE = '';
/* Default options for BlockEditor */
export const DEFAULT_BLOCKLY_OPTIONS: Blockly.BlocklyOptions = {
  move: { scrollbars: { horizontal: true, vertical: true }, drag: true },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
    pinch: true,
  },
  trashcan: true,
  theme: DarkTheme,
  toolbox: toolbox,
};
export const SUPPORTED_BLOCKLY_EVENTS = new Set(
  [
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
  ].map((e) => e.toString())
);