/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


// User-configurable constants
const DEFAULT_USE_PUBLIC_ADDRESS = false;
const DEFAULT_DEVICE_NAME = "IoCS Common";
const DEFAULT_SOFTWARE_REV = "1.0.0";
const DEFAULT_ADV_INTERVAL_MILLISECONDS = 1000;
const DEFAULT_ADV_TYPE = 1;
const DEFAULT_ADV_FLAGS = 0x55;
const DEFAULT_ADV_PARAMETER = 0;


// Non-user-configurable constants


// Global variables
let isPublicAddress = DEFAULT_USE_PUBLIC_ADDRESS;
let advAddress = NRF.getAddress(true);
let deviceName = DEFAULT_DEVICE_NAME;
let adv1IntervalMilliseconds = DEFAULT_ADV_INTERVAL_MILLISECONDS;
let adv1Type = DEFAULT_ADV_TYPE;
let adv1Flags = DEFAULT_ADV_FLAGS;
let adv1Parameters = [ DEFAULT_ADV_PARAMETER, DEFAULT_ADV_PARAMETER,
                       DEFAULT_ADV_PARAMETER ];


// Update isPublicAddress following GATT write
function updatePublicAddress(evt) {
  let data = new Uint8Array(evt.data);
  isPublicAddress = (data[0] !== 0);
  Terminal.println('isPublicAddress: ' + isPublicAddress);
}

// Update advAddress following GATT write
function updateAdvAddress(evt) {
  let data = new Uint8Array(evt.data);
  let advAddress = '';
  data.forEach((char) => { advAddress += String.fromCharCode(char); });
  Terminal.println('advAddress: ' + advAddress);
}

// Update deviceName following GATT write
function updateDeviceName(evt) {
  let data = new Uint8Array(evt.data);
  let deviceName = '';
  data.forEach((char) => { deviceName += String.fromCharCode(char); });
  Terminal.println('deviceName: ' + deviceName);
}

// Update adv1IntervalMilliseconds following GATT write
function updateAdv1Interval(evt) {
  let data = new Uint32Array(evt.data);
  adv1IntervalMilliseconds = data[0];
  Terminal.println('adv1Interval: ' + adv1IntervalMilliseconds);
}

// Update adv1Type following GATT write
function updateAdv1Type(evt) {
  let data = new Uint8Array(evt.data);
  adv1Type = data[0];
  Terminal.println('adv1Type: ' + adv1Type);
}

// Update adv1Flags following GATT write
function updateAdv1Flags(evt) {
  let data = new Uint8Array(evt.data);
  adv1Flags = data[0];
  Terminal.println('adv1Flags: ' + adv1Flags);
}

// Update adv1Parameter following GATT write
function updateAdv1Parameter(index, evt) {
  let data = new Uint32Array(evt.data);
  adv1Parameters[index] = data[0];
  Terminal.println('adv1Parameter' + index + ': ' + adv1Parameters[index]);
}


// Set the IoCS Common services and characteristics
NRF.setServices({

  // Service: IoCS Common Identification
  "49441d00-496f-4353-b73e-436f6d6d6f6e": {

    // Characteristic: Use public address?
    "49441d01-496f-4353-b73e-436f6d6d6f6e": {
      value: isPublicAddress,
      readable: true,
      writable: true,
      onWrite: updatePublicAddress
    },

    // Characteristic: Advertiser Address
    "49441d02-496f-4353-b73e-436f6d6d6f6e": {
      value: advAddress,
      readable: true,
      writable: true,
      onWrite: updateAdvAddress
    },

    // Characteristic: Device Name
    "49441d03-496f-4353-b73e-436f6d6d6f6e": {
      value: deviceName,
      readable: true,
      writable: true,
      onWrite: updateDeviceName
    },

    // Characteristics: Model/Serial/Firmware/Hardware/Software
    "49441d06-496f-4353-b73e-436f6d6d6f6e": { value: process.env.BOARD,
                                              readable: true },
    "49441d07-496f-4353-b73e-436f6d6d6f6e": { value: process.env.SERIAL,
                                              readable: true },
    "49441d08-496f-4353-b73e-436f6d6d6f6e": { value: process.env.VERSION,
                                              readable: true },
    "49441d09-496f-4353-b73e-436f6d6d6f6e": { value: process.env.HWVERSION,
                                              readable: true },
    "49441d0a-496f-4353-b73e-436f6d6d6f6e": { value: DEFAULT_SOFTWARE_REV,
                                              readable: true }

  },

  // Service: IoCS Advertisement 1
  "4944a100-496f-4353-b73e-436f6d6d6f6e": {

    // Characteristic: Interval (ms)
    "4944a101-496f-4353-b73e-436f6d6d6f6e" : {
      value: [ adv1IntervalMilliseconds & 0xff,
               (adv1IntervalMilliseconds >> 8) & 0xff,
               (adv1IntervalMilliseconds >> 16) & 0xff,
               (adv1IntervalMilliseconds >> 24) & 0xff ],
      readable: true,
      writable: true,
      onWrite: updateAdv1Interval
    },

    // Characteristic: Type
    "4944a102-496f-4353-b73e-436f6d6d6f6e" : {
      value: adv1Type,
      readable: true,
      writable: true,
      onWrite: updateAdv1Type
    },

    // Characteristic: Flags
    "4944a103-496f-4353-b73e-436f6d6d6f6e" : {
      value: adv1Flags,
      readable: true,
      writable: true,
      onWrite: updateAdv1Flags
    },

    // Characteristic: Parameter 1
    "4944a104-496f-4353-b73e-436f6d6d6f6e" : {
      value: [ adv1Parameters[0] & 0xff,
               (adv1Parameters[0] >> 8) & 0xff,
               (adv1Parameters[0] >> 16) & 0xff,
               (adv1Parameters[0] >> 24) & 0xff ],
      readable: true,
      writable: true,
      onWrite: (evt) => { updateAdv1Parameter(0, evt); }
    },

    // Characteristic: Parameter 2
    "4944a105-496f-4353-b73e-436f6d6d6f6e" : {
      value: [ adv1Parameters[1] & 0xff,
               (adv1Parameters[1] >> 8) & 0xff,
               (adv1Parameters[1] >> 16) & 0xff,
               (adv1Parameters[1] >> 24) & 0xff ],
      readable: true,
      writable: true,
      onWrite: (evt) => { updateAdv1Parameter(1, evt); }
    },

    // Characteristic: Parameter 3
    "4944a106-496f-4353-b73e-436f6d6d6f6e" : {
      value: [ adv1Parameters[2] & 0xff,
               (adv1Parameters[2] >> 8) & 0xff,
               (adv1Parameters[2] >> 16) & 0xff,
               (adv1Parameters[2] >> 24) & 0xff ],
      readable: true,
      writable: true,
      onWrite: (evt) => { updateAdv1Parameter(2, evt); }
    }
  }
});

// Turn on LCD backlight upon connection
NRF.on('connect', (addr) => {
  LED.set();
  Terminal.println('Host connected');
});

// Turn off LCD backlight upon disconnection
NRF.on('disconnect', (reason) => {
  LED.reset();
  Terminal.println('Host disconnected');
});
