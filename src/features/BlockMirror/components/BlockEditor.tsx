import * as Blockly from 'blockly/core';
import * as python from 'blockly/python';
import { useCode } from './CodeContext';
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { BlockMirrorTextToBlocks } from '../lib/text_to_blocks';
import { DEFAULT_BLOCKLY_OPTIONS, SUPPORTED_BLOCKLY_EVENTS } from '../lib/constants';

export function BlockEditor() {
  const blocklyDiv = useRef<HTMLDivElement | null>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const textToBlocks = useMemo(() => new BlockMirrorTextToBlocks(), []);
  const { code, setCode } = useCode();

  /* If code value changes, update the blocks in this editor to match */
  useEffect(() => {
    if (workspace.current === null) return;
    Blockly.Events.disable(); // Avoid trigerring rerenders

    const result = textToBlocks.convertSource('__main__.py', code);
    try {
      console.log(result);
      const xml_code = Blockly.utils.xml.textToDom(result.xml);
      for (let i = 0, xmlChild; (xmlChild = xml_code.childNodes[i]); i++) {
        // @ts-expect-error - fix later or sum idk
        xmlChild.setAttribute('y', (xmlChild.getAttribute('line_number') ?? 1) * 100);
      }

      Blockly.Xml.clearWorkspaceAndLoadFromXml(xml_code, workspace.current);
      workspace.current.cleanUp();
    } catch (error) {
      console.error(error);
    }

    console.log('CODE UPDATE DONE');
    Blockly.Events.enable();
  }, [code, textToBlocks]);

  /*
   * When user updates blocks in editor, update CodeContext's code to match
   * Registered as change listener
   */
  const updatePythonFromBlocks = useCallback(
    (event?: Blockly.Events.Abstract) => {
      const ws = workspace.current;
      if (ws === null || ws.isDragging()) return;
      if (event === undefined || !SUPPORTED_BLOCKLY_EVENTS.has(event.type)) return;

      console.log('BLOCKS CHANGED -> UPDATING');
      const generatedCode = python.pythonGenerator.workspaceToCode(ws);
      setCode(generatedCode);
    },
    [setCode]
  );

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
    };
  }, [updatePythonFromBlocks]);

  return <div className="h-full w-full" ref={blocklyDiv} />;
}
