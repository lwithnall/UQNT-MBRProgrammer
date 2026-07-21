import React from 'react';
import type { WidgetMap, WindowMap, MosaicState, StudioState } from './types';
import { FaCode, FaPuzzlePiece, FaExclamation, FaHandsHelping } from 'react-icons/fa';

const placeholderWidget = React.Component;

/*
 * Widget information
 * displayName and icon are used for the tab layout
 */
export const widgets: WidgetMap = {
  info: {
    displayName: 'Info',
    icon: FaExclamation,
    content: placeholderWidget,
  },
  help: {
    displayName: 'Help',
    icon: FaHandsHelping,
    content: placeholderWidget,
  },
  blockly: {
    displayName: 'Blockly',
    icon: FaPuzzlePiece,
    content: placeholderWidget,
  },
  code: {
    displayName: 'Code',
    icon: FaCode,
    content: placeholderWidget,
  },
};

/*
 * Multiple widgets can be accessible through a single window
 * Windows MUST have at least one widget, and an active widget selected
 */
export const defaultWindows: WindowMap = {
  win1: { widgets: ['blockly'], activeWidget: 'blockly' },
  win2: { widgets: ['info', 'help', 'code'], activeWidget: 'info' },
};

/**
 * Initial mosaic layout
 * State stored in binary tree, only allows 'first' and 'second' branches
 */
export const defaultMosaicState: MosaicState = {
  type: 'split',
  direction: 'row',
  children: ['win1', 'win2'],
};

/* Default workspace state for app */
export const defaultStudio: StudioState = {
  windows: defaultWindows,
  mosaic: defaultMosaicState,
};
