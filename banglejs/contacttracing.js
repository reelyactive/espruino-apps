/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


// Constants
const CONTACT_TRACING_SERVICE_UUID = 'fd6f';
const APP_TITLE = 'Contact Tracing';
const DISPLAY_RESET_SECONDS = 5;
const BUZZ_MILLISECONDS = 180;
const MAX_RSSI = -40;
const MIN_RSSI = -99;


// Global variables
let secondsSinceDetection = DISPLAY_RESET_SECONDS;
let nextBuzzStrength = 0;
let filter = { serviceData: {} };
filter.serviceData[CONTACT_TRACING_SERVICE_UUID] = {};


/**
 * Handle the detection of a contact, displaying info on screen.
 * @param {Object} device The target device detected by the scan.
 */
function handleContactTracingDetection(device) {
  let buzzStrength = 1 - ((MAX_RSSI - device.rssi) / (MAX_RSSI - MIN_RSSI));
  if(buzzStrength > nextBuzzStrength) {
    nextBuzzStrength = buzzStrength;
  }
  secondsSinceDetection = 0;
  E.showMessage('Detected contact\n@ ' + device.rssi + ' dBm', APP_TITLE);
}


/**
 * Complete periodic tasks.
 */
function handleInterval() {
  switch(secondsSinceDetection++) {
    case DISPLAY_RESET_SECONDS:
      displayDefaultMessage();
      break;
    case 0:
      Bangle.buzz(BUZZ_MILLISECONDS, nextBuzzStrength);
      nextBuzzStrength = 0;
      break;
  }
}


/**
 * Display the default message (no devices detected).
 */
function displayDefaultMessage() {
  E.showMessage('Scanning for\nContact Tracing\ndevices', APP_TITLE);
}


NRF.setScan(function(device) {
  handleContactTracingDetection(device);
}, { filters: [ filter ] });

setInterval(handleInterval, 1000);

displayDefaultMessage();