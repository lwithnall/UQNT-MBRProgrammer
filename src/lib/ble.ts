/// <reference types="web-bluetooth" />

const defaultRoverBLEOptions: RequestDeviceOptions = {
  filters: [
    { namePrefix: "LE" } // LE chosen purely for testing
  ],
}

/** Check if BLE is available in current browser */
async function checkBLE() {
  const ble = navigator.bluetooth;

  if (ble === undefined) {
    // BLE not supported by browser
    console.error("Current browser doesn't support Bluetooth LE.")
    return false;
  }

  if (!window.isSecureContext) {
    console.error("Insecure context... exiting.")
    return false;
  }

  try {
    const available = await ble.getAvailability();
    return available;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/** Attempt connection with and return device. */
async function connBLEDevice(options = defaultRoverBLEOptions) {
  try {
    const device = await navigator.bluetooth.requestDevice(options);
    return device;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export { checkBLE, connBLEDevice }
