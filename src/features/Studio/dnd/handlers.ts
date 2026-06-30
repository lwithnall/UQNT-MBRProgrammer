import type { 
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/react";

const onDragStart = (event: DragStartEvent) => {
  console.log('Started dragging', event.operation.source?.id);
}

const onDragMove = (event: DragMoveEvent) => {
  const {position} = event.operation;
  console.log('Current position:', position);
}

const onDragOver = (event: DragOverEvent) => {
  const {source, target} = event.operation;
  console.log(`${source?.id} is over ${target?.id}`);
}

const onDragEnd = (event: DragEndEvent) => {
  const {source, target} = event.operation;
  if (target) {
    console.log(`Dropped ${source?.id} onto ${target?.id}`);
  }
}

export { onDragStart, onDragMove, onDragOver, onDragEnd };

