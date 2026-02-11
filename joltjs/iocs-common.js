/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


// User-configurable constants
const DEFAULT_USE_PUBLIC_ADDRESS = false;
const DEFAULT_DEVICE_NAME = "IoCS Common";
const DEFAULT_SOFTWARE_REV = "1.0.0";
const DEFAULT_ADV_INTERVAL_MILLISECONDS = 1000;
const DEFAULT_BURST_DURATION_MILLISECONDS = 0;
const DEFAULT_BURST_INTERVAL_MILLISECONDS = 0;
const DEFAULT_ADV_TYPE = 1;
const DEFAULT_ADV_FLAGS = 0x55;
const DEFAULT_ADV_PARAMETER = 0;
const LED_BLINK_MILLISECONDS = 200;


// Non-user-configurable constants
const IOCS_FILE_NAME = "iocs.json";


// Global variables
let isCharacteristicWritePending = false;
let isAdvertisingUpdatePending = false;
let burstDurationTimeoutId = null;
let burstIntervalTimeoutId = null;


// Update isPublicAddress following GATT write
function updatePublicAddress(evt) {
  let data = new Uint8Array(evt.data);
  iocs["1d01"].v = (data[0] > 0); // TODO: NRF.setAddress()
  isCharacteristicWritePending = true;
}

// Update advAddress following GATT write
function updateAdvAddress(evt) {
  let data = new Uint8Array(evt.data);
  let advAddress = '';
  data.forEach((char) => { advAddress += String.fromCharCode(char); });
  iocs["1d02"].v = advAddress;    // TODO: NRF.setAddress()
  isCharacteristicWritePending = true;
}

// Update deviceName following GATT write
function updateDeviceName(evt) {
  let data = new Uint8Array(evt.data);
  let deviceName = '';
  data.forEach((char) => { deviceName += String.fromCharCode(char); });
  iocs["1d03"].v = deviceName;    // TODO: NRF.setAdvertising()
  isCharacteristicWritePending = true;
  isAdvertisingUpdatePending = true;
}

// Update adv1AdvertisingIntervalMilliseconds following GATT write
function updateAdv1AdvertisingInterval(evt) {
  iocs["a101"].v = evt.data;
  isCharacteristicWritePending = true;
  isAdvertisingUpdatePending = true;
}

// Update adv1BurstDurationMilliseconds following GATT write
function updateAdv1BurstDuration(evt) {
  iocs["a102"].v = evt.data;
  isCharacteristicWritePending = true;
  isAdvertisingUpdatePending = true;
}

// Update adv1BurstIntervalMilliseconds following GATT write
function updateAdv1BurstInterval(evt) {
  iocs["a103"].v = evt.data;
  isCharacteristicWritePending = true;
  isAdvertisingUpdatePending = true;
}

// Update adv1Type following GATT write
function updateAdv1Type(evt) {
  let data = new Uint8Array(evt.data);
  iocs["a104"].v = data[0];       // TODO: change advertising type
  isCharacteristicWritePending = true;
}

// Update adv1Flags following GATT write
function updateAdv1Flags(evt) {
  let data = new Uint8Array(evt.data);
  iocs["a105"].v = data[0];       // TODO: change settings
  isCharacteristicWritePending = true;
}

// Update adv1Parameter0 following GATT write
function updateAdv1Parameter0(index, evt) {
  iocs["a106"].v = evt.data;      // TODO: update parameter
  isCharacteristicWritePending = true;
}

// Update adv1Parameter1 following GATT write
function updateAdv1Parameter1(index, evt) {
  iocs["a107"].v = evt.data;      // TODO: update parameter
  isCharacteristicWritePending = true;
}

// Update adv1Parameter2 following GATT write
function updateAdv1Parameter2(index, evt) {
  iocs["a108"].v = evt.data;      // TODO: update parameter
  isCharacteristicWritePending = true;
}

// Handle the completion of an advertising burst by putting the radio to sleep
function handleBurstComplete() {
  NRF.sleep();
}

// Handle the start of a fresh advertising burst
function handleBurstInterval() {
  NRF.wake();
  // TODO: updating sensor data, etc. could go here
  updateAdvertising();
}

// Update the advertising data and burst intervals/timeouts, as required
function updateAdvertising() {
  let advertisingOptions = {
      name: iocs["1d03"].v,
      interval: fromUint32LE(iocs["a101"].v),
      manufacturer: 0x0590,
      manufacturerData: []
  };
  NRF.setAdvertising({}, advertisingOptions);
  clearTimeout(burstDurationTimeoutId);
  clearTimeout(burstIntervalTimeoutId);

  let burstDurationMilliseconds = fromUint32LE(iocs["a102"].v);
  let burstIntervalMilliseconds = fromUint32LE(iocs["a103"].v);
  let isBurstMode = ((burstDurationMilliseconds > 0) &&
                     (burstIntervalMilliseconds > burstDurationMilliseconds));

  if(isBurstMode) {
    burstDurationTimeoutId = setTimeout(handleBurstComplete,
                                        burstDurationMilliseconds);
    burstIntervalTimeoutId = setTimeout(handleBurstInterval, 
                                        burstIntervalMilliseconds);
  }
}

