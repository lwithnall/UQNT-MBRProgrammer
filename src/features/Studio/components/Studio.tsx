import { Mosaic } from 'react-mosaic-component';
import { StudioWindow } from './StudioWindow';
import { StudioProvider } from '../state';
import { type MosaicState, type WindowId, defaultMosaicState } from '../lib';
import { WidgetTabGroup } from './WidgetTabGroup';
import { BlockEditor, CodeEditor } from '../../BlockMirror/components';

import 'react-mosaic-component/react-mosaic-component.css';
import '../styling/mosaic.css';

export function Studio() {
  const mosaic = defaultMosaicState;

  // Called by Mosaic component to handle mosaic structure changes
  const onChange = (newMosaic: MosaicState | null) => {
    if (newMosaic == null) throw new Error('Mosaic state should never be null');
    console.log('Mosaic changed!');
  };

  return (
    <StudioProvider>
      <Mosaic<WindowId>
        renderTile={(id, path) => {
          if (id == 'win1') {
            // placeholder thing for testing
            return (
              <div>
                <StudioWindow
                  id={id}
                  path={path}
                  toolbarControls={<WidgetTabGroup windowId={id} />}
                >
                  <BlockEditor />
                </StudioWindow>
              </div>
            );
          } else {
            return (
              <div>
                <StudioWindow
                  id={id}
                  path={path}
                  toolbarControls={<WidgetTabGroup windowId={id} />}
                >
                  <CodeEditor />
                </StudioWindow>
              </div>
            );
          }
        }}
        value={mosaic}
        onChange={onChange}
      />
    </StudioProvider>
  );
}
