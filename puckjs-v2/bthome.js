/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


// User-configurable constants
const LED_BLINK_MILLISECONDS = 50;
const ADVERTISING_DURATION_MILLISECONDS = 4000;
const ADVERTISING_PERIOD_MILLISECONDS = 1000;
const MEASUREMENT_UPDATE_PERIOD_MILLISECONDS = 60000;
const INCLUDE_BATTERY = true;
const INCLUDE_OPENING = true;
const INCLUDE_LIGHT = true;
const INCLUDE_BUTTON = true;
const INCLUDE_ROTATION = true;
const INCLUDE_TEMPERATURE = true;
const IS_CONTACT_DETECTED_THRESHOLD = 50; // In uT (micro Tesla)
const IS_LIGHT_DETECTED_THRESHOLD = 0.2;  // Range: 0 to 1


// Non-user-configurable constants
const BTHOME_SERVICE_UUID = 0xfcd2;
const BTHOME_DEVICE_INFORMATION = 0x40;
const BTHOME_BATTERY_ID = 0x01;
const BTHOME_OPENING_ID = 0x11;
const BTHOME_LIGHT_ID = 0x1e;
const BTHOME_BUTTON_ID = 0x3a;
const BTHOME_ROTATION_ID = 0x3f;
const BTHOME_TEMPERATURE_ID = 0x45;
const MAX_SERVICE_DATA_LENGTH_BYTES = 15;
const DEG_PER_RAD = 180 / Math.PI;


// Global variables
let advertisingTimeoutId;


// Create the array of service data based on sensor measurements
function createServiceData() {
  let serviceDataBuffer = new ArrayBuffer(MAX_SERVICE_DATA_LENGTH_BYTES);
  let serviceData = new DataView(serviceDataBuffer);
  let index = 0;
  serviceData.setUint8(index++, BTHOME_DEVICE_INFORMATION);

  // Add service data in order of id (lowest to highest)
  if(INCLUDE_BATTERY) {
    index += updateBattery(serviceData, index);
  }
  if(INCLUDE_OPENING) {
    index += updateOpening(serviceData, index);
  }
  if(INCLUDE_LIGHT) {
    index += updateLight(serviceData, index);
  }
  if(INCLUDE_BUTTON) {
    index += updateButton(serviceData, index);
  }
  if(INCLUDE_ROTATION) {
    index += updateRotation(serviceData, index);
  }
  if(INCLUDE_TEMPERATURE) {
    index += updateTemperature(serviceData, index);
  }

  return new Uint8Array(serviceDataBuffer, 0, index);
}


// Measure the battery percentage, write it to the service data
function updateBattery(serviceData, index) {
  let batteryPercentage = E.getBattery();

  serviceData.setUint8(index, BTHOME_BATTERY_ID);
  serviceData.setUint8(index + 1, batteryPercentage);

  return 2;
}


// Measure if magnetic contact is detected, write it to the service data
function updateOpening(serviceData, index) {
  let mag = Puck.mag();
  let magRms = Math.sqrt((mag.x * mag.x + mag.y * mag.y + mag.z * mag.z) / 3);
  let isContactDetected = ((magRms / 10) >= IS_CONTACT_DETECTED_THRESHOLD);

  serviceData.setUint8(index, BTHOME_OPENING_ID);
  serviceData.setUint8(index + 1, isContactDetected ? 0 : 1);

  return 2;
}


// Measure if light is detected, write it to the service data
function updateLight(serviceData, index) {
  let isLightDetected = (Puck.light() >= IS_LIGHT_DETECTED_THRESHOLD);

  serviceData.setUint8(index, BTHOME_LIGHT_ID);
  serviceData.setUint8(index + 1, isLightDetected ? 1 : 0);

  return 2;
}


// Determine if button is pressed, write it to the service data
function updateButton(serviceData, index) {
  serviceData.setUint8(index, BTHOME_BUTTON_ID);
  serviceData.setUint8(index + 1, BTN.read() ? 0x01 : 0x00);

  return 2;
}


// Measure the temperature, write it to the service data
function updateTemperature(serviceData, index) {
  let temperature = Math.round(Puck.getTemperature() * 10);

  serviceData.setUint8(index, BTHOME_TEMPERATURE_ID);
  serviceData.setInt16(index + 1, temperature, true);

  return 3;
}


// Measure the rotation, write it to the service data
function updateRotation(serviceData, index) {
  let rotation = calculateAngleOfRotation(Puck.accel().acc);

  serviceData.setUint8(index, BTHOME_ROTATION_ID);
  serviceData.setInt16(index + 1, Math.round(rotation * 10), true);

  return 3;
}


// Calculate the angle of rotation based on the given accelerometer reading
function calculateAngleOfRotation(acc) {
  let ratioXY = ((acc.y === 0) ? Infinity : Math.abs(acc.x / acc.y));
  let ratioYX = ((acc.x === 0) ? Infinity : Math.abs(acc.y / acc.x));

  if((acc.x >= 0) && (acc.y >= 0)) {
    return Math.round(Math.atan(ratioYX) * DEG_PER_RAD);
  }
  if((acc.x <= 0) && (acc.y >= 0)) {
    return Math.round(90 + (Math.atan(ratioXY) * DEG_PER_RAD));
  }
  if((acc.x <= 0) && (acc.y <= 0)) {
    return Math.round(180 + (Math.atan(ratioYX) * DEG_PER_RAD));
  }
  if((acc.x >= 0) && (acc.y <= 0)) {
    return Math.round(270 + (Math.atan(ratioXY) * DEG_PER_RAD));
  }
}


// Advertise for a specific period
function advertise() {
  if(advertisingTimeoutId) {
    clearTimeout(advertisingTimeoutId);
  }

  let advertisingData = {};
  advertisingData[BTHOME_SERVICE_UUID] = createServiceData();

  let advertisingOptions = { interval: ADVERTISING_PERIOD_MILLISECONDS,
                             showName: false };

  NRF.setAdvertising(advertisingData, advertisingOptions);

  advertisingTimeoutId = setTimeout(advertise,
                                    ADVERTISING_DURATION_MILLISECONDS);
}


// Handle a button press: blink green LED and initiate on-demand sensor read
function handleButton() {
  LED2.write(true);
  advertise();
  setTimeout(() => { LED2.write(false); }, LED_BLINK_MILLISECONDS);
}


// Advertise measurements, wake on button press
advertise();
setWatch(handleButton, BTN, { edge: "rising", repeat: true, debounce: 50 });
setInterval(advertise, MEASUREMENT_UPDATE_PERIOD_MILLISECONDS);