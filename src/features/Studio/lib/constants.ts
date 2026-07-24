import type { WidgetMap, WindowMap, StudioState, WindowMosaicNode } from './types';
import { BlockEditor, CodeEditor } from '../../BlockMirror/components';
import { HelpWidget, InfoWidget } from '../../Pager';
import { FaCode, FaPuzzlePiece, FaExclamation, FaHandsHelping } from 'react-icons/fa';

/* Mapping between widgets and info required to render them */
export const widgets: WidgetMap = {
  info: {
    displayName: 'Info',
    icon: FaExclamation,
    content: InfoWidget,
  },
  help: {
    displayName: 'Help',
    icon: FaHandsHelping,
    content: HelpWidget,
  },
  blockly: {
    displayName: 'Blockly',
    icon: FaPuzzlePiece,
    content: BlockEditor,
  },
  code: {
    displayName: 'Code',
    icon: FaCode,
    content: CodeEditor,
  },
};

/*
 * Windows store widget tab groups used by the user to
 * switch to corresponding content (e.g. blockly editor div)
 */
export const defaultWindows: WindowMap = {
  win1: { widgets: ['blockly'], activeWidget: 'blockly' },
  win2: { widgets: ['info', 'help', 'code'], activeWidget: 'info' },
};

/* Default layout of studio windows */
export const defaultMosaicState: WindowMosaicNode = {
  type: 'split',
  direction: 'row',
  children: ['win1', 'win2'],
};

/* Default studio state */
export const defaultStudio: StudioState = {
  windows: defaultWindows,
  mosaic: defaultMosaicState,
};
