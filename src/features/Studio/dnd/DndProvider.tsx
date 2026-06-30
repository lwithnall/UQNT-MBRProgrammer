import { DragDropProvider } from "@dnd-kit/react";
import { 
  DragDropManager,
  PointerSensor,
  PointerActivationConstraints 
} from "@dnd-kit/dom";
import { Debug } from "@dnd-kit/dom/plugins/debug"
import { onDragStart, onDragOver, onDragEnd, onDragMove } from "./handlers";
import { useMemo } from "react";

export function DndProvider({children}: React.PropsWithChildren) {

  // Memoised to avoid manager rerendering with component
  const manager = useMemo(
    () => new DragDropManager({
      // Includes pointer and keyboard sensors by default
      sensors: (defaults) => [
        ...defaults,
        PointerSensor.configure({
          activationConstraints: [
            // Distance constraint smoothes out animations
            new PointerActivationConstraints.Distance({value: 10}),
          ],
        }
        )
      ],

      // Includes ARIA, autoscroll, and cursor plugins by default
      plugins: (defaults) => [
        ...defaults,
        Debug
      ],

      // Don't want constraints on drag and drop movement
      modifiers: [],
    }), []
  );

  return (
    <>
      <DragDropProvider
        manager={manager}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
      >
        {children}
      </DragDropProvider>
    </>
  )

}
