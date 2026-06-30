import { checkBLE, connBLEDevice } from "../lib/ble"
import { Toolbar } from "radix-ui"
import { Studio } from "../features/Studio/components/Studio"

function App() {

  return (
    <>
      <div className="w-fill">
        <Toolbar.Root className="flex justify-start padding-10 w-fill bg-white rounded-md shadow-md">
          <Toolbar.Button onClick={() => checkBLE()} className="hover:bg-red-500">Check</Toolbar.Button>
          <Toolbar.Button onClick={() => connBLEDevice()} className="hover:bg-red-500">Connect</Toolbar.Button>
        </Toolbar.Root>
        <Studio />
      </div>
    </>
  )
}

export default App
