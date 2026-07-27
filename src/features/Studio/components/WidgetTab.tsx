import { useSortable } from '@dnd-kit/react/sortable';
import { Button, type ButtonProps } from '../../../components/Button';
import { type IconType } from 'react-icons';
import { type WidgetId } from '../lib/types';
import { cn } from '../../../lib/utils';
import { tabCollisionPrio } from '../lib/constants';
import type { MosaicPath } from 'react-mosaic-component';

export interface WidgetTabProps extends ButtonProps {
  widgetId: WidgetId;
  index: number;
  icon: IconType;
  label: string | null;
  path: MosaicPath;
  selected?: boolean;
}

/**
 * WidgetTab
 * A sortable tab component representing a single widget inside a Studio window.
 * Used to move widgets between studio windows, and choose what content to render.
 * Uses sortable functionality of dnd-kit library to allow sorting.
 */
export function WidgetTab({
  widgetId,
  index,
  label,
  icon: Icon,
  path,
  selected = false,
  ...props
}: WidgetTabProps) {
  const { ref, isDragging } = useSortable({
    id: widgetId,
    collisionPriority: tabCollisionPrio,
    index: index,
    data: { type: 'widget', path: path },
  });
  return (
    <Button
      className={cn(isDragging ? 'opacity-50' : '', selected ? 'bg-selected' : '')}
      ref={ref}
      {...props}
    >
      {Icon && <Icon />}
      {label}
    </Button>
  );
}
