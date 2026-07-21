import * as Blockly from "blockly/core";
import * as python from "blockly/python";
import { useCode } from "./CodeContext";
import { useState, useRef, useCallback, useEffect } from "react";
import { DEFAULT_BLOCKLY_OPTIONS, SUPPORTED_BLOCKLY_EVENTS } from "../lib/constants";

export function BlockEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  // Are blocks updating from external input? - ignore change listeners if true 
  const [ externalUpdate, setExternalUpdate ] = useState<boolean>(false);
  const { code, setCode } = useCode();

  /* If code value changes, update the blocks in this editor to match */
  const updateBlocksFromPython = useCallback(() => {
    console.log('change detected - handle update');
    setExternalUpdate(false);
  }, []);  

  /* When user updates blocks in editor, update CodeContext's code to match */
  const updatePythonFromBlocks = useCallback(
    (event?: Blockly.Events.Abstract) => {
      const ws = workspace.current;
      if (ws === null || ws.isDragging() || externalUpdate) return;
      if (event === undefined || !SUPPORTED_BLOCKLY_EVENTS.has(event.type)) return;

      const generatedCode = python.pythonGenerator.workspaceToCode(ws);
      setCode(generatedCode);
    }, [setCode]
  )

  /* 
   * Inject blockly workspace into div (resizeable)
   * Implements change listener calling updatePythonFromBlocks() 
   */
  useEffect(() => {
    if (!blocklyDiv.current) return;
    const ws = Blockly.inject(blocklyDiv.current, DEFAULT_BLOCKLY_OPTIONS);
    ws.addChangeListener(updatePythonFromBlocks);
    const resizeObserver = new ResizeObserver(() => {
      Blockly.svgResize(ws);
    });
    resizeObserver.observe(blocklyDiv.current);

    workspace.current = ws;

    return () => {
      resizeObserver.disconnect();
      ws.removeChangeListener(updatePythonFromBlocks);
      ws.dispose();
      workspace.current = null;
    }
  }, [DEFAULT_BLOCKLY_OPTIONS, updatePythonFromBlocks]);

  /* Monitor and handle external code changes */
  useEffect(() => {
    setExternalUpdate(true);
    updateBlocksFromPython();
  }, [code]);

  return <div className="h-full w-full" ref={blocklyDiv} />;
}