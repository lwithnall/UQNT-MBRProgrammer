import { useCode } from './CodeContext';
import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

export function CodeEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const { code, setCode } = useCode();

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    if (editor.getModel() === null) return;
    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const handleEditorChange = (value: string | undefined) => {
    // Update CodeContext's code val on change
    setCode(value ?? '');
  };

  return (
    <Editor
      height="100vh"
      defaultLanguage="python"
      theme="vs-dark"
      value={code ?? ''}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
    />
  );
}