// Convert the given 32-bit number to a little endian byte array
// TODO: use ArrayBuffer and DataView?
function toUint32LE(number) {
  return [ number & 0xff, (number >> 8) & 0xff, (number >> 16) & 0xff,
           (number >> 24) & 0xff ];
}

// Convert the given little endian byte array to a 32-bit number
// TODO: use ArrayBuffer and DataView?
function fromUint32LE(number) {
  return (number[3] << 24) + (number[2] << 16) + (number[1] << 8) + number[0];
}

// Read stored Interoperable Characteristics & Services, or init to defaults
// -- Indexed by 16-bit characteristic UUID
// -- v = value, r = readable?, w = writeable?, u = onWrite function
let iocs = require("Storage").readJSON(IOCS_FILE_NAME, true) || {
    "1d01": { v: DEFAULT_USE_PUBLIC_ADDRESS, r: true, w: false },
    "1d02": { v: NRF.getAddress(true), r: true, w: false },
    "1d03": { v: DEFAULT_DEVICE_NAME, r: true, w: true },
    "1d06": { v: process.env.BOARD, r: true, w: false },
    "1d07": { v: process.env.SERIAL, r: true, w: false },
    "1d08": { v: process.env.VERSION, r: true, w: false },
    "1d09": { v: process.env.HWVERSION, r: true, w: false },
    "1d0a": { v: DEFAULT_SOFTWARE_REV, r: true, w: false },
    "a101": { v: toUint32LE(DEFAULT_ADV_INTERVAL_MILLISECONDS), r: true,
              w: true },
    "a102": { v: toUint32LE(DEFAULT_BURST_DURATION_MILLISECONDS), r: true,
              w: true },
    "a103": { v: toUint32LE(DEFAULT_BURST_INTERVAL_MILLISECONDS), r: true,
              w: true },
    "a104": { v: DEFAULT_ADV_TYPE, r: true, w: true },
    "a105": { v: DEFAULT_ADV_FLAGS, r: true, w: true },
    "a106": { v: toUint32LE(DEFAULT_ADV_PARAMETER), r: true, w: true },
    "a107": { v: toUint32LE(DEFAULT_ADV_PARAMETER), r: true, w: true },
    "a108": { v: toUint32LE(DEFAULT_ADV_PARAMETER), r: true, w: true }
};

// Functions to update individual IoCS characteristics
// (Maintained separately from iocs because they can't be written to Storage)
let iocsUpdates = {
    "1d03": updateDeviceName,
    "a101": updateAdv1AdvertisingInterval,
    "a102": updateAdv1BurstDuration,
    "a103": updateAdv1BurstInterval,
    "a104": updateAdv1Type,
    "a105": updateAdv1Flags,
    "a106": updateAdv1Parameter0,
    "a107": updateAdv1Parameter1,
    "a108": updateAdv1Parameter2
};

// Prepare the services and characteristics based on the given list
function prepareServices(list) {
  let services = {
      "49441d00-496f-4353-b73e-436f6d6d6f6e": {}, // IoCS Common Identification
      "4944a100-496f-4353-b73e-436f6d6d6f6e": {}  // IoCS Advertisement 1
  };

  // Add each characteristic to its corresponding service
  Object.keys(list).forEach((cUuid16) => {
    let characteristic = list[cUuid16];
    Object.keys(services).forEach((sUuid128) => {
      let service = services[sUuid128];
      if(cUuid16.substring(0, 2) === sUuid128.substring(4, 6)) {
        let cUuid128 = "4944" + cUuid16 + "-496f-4353-b73e-436f6d6d6f6e";
        service[cUuid128] = { value: characteristic.v,
                              readable: characteristic.r,
                              writable: characteristic.w };
        if(characteristic.w && (typeof iocsUpdates[cUuid16] === 'function')) {
          service[cUuid128].onWrite = iocsUpdates[cUuid16];
        }
      }
    });
  });

  return services;
}

// Write characteristics to storage
function writeCharacteristics() {
  let isWriteSuccess = require("Storage").writeJSON(IOCS_FILE_NAME, iocs);

  if(isWriteSuccess) {
    LED2.set(); // Blink green LED on storage success
    setTimeout(() => { LED2.reset(); }, LED_BLINK_MILLISECONDS);
  }
  else {
    LED1.set(); // Blink red LED on storage failure
    setTimeout(() => { LED1.reset(); }, LED_BLINK_MILLISECONDS);
  }

  return isWriteSuccess;
}

// Set the IoCS Common services and characteristics and start advertising
NRF.setServices(prepareServices(iocs));
updateAdvertising();

// Turn on blue LED upon connection
NRF.on('connect', (addr) => {
  LED3.set();
});

// Turn off blue LED upon disconnection
NRF.on('disconnect', (reason) => {
  LED3.reset();
  if(isCharacteristicWritePending) {
    isCharacteristicWritePending = !writeCharacteristics();
  }
  if(isAdvertisingUpdatePending) {
    isAdvertisingUpdatePending = false;
    updateAdvertising();
  }
});
