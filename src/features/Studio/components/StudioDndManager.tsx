// import { OverlayIndicator } from './index';
import { Button } from '../../../components/Button';
import { widgets } from '../lib/constants';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import {
  PointerSensor,
  PointerActivationConstraints,
  DragDropManager,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  Feedback,
} from '@dnd-kit/dom';
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

  const {
    widgetCount,
    windowFromId,
    getWidgetIndex,
    changeWidgetIndex,
    spawnWindowFromWidget,
    transferWidget,
  } = useStudio();

  /* Configure sensor properties for DragDropProvider */
  const sensors = [
    PointerSensor.configure({
      // Drag starts after the pointer moves 8px
      activationConstraints: [new PointerActivationConstraints.Distance({ value: 10 })],
    }),
  ];

  const onDragOver = (event: DragOverEvent) => {
    // Prevent widget tab reordering when dragging over tab groups
    // Handled manually in onDragEnd function
    event.preventDefault();
  };

  /* Manages state and overlay for hovering widgets over windows */
  // @ts-expect-error - not using event var
  const onDragMove = (event: DragMoveEvent, manager: DragDropManager) => {
    const source = manager.dragOperation;
    const target = manager.dragOperation.target;

    if (!target?.shape || !source.shape) {
      dropSide.current = null;
      if (overlayRect) setOverlayRect(null);
      return;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { right, bottom, ...rect } = target.shape.boundingRectangle;
    const sourceCentre = source.shape.current.center;
    const targetCentre = target.shape.center;
    const mousePos = source.position.current;

    if (!mousePos) return;

    if (target.data.type === 'widget') {
      // Widget overlay
      const side = sourceCentre.x > targetCentre.x ? 'left' : 'right';
      dropSide.current = side;
      if (side == 'right') {
        rect.width = 2;
        rect.left -= rect.width + 2;
      } else {
        rect.left += rect.width;
        rect.width = 2;
      }
    } else {
      // Window overlay
      const dx = mousePos.x - targetCentre.x;
      const dy = mousePos.y - targetCentre.y;

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
    }

    if (rect == overlayRect) return;
    setOverlayRect(rect);
  };

  // IGNORING MOVING LAST WIDGET INTO DIFFERENT SECTOR -> SHOULD DELETE WINDOW
  // @ts-expect-error - not using event var
  const onDragEnd = (event: DragEndEvent, manager: DragDropManager) => {
    const drop = dropSide.current;
    setOverlayRect(null);
    dropSide.current = null;

    const source = manager.dragOperation.source;
    const target = manager.dragOperation.target;
    if (drop === null || !source || !target) return;

    const sourceWindow = windowFromId(source.id);
    const targetWindow = windowFromId(target.id);
    if (!sourceWindow || !targetWindow) return;

    if (target.data.type == 'window') {
      // Window drop, spawns new window and removes widget from source window
      if (source.data.path == target.data.path && widgetCount(target.id) == 1) {
        // Moving a windows last widget out deletes the window
        // If last widget is dropped inside its own window do nothing
        return;
      }

      spawnWindowFromWidget(source.id, sourceWindow, source.data.path, target.data.path, drop);
      return;
    }

    // Dragging widget into widget tab group
    if (drop != 'right' && drop != 'left') throw new Error('Invalid widget drop found.');
    const sourceIdx = getWidgetIndex(sourceWindow, source.id);
    const overIdx = getWidgetIndex(targetWindow, target.id);
    const modifier = drop === 'right' ? 0 : 1;
    let newIdx = overIdx + modifier;

    if (sourceWindow !== targetWindow) {
      // Transferring widget into a different window
      transferWidget(source.id, sourceWindow, targetWindow, source.data.path, newIdx);
      return;
    }

    if (sourceIdx != overIdx) {
      // Moving widget to new index
      // When dragging forward (activeIndex < overIndex), the removal of the
      // active widget shifts subsequent indices left by 1.
      // Since `newIndex` was calculated against the pre-removal indices,
      // we subtract 1 to compensate and insert at the correct position.
      newIdx -= sourceIdx < overIdx ? 1 : 0;
      changeWidgetIndex(sourceWindow, sourceIdx, newIdx);
    }

    // If here widget is being moved into same spoe (i.e. not moved at all)
    // Therefore - do nothing, yippee
  };

  return (
    <DragDropProvider
      sensors={sensors}
      onDragOver={onDragOver}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      // Remove drop animation, looks funky with it
      plugins={(defaults) => [...defaults, Feedback.configure({ dropAnimation: null })]}
    >
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
