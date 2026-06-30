import { DragDropProvider } from "@dnd-kit/react";
import { Debug } from "@dnd-kit/dom/plugins/debug"
import { useStudio } from "../StudioContext";

function Studio() {
  const { studio } = useStudio();

  return (
    <DragDropProvider
      manager={}
    >
      {/* COMPONENTS HERE */}
    </DragDropProvider>
  )
}