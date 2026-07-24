import { Button } from '../../../components/Button';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import { type Sensors, type DragStartEvent } from '@dnd-kit/abstract';
import { useState } from 'react';
import { type WidgetId, type DropInsertTarget, widgets } from '../lib';
import { OverlayIndicator } from './OverlayIndicator';

export function StudioDndManager({ children }: React.PropsWithChildren) {
  // Id of widget being dragged, used to render overlay
  const [draggingId, setDraggingId] = useState<WidgetId | null>(null);
  const [dropTarget, setDropTarget] = useState<DropInsertTarget | null>(null);

  /* Configure sensor properties for DragDropProvider */
  const sensors = (defaults: Sensors) => {
    return [
      ...defaults.filter((sensor) => sensor !== PointerSensor),
      PointerSensor.configure({
        activationConstraints: [
          // Drag starts after the pointer moves 8px
          new PointerActivationConstraints.Distance({ value: 10 }),
        ],
      }),
    ];
  };

  const onCollision = () => {};

  const onDragStart = (event: DragStartEvent) => {
    if (event.operation.source === null) return;
    setDraggingId(event.operation.source.id);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <DragDropProvider
      sensors={sensors}
      onCollision={onCollision}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {children}
      {draggingId && (
        <DragOverlay>
          <Button icon={widgets[draggingId].icon}>{widgets[draggingId].displayName}</Button>
        </DragOverlay>
      )}
      {dropTarget && <OverlayIndicator dropTarget={dropTarget} />}
    </DragDropProvider>
  );
}
