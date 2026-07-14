import { useDroppable } from "@dnd-kit/react";
import type { WindowId } from "../lib";
import { MosaicWindow, type MosaicWindowProps } from "react-mosaic-component";


export interface StudioWindowProps extends Omit<MosaicWindowProps<WindowId>, "title"> {
  id: WindowId;
}


/**
 * StudioWindow
 * Basic window wrapper for the studio area. Wraps a mosaic window and registers it 
 * as a droppable target within the Studio system. 
 */
export function StudioWindow({ id, children, ...MosaicWindowProps }: StudioWindowProps) {
  const { ref } = useDroppable({ id: id });

  return (
    <MosaicWindow title="" {...MosaicWindowProps}>
      <div ref={ref} className="h-full w-full">
        {children}  
      </div>
    </MosaicWindow>
  )
}
