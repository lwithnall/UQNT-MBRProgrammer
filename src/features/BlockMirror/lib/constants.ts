import * as Blockly from 'blockly/core';
import DarkTheme from '@blockly/theme-dark';
import { toolbox } from './toolbox';

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

//'https://game-icons.net/icons/ffffff/000000/1x1/delapouite/labrador-head.png'
// const FULL_IMAGE_URL = /^(?:https?:\/\/[-a-zA-Z0-9@:%._\/\+~#=]+(?:png|jpg|jpeg|gif|svg)+)$/;
//const BLOB_IMAGE_URL = /(["'])(blob:null\/[A-Fa-f0-9-]+)\1/g;
//const REGULAR_IMAGE_URL = /(["'])((?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(?:png|jpg|jpeg|gif|svg)+)\1/g;
const STRING_IMAGE_URL =
  /((["'])(?:https?:\/\/[-a-zA-Z0-9@:%._\/\+~#=]+(?:png|jpg|jpeg|gif|svg)+)|(?:blob:null\/[A-Fa-f0-9-]+)|(?:data:image\/(?:png|jpg|jpeg|gif|svg\+xml|webp|bmp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2})\2)/g;
//const CONSTRUCTOR_IMAGE_URL = /(?:^|\W)(Image\((["'])((?:blob:null\/[A-Fa-f0-9-]+)|(?:(?:https?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+(?:png|jpg|jpeg|gif|svg)+))\2\))/g;
const CONSTRUCTOR_IMAGE_URL = /(?:^|\W)(Image\((["'])(.+?)\2\))/g;
export const REGEX_PATTERNS = {
  constructor: CONSTRUCTOR_IMAGE_URL,
  string: STRING_IMAGE_URL,
  none: false,
};
