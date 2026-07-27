import { useDragDropMonitor } from '@dnd-kit/react';
import { useState } from 'react';

interface Rect {
  height: number;
  width: number;
  top: number;
  left: number;
}

/*
 * Overlay for drag operations, dependent on if drag target is a window or widget
 * - Window: drop will create new window, show where it will be positioned
 * - Widget: show where in tab list drop will insert the dragging tab into
 *
 * NOTE: Window drop determined on mouse position,
 *       while widget drop determined by source centre
 */
export function OverlayIndicator() {
  const [overlayRect, setOverlayRect] = useState<Rect | null>(null);

  useDragDropMonitor({
    onDragMove(event, manager) {
      const source = manager.dragOperation;
      const target = manager.dragOperation.target;
      if (!target?.shape || !source.shape) return;

      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { right, bottom, ...rect } = target.shape.boundingRectangle;

      // Getting overlay type and calculating where to put it
      const dropType = target.data.type;
      const targetCentre = target.shape.center;
      const sourceCentre = source.shape.current.center;
      const mousePos = source.position.current;

      if (!sourceCentre || !mousePos) return;

      if (dropType == 'window') {
        // Hovering over a window - find cardianl direction of window mouse is aligned with
        const dx = mousePos.x - targetCentre.x;
        const dy = mousePos.y - targetCentre.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          // Inserting to left or right of target
          rect.width /= 2;
          if (dx > 0) rect.left += rect.width;
        } else {
          // Inserting above or below target
          rect.height /= 2;
          if (dy > 0) rect.top += rect.height;
        }
      } else if (dropType == 'widget') {
        // Hovering over a widget - find which side of widget to insert into
        const targMiddle = targetCentre.x;
        const sourceMiddle = sourceCentre.x;
        if (sourceMiddle > targMiddle) {
          rect.left += rect.width;
          rect.width = 2;
        } else {
          // inserting left
          rect.width = 2;
          rect.left -= rect.width + 2;
        }
      } else {
        console.error('Invalid drop type supplied.');
        return;
      }

      if (rect == overlayRect) return;
      setOverlayRect(rect);
    },
    onDragEnd() {
      setOverlayRect(null);
    },
  });

  if (!overlayRect) return null;
  return <div style={overlayRect} className="overlay-indicator absolute z-999" />;
}
