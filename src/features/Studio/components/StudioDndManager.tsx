// import { OverlayIndicator } from './index';
import { Button } from '../../../components/Button';
import { OverlayIndicator } from './OverlayIndicator';
import type { WidgetId } from '../lib/types';
import { widgets } from '../lib/constants';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { PointerSensor, PointerActivationConstraints } from '@dnd-kit/dom';
import { type DragStartEvent } from '@dnd-kit/abstract';
import { useState } from 'react';

export function StudioDndManager({ children }: React.PropsWithChildren) {
  // Id of widget being dragged, used to render overlay
  const [draggingId, setDraggingId] = useState<WidgetId | null>(null);

  /* Configure sensor properties for DragDropProvider */
  const sensors = [
    PointerSensor.configure({
      // Drag starts after the pointer moves 8px
      activationConstraints: [new PointerActivationConstraints.Distance({ value: 10 })],
    }),
  ];

  const onDragStart = (event: DragStartEvent) => {
    if (event.operation.source === null) return;
    setDraggingId(event.operation.source.id);
  };

  const onDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <DragDropProvider sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      {children}
      {draggingId && (
        <DragOverlay>
          <Button icon={widgets[draggingId].icon}>{widgets[draggingId].displayName}</Button>
        </DragOverlay>
      )}
      {draggingId && <OverlayIndicator />}
    </DragDropProvider>
  );
}
