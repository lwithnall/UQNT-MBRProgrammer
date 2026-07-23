import { useSortable } from '@dnd-kit/react/sortable';
import { Button } from '../../../components/Button';
import { type IconType } from 'react-icons';
import { type WidgetId } from '../lib';

export interface WidgetTabProps {
  id: WidgetId;
  index: number;
  icon: IconType;
  label: string | null;
}

/**
 * WidgetTab
 * A sortable tab component representing a single widget inside a Studio window.
 * Used to move widgets between studio windows, and choose what content to render.
 * Uses sortable functionality of dnd-kit library to allow sorting.
 */
export function WidgetTab({ id, index, label, icon: Icon, ...props }: WidgetTabProps) {
  const { ref, isDragging } = useSortable({ id: id, index: index });
  return (
    <Button className={isDragging ? 'opacity-50' : ''} ref={ref} {...props}>
      {Icon && <Icon />}
      {label}
    </Button>
  );
}
