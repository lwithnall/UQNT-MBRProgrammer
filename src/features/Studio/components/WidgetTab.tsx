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


/**
 * WidgetTab
 * A sortable tab component representing a single widget inside a Studio window.
 * Used to move widgets between studio windows, and choose what content to render.
 * Uses sortable functionality of dnd-kit library to allow sorting. 
 */
export function WidgetTab({id, index, label, icon: Icon, ...props}: WidgetTabProps) {
  const { ref, isDragging } = useSortable({id: id, index: index})

  return (
    <Button
      ref={ref}
      variant={isDragging ? "outline" : "classic" }
      {...props}
    >
      {Icon && <Icon />}{label}
    </Button>
  )
}
