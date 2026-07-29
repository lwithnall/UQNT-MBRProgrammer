// import { OverlayIndicator } from './index';
import { Button } from '../../../components/Button';
import { widgets } from '../lib/constants';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { PointerSensor, PointerActivationConstraints, DragDropManager } from '@dnd-kit/dom';
import { useState, useRef } from 'react';
import { useStudio } from '../state';
import type { DropSide } from '../lib/types';

interface Rect {
  height: number;
  width: number;
  top: number;
  left: number;
}

/**
 * Manages Drag and Drop functionality of the application
 * Most notably:
 * - Positioning of overlay on hover
 * - Handles window creation / tab insertion on drop
 */
export function StudioDndManager({ children }: React.PropsWithChildren) {
  const [overlayRect, setOverlayRect] = useState<Rect | null>(null);
  const dropSide = useRef<DropSide | null>(null);

  const { widgetCount, windowFromId, spawnWindowFromWidget } = useStudio();

  /* Configure sensor properties for DragDropProvider */
  const sensors = [
    PointerSensor.configure({
      // Drag starts after the pointer moves 8px
      activationConstraints: [new PointerActivationConstraints.Distance({ value: 10 })],
    }),
  ];

  /* Manages state and overlay for hovering widgets over windows */
  const onDragMove = (event, manager) => {
    const source = manager.dragOperation;
    const target = manager.dragOperation.target;

    if (!target?.shape || !source.shape || target.data.type != 'window') {
      dropSide.current = null;
      setOverlayRect(null);
      return;
    }

    const targetCentre = target.shape.center;
    const sourceCentre = source.shape.current.center;
    const mousePos = source.position.current;

    if (!sourceCentre || !mousePos) return;

    const dx = mousePos.x - targetCentre.x;
    const dy = mousePos.y - targetCentre.y;

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { right, bottom, ...rect } = target.shape.boundingRectangle;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Inserting left or right of target
      rect.width /= 2;
      if (dx > 0) rect.left += rect.width;
      dropSide.current = dx > 0 ? 'right' : 'left';
    } else {
      // Inserting above or below target
      rect.height /= 2;
      if (dy > 0) rect.top += rect.height;
      dropSide.current = dy > 0 ? 'top' : 'bottom';
    }

    if (rect == overlayRect) return;
    setOverlayRect(rect);
  };

  // IGNORING MOVING LAST WIDGET INTO DIFFERENT SECTOR -> SHOULD DELETE WINDOW
  const onDragEnd = (event, manager: DragDropManager) => {
    setOverlayRect(null);

    // Not dropping on window, handled automatically by dnd-kit
    if (dropSide.current === null) return;

    const source = manager.dragOperation.source;
    const target = manager.dragOperation.target;
    if (!source || !target) return;

    if (source.data.path == target.data.path && widgetCount(target.id) == 1) {
      // Moving a windows last widget out deletes the window
      // If last widget is dropped inside its own window do nothing
      return;
    }

    const sourceWindow = windowFromId(source.id);
    if (!sourceWindow) return;

    spawnWindowFromWidget(
      source.id,
      sourceWindow,
      source.data.path,
      target.data.path,
      dropSide.current
    );
    dropSide.current = null;
  };

  return (
    <DragDropProvider sensors={sensors} onDragMove={onDragMove} onDragEnd={onDragEnd}>
      {children}
      <DragOverlay>
        {(source) => {
          const widget = widgets[source.id];
          if (!widget) return;
          return <Button icon={widget.icon}>{widget.displayName}</Button>;
        }}
      </DragOverlay>
      {overlayRect && <div style={overlayRect} className="overlay-indicator absolute z-999" />}
    </DragDropProvider>
  );
}
