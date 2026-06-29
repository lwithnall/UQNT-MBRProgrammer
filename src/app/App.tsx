import { checkBLE, connBLEDevice } from "../lib/ble"

function App() {
  

  return (
    <>
      <div className="bg-red-500 w-fill">
        <p>test</p>
        <button 
          className="outline-solid outline-2"
          onClick={() => checkBLE()}
        >
          Check available
        </button>
        <button
          className="outline-solid outline-2"
          onClick={() => connBLEDevice()}
        >
          Connect device
        </button>
      </div>
    </>
  )
}

export default App
