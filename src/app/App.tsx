import { Studio } from '../features/Studio/components/Studio';
import { CodeProvider } from '../features/BlockMirror/components';
import { Header } from '../components/Header';

function App() {
  return (
    <>
      <div className="h-screen flex flex-col p-1.5 gap-1">
        {/* <Toolbar.Root className="flex justify-start padding-10 bg-white rounded-md shadow-md">
          <Toolbar.Button onClick={() => checkBLE()} className="hover:bg-red-500">
            Check
          </Toolbar.Button>
          <Toolbar.Button onClick={() => connBLEDevice()} className="hover:bg-red-500">
            Connect
          </Toolbar.Button>
        </Toolbar.Root> */}
        <Header />
        <CodeProvider>
          <Studio />
        </CodeProvider>
      </div>
    </>
  );
}

export default App;
