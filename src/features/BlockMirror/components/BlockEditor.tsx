import { useEffect, useRef } from "react";
import { BlockMirror } from "../lib/src/block_mirror";

export function BlockEditor() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    const editor = new BlockMirror({ container: containerRef.current });

    editor.addChangeListener(function (event) {
        console.log('Change! Better save:', event);

    });
    // editor.setCode('x = f\'Hello {name} how are you {day!r}\'\nclass X:\n    """Hello world"""\ndef add(self, a, b):\n        a = 0\n        return a\n\nx = X()\nx.add(5,3)');

    const oldRef = containerRef.current;

    return () => {
      editor.blockEditor.workspace.dispose();
      oldRef.innerHTML = '';
      // oldRef.remove();
      console.log("initialise clean up protocol >:c");
    }
  }, [])

  return <div className="absolute h-full w-full" ref={containerRef} />;
}