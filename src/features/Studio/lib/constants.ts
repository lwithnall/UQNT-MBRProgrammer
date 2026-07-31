import type { WidgetMap, WindowMap, StudioState, WindowMosaicNode } from './types';
import { BlockEditor, CodeEditor } from '../../BlockMirror/components';
// import { HelpWidget, InfoWidget } from '../../Pager';
// import { Console } from '../../Console/Console';
import { FaCode, FaPuzzlePiece, FaExclamation, FaHandsHelping } from 'react-icons/fa';
import { CollisionPriority } from '@dnd-kit/abstract';
import { Pager } from '../../Pager/Pager';

/* Mapping between widgets and info required to render them */
export const widgets: WidgetMap = {
  info: {
    displayName: 'Info',
    icon: FaExclamation,
    content: Pager,
  },
  help: {
    displayName: 'Help',
    icon: FaHandsHelping,
    content: Pager,
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
  // console: {
  //   displayName: 'Console',
  //   icon: FaTerminal,
  //   content: Console,
  // },
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

export const windowCollisionPrio = CollisionPriority.Low;
export const tabCollisionPrio = CollisionPriority.High;
