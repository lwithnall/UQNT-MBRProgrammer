import { useDroppable } from '@dnd-kit/react';
import { MosaicWindow, type MosaicWindowProps } from 'react-mosaic-component';
import type { WindowId } from '../lib/types';
import { windowCollisionPrio } from '../lib/constants';

// Title will always be emtpy, remove from prop interface
export interface StudioWindowProps extends Omit<MosaicWindowProps<WindowId>, 'title'> {
  id: WindowId;
}

/**
 * StudioWindow
 * Basic window wrapper for the studio area. Wraps a mosaic window and registers it
 * as a droppable target within the Studio system.
 */
export function StudioWindow({ id, path, children, ...MosaicWindowProps }: StudioWindowProps) {
  const { ref } = useDroppable({
    id: id,
    collisionPriority: windowCollisionPrio,
    data: { type: 'window', path: path },
  });

  return (
    <MosaicWindow title="" path={path} {...MosaicWindowProps}>
      <div ref={ref} className="h-full w-full">
        {children}
      </div>
    </MosaicWindow>
  );
}
