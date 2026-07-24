import type { TabInsertTarget } from '../lib/types';

export interface OverlayIndicatorProps {
  dropTarget: TabInsertTarget;
}

export function OverlayIndicator({ dropTarget }: OverlayIndicatorProps) {
  const { active, over } = useDndContext();

  if (!active) return;
  if (!over || !over.rect) return;
  const mosaicTarget = mosaicDropTargetPosition.current;

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { right, bottom, ...rect } = over.rect;

  if (mosaicTarget) {
    switch (mosaicTarget) {
      case MosaicDropTargetPosition.TOP:
        rect.height /= 2;
        break;
      case MosaicDropTargetPosition.BOTTOM:
        rect.top += rect.height / 2;
        rect.height /= 2;
        break;
      case MosaicDropTargetPosition.LEFT:
        rect.width /= 2;
        break;
      case MosaicDropTargetPosition.RIGHT:
        rect.left += rect.width / 2;
        rect.width /= 2;
        break;
    }
  } else if (dropTarget) {
    switch (dropTarget) {
      case 'left':
        rect.width = 2;
        rect.left -= rect.width + 2;
        break;
      case '':
        rect.left += rect.width;
        rect.width = 2;
        break;
    }
  }

  return <div style={rect} className="overlay-indicator absolute z-999" />;
}
