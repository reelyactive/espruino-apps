/**
 * Copyright reelyActive 2026
 * We believe in an open Internet of Things
 */


// User-configurable constants
const SENSOR_READ_PERIOD_MILLISECONDS = 5000;
const ADVERTISING_PERIOD_MILLISECONDS = 1000;


// Non-user-configurable constants
const PRESSURE_CHARACTERISTIC_UUID = 0x2a6d;   // From Bluetooth GATT
const PRESSURE_DATA_LENGTH_BYTES = 4;          // From Bluetooth GATT


// Read the connected sensor
function readSensor(callback) {
  let pressure = 101325; // TODO: replace with sensor capture routine

  callback(pressure);
}


// Create the array of service data based on sensor measurements
function createServiceData(pressure) {
  let serviceDataBuffer = new ArrayBuffer(PRESSURE_DATA_LENGTH_BYTES);
  let serviceData = new DataView(serviceDataBuffer);

  // Pressure unit is 0.1 Pa, little-endian byte order
  serviceData.setUint32(0, pressure * 10, true);

  return new Uint8Array(serviceDataBuffer, 0, PRESSURE_DATA_LENGTH_BYTES);
}


// Advertise the sensor data indefinitely
function advertise(pressure) {
  let advertisingData = {};
  advertisingData[PRESSURE_CHARACTERISTIC_UUID] = createServiceData(pressure);

  let advertisingOptions = { interval: ADVERTISING_PERIOD_MILLISECONDS,
                             showName: false };

  NRF.setAdvertising(advertisingData, advertisingOptions);
}


// Update: read and advertise sensor data
function update() {
  readSensor((data) => { advertise(data); });
}


setInterval(update, SENSOR_READ_PERIOD_MILLISECONDS);
