/*
 * Used to create and mount singleton instanes for widget containers.
 * DOM instances are stored in the containers object after registration via
 * WidgetHosts function call.
 * Use Widget slot too access given widgets component.
 */

import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { widgets } from '../lib/constants';
import type { WidgetId } from '../lib/types';

// Persistent DOM containers, one per widget, created once and reused forever.
const containers: Record<WidgetId, HTMLDivElement> = {};

function getContainer(id: WidgetId): HTMLDivElement {
  let container = containers[id];
  if (!container) {
    container = document.createElement('div');
    container.style.height = '100%';
    container.style.width = '100%';
    containers[id] = container;
  }
  return container;
}

/**
 * Mounts every widget's content exactly once, for the lifetime of the app.
 * Render this once near the root of Studio, make sure to avoid unmount/remounts.
 */
export function WidgetHosts() {
  return (
    <>
      {(Object.keys(widgets) as WidgetId[]).map((id) => {
        const WidgetContent = widgets[id].content;
        return createPortal(<WidgetContent />, getContainer(id), id);
      })}
    </>
  );
}

/**
 * Grab given widgets singleton container and append it into this slot's DOM.
 */
export function WidgetSlot({ widgetId }: { widgetId: WidgetId }) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (slot === null) return;
    const container = getContainer(widgetId);

    // Clear out any other widget's container left in this slot from a
    // previous tab/widgetId - otherwise stale containers pile up as
    // siblings and whichever was appended first ends up on top.
    Array.from(slot.children).forEach((child) => {
      if (child !== container) slot.removeChild(child);
    });

    slot.appendChild(container);
    // No clean up to dispose of container, used as singleton reference to widget content
    // Here to prevent re-renders (causes issues with Monaco editor in particular)
  }, [widgetId]);

  return <div ref={slotRef} className="h-full w-full" />;
}
