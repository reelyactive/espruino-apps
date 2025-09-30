/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


// User-configurable constants
const LED_BLINK_MILLISECONDS = 50;
const TEMPERATURE_ADVERTISING_DURATION_MILLISECONDS = 4000;
const TEMPERATURE_ADVERTISING_PERIOD_MILLISECONDS = 1000;
const TEMPERATURE_CAPTURE_PERIOD_MILLISECONDS = 60000;
const NAME_ADVERTISING_PERIOD_MILLISECONDS = 5000;


// Non-user-configurable constants
const TEMPERATURE_CHARACTERISTIC_UUID = 0x2a6e;   // From Bluetooth GATT
const BATTERY_LEVEL_CHARACTERISTIC_UUID = 0x2a19; // From Bluetooth GATT


// Global variables
let advertisingTimeoutId;


// Advertise the name "Temp.js"
function advertiseName() {
  let advertisingOptions = {
      showName: false,
      manufacturer: 0x0590,
      manufacturerData: JSON.stringify({ name: "Temp.js" }),
      interval: NAME_ADVERTISING_PERIOD_MILLISECONDS
  };

  NRF.setAdvertising({}, advertisingOptions);
}


// Advertise the temperature for a specific period
function advertiseTemperature() {
  if(advertisingTimeoutId) {
    clearTimeout(advertisingTimeoutId);
  }

  let advertisingData = {};
  advertisingData[TEMPERATURE_CHARACTERISTIC_UUID] = getTemperatureBytes();
  advertisingData[BATTERY_LEVEL_CHARACTERISTIC_UUID] = [ E.getBattery() ];

  let advertisingOptions = { interval:
                                 TEMPERATURE_ADVERTISING_PERIOD_MILLISECONDS };

  NRF.setAdvertising(advertisingData, advertisingOptions);

  advertisingTimeoutId = setTimeout(advertiseName,
                                TEMPERATURE_ADVERTISING_DURATION_MILLISECONDS);
}


// Read the temperature and return as a little endian 16-bit signed byte array
function getTemperatureBytes() {
  let temperature = Math.round(Puck.getTemperature() * 100);

  if(temperature < 0) {
    temperature += 0x10000;
  }

  return [ temperature & 0xff, (temperature >> 8) & 0xff ];
}


// Handle a button press: blink green LED and initiate on-demand sensor read
function handleButton() {
  LED2.write(true);
  advertiseTemperature();
  setTimeout(() => { LED2.write(false); }, LED_BLINK_MILLISECONDS);
}


// Advertise "Temp.js", wake on button press and handle accelerometer readings
advertiseName();
setWatch(handleButton, BTN, { edge: "rising", repeat: true, debounce: 50 });
setInterval(advertiseTemperature, TEMPERATURE_CAPTURE_PERIOD_MILLISECONDS);