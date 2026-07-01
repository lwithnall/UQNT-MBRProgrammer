import { Button, type ButtonProps } from "@radix-ui/themes";
import { useSortable } from "@dnd-kit/react/sortable";
import { type IconType } from "react-icons";
import { type WidgetId } from "../lib";

export interface WidgetTabProps extends Omit<ButtonProps, "id"> {
  id: WidgetId,
  index: number,
  icon: IconType,
  label: string | null,
}

export function WidgetTab({id, index, label, icon: Icon, ...props}: WidgetTabProps) {
  const { ref, isDragging } = useSortable({id: id, index: index})

  return (
    <Button
      ref={ref}
      variant={isDragging ? "classic" : "outline"}
      id={String(id)}
      {...props}
    >
      {Icon && <Icon />}{label}
    </Button>
  )
}
