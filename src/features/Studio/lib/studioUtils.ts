/*
 * List of utility functions to update and return a studio object
 * All functions take a Studio instance as input and return updated value
 * Exist to make combination of studio updates easy whilst only needing
 * to update React state once
 *
 * Note: Mosaic updates are set using 'immutability-helper'
 * react-mosaic-component: https://nomcopter.github.io/react-mosaic/docs/concepts/updates
 * immutability-helper: https://github.com/kolodny/immutability-helper
 */

import {
  createRemoveUpdate,
  getAndAssertNodeAtPathExists,
  updateTree,
  type MosaicNode,
  type MosaicPath,
} from 'react-mosaic-component';
import type { DropSide, StudioState, WidgetId, WindowId } from './types';
import { widgets } from './constants';

/* Check if window exists on studio instance */
function isWindow(studio: StudioState, windowId: WindowId) {
  return windowId in studio.windows;
}

/* Generate random WindowID */
function generateWindowId(): WindowId {
  return crypto.randomUUID();
}

/*
 * Given a window or widget id, find if it
 * a. is a window (then return)
 * b. is a widget (return the window that stores it)
 */
function windowFromId(studio: StudioState, id: WindowId | WidgetId) {
  if (id in studio.windows) {
    // Provided id is a window
    return id;
  }

  // Check if id is a widget inside a window
  const windowId = Object.keys(studio.windows).find((key) =>
    studio.windows[key]['widgets'].some((item) => item === id)
  );

  if (!windowId) return null;
  return windowId;
}

/* Return the number of widgets stored in a  mosaic window */
function widgetCount(studio: StudioState, windowId: WindowId) {
  return studio.windows[windowId].widgets.length;
}

/* Set a given widgets active widget to supplied value */
function setActiveWidget(studio: StudioState, windowId: WindowId, widgetId: WidgetId) {
  return {
    ...studio,
    windows: {
      ...studio.windows,
      [windowId]: {
        ...studio.windows[windowId],
        activeWidget: widgetId,
      },
    },
  };
}

/* Get the content given window should be displaying */
function getWindowContent(studio: StudioState, windowId: WindowId) {
  const window = studio.windows[windowId];
  if (!window) throw new Error(`Window (${windowId}) does not exist`);
  return widgets[window.activeWidget].content;
}

/*
 * Add a given window to studio state, must supply a default widget
 * @param studio - the studio instance
 * @param newWindowId - the id of the window to add
 * @param initWidget - the widget the window must start with
 */
function addWindow(studio: StudioState, newWindowId: WindowId, initWidget: WidgetId) {
  return {
    ...studio,
    windows: {
      ...studio.windows,
      [newWindowId]: { widgets: [initWidget], activeWidget: initWidget },
    },
  };
}

/*
 * Delete given window from studio state
 * @param studio - the studio instance
 * @param windowId - the window being deleted
 */
function deleteWindow(studio: StudioState, windowId: WindowId): StudioState {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [windowId]: _old, ...newWindows } = studio.windows;
  return {
    ...studio,
    windows: newWindows,
  };
}

/* Update the mosaic component of given studio to supplied value */
function setMosaic(studio: StudioState, mosaic: MosaicNode<WindowId>) {
  return {
    ...studio,
    mosaic: mosaic,
  };
}

/*
 * Add new mosaic node next to target window depending on drop path
 * @param studio studio instance to modify
 * @param newNode node being inserted
 * @param targPath path to window new node will be adjacent to
 * @param dropSide side of target window to make new node
 */
function addMosaicNode(
  studio: StudioState,
  newNode: MosaicNode<WindowId>,
  targPath: MosaicPath,
  dropSide: DropSide
) {
  const mosaic = studio.mosaic;
  const direction = dropSide === 'left' || dropSide === 'right' ? 'row' : 'column';

  const destination = getAndAssertNodeAtPathExists(mosaic, targPath);

  // Going in different direct, must make new mosaic node
  let first: MosaicNode<WindowId>;
  let second: MosaicNode<WindowId>;
  if (dropSide === 'left' || dropSide === 'top') {
    first = destination;
    second = newNode;
  } else {
    first = newNode;
    second = destination;
  }

  return {
    ...studio,
    mosaic: updateTree(studio.mosaic, [
      {
        path: targPath,
        spec: {
          $set: {
            type: 'split',
            direction,
            children: [first, second],
            splitPercentages: [50, 50],
          },
        },
      },
    ]),
  };
}

/*
 * Delete the mosaic node at the supplied path
 * @param studio the studio instance to modify
 * @param windowPath the path to the node to delete
 */
function deleteMosaicNode(studio: StudioState, path: MosaicPath) {
  return {
    ...studio,
    mosaic: updateTree(studio.mosaic, [createRemoveUpdate(studio.mosaic, path)]),
  };
}

/*
 * Remove given widget from mosaic window
 * If this is the windows last widget, delete the window and its respective mosaic node
 * Otherwise, remove widget and update active widget as required
 * @param studio - the studio instance to modify
 * @param widgetId - the widget being removed
 * @param windowId - the window the widget is being removed from
 * @param windowPath - mosaic path leading to the given window
 */
function removeWidget(
  studio: StudioState,
  widgetId: WidgetId,
  windowId: WindowId,
  windowPath: MosaicPath
) {
  if (!isWindow(studio, windowId)) throw new Error(`Supplied window (${windowId}) doesn't exist`);

  if (widgetCount(studio, windowId) == 1) {
    // Removing last widget, window needs to be deleted
    let newStudio: StudioState;
    newStudio = deleteWindow(studio, windowId);
    newStudio = deleteMosaicNode(newStudio, windowPath);
    return newStudio;
  }

  // Just remove given widget from window, update active widget if needed
  const window = studio.windows[windowId];
  const newWidgets = window.widgets.filter((i) => i != widgetId);
  const newActive = window.activeWidget == widgetId ? newWidgets[0] : window.activeWidget;

  return {
    ...studio,
    windows: {
      ...studio.windows,
      [windowId]: {
        activeWidget: newActive,
        widgets: newWidgets,
      },
    },
  };
}

/*
 * Remove widget from source window, create new window depending on where it is dropped
 * @param studio - the studio instance to modify
 * @param widgetId - the id of the widget being moved
 * @param sourceId - the id of the window the widget came from
 * @param sourcePath - the mosaic path to the window the widget came from
 * @param targPath - the path to the window the widget is dropped on
 * @param dropSide - the side of the window the widget was dropped on
 */
function spawnWindowFromWidget(
  studio: StudioState,
  widgetId: WidgetId,
  sourceId: WindowId,
  sourcePath: MosaicPath,
  targPath: MosaicPath,
  dropSide: DropSide
) {
  let newStudio: StudioState;
  const newWindowId = generateWindowId();

  newStudio = removeWidget(studio, widgetId, sourceId, sourcePath);
  newStudio = addWindow(newStudio, newWindowId, widgetId);
  newStudio = addMosaicNode(newStudio, newWindowId, targPath, dropSide);
  return newStudio;
}

export {
  widgetCount,
  windowFromId,
  setActiveWidget,
  getWindowContent,
  setMosaic,
  spawnWindowFromWidget,
};
