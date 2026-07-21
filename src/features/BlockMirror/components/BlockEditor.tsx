import { useRef, useEffect, useCallback } from 'react';
import { useCode } from './CodeContext';

import * as Blockly from 'blockly/core';
import * as python from 'blockly/python';
import DarkTheme from '@blockly/theme-dark';
import * as enModule from 'blockly/msg/en';
import { toolbox } from '../tslib/toolbox';
import 'blockly/blocks';

// Set localisation to English
// enModule is CommonJS not an ESModule
const en = 'default' in enModule ? enModule.default : enModule;
Blockly.setLocale(en);

const DEFAULT_BLOCKLY_OPTIONS: Blockly.BlocklyOptions = {
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

// Store events as strings for later comparisons
const SUPPORTED_EVENTS = new Set(
  [
    Blockly.Events.BLOCK_CHANGE,
    Blockly.Events.BLOCK_CREATE,
    Blockly.Events.BLOCK_DELETE,
    Blockly.Events.BLOCK_MOVE,
  ].map((e) => e.toString())
);

export function BlockEditor(blocklyOptions?: Blockly.BlocklyOptions) {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);

  const { code, setCode } = useCode();
  console.log(code); // just here to get rid of warning

  /* Update blockly workspace code on init / when other editors change it */
  // const updateBlocksFromPython = () => {}

  /* Convert blocks in workspace to code if param is a supported event */
  const updatePythonFromBlocks = useCallback(
    (event?: Blockly.Events.Abstract) => {
      const ws = workspace.current;
      if (ws === null || ws.isDragging()) return;
      if (event === undefined || !SUPPORTED_EVENTS.has(event.type)) return;

      const generatedCode = python.pythonGenerator.workspaceToCode(ws);
      setCode(generatedCode);
    },
    [setCode]
  );

  /* Inject blockly workspace into div with resizing capabilities */
  useEffect(() => {
    if (!blocklyDiv.current) return;
    const ws = Blockly.inject(blocklyDiv.current, {
      // THIS SHOULD BE A DEEP COPY //////////////////////////////////////////////////////////////////////////
      ...DEFAULT_BLOCKLY_OPTIONS,
      ...blocklyOptions,
    });

    workspace.current = ws;
    ws.addChangeListener(updatePythonFromBlocks);

    // Make workspace constantly resize to fit blocklyDiv
    const resizeObserver = new ResizeObserver(() => {
      Blockly.svgResize(ws);
    });
    resizeObserver.observe(blocklyDiv.current);

    return () => {
      resizeObserver.disconnect();
      ws.removeChangeListener(updatePythonFromBlocks);
      ws.dispose();
      workspace.current = null;
    };
  }, [blocklyOptions, updatePythonFromBlocks]);

  return <div className="h-full w-full" ref={blocklyDiv} />;
}
