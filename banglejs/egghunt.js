/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


// Constants
const COUNT_DURATION_SECONDS = 30;
const CRITICAL_TIME_THRESHOLD = 10;
const SCAN_TIMEOUT_MILLISECONDS = 10000;
const TARGET_RSSI = -50;
const MIN_RSSI = -99;
const APP_TITLE = 'Egg Hunt';
const INITIAL_PROMPT = {
  title: APP_TITLE,
  buttons: { "Espruino": 0x0590, "Apple": 0x004c }
};
const INITIAL_TIMER_COLOR = '#aec844';
const CRITICAL_TIMER_COLOR = '#ff6900';
const INITIAL_TIMER_MAGNIFICATION = 4;
const CRITICAL_TIMER_MAGNIFICATION = 8;


// Global variables
let eggSize;
let count;
let countInterval;
let initialScanTimeout;
let timerColor;
let timerMagnification;


/**
 * Draw a roughly-egg-shaped filled ellipse.
 * @param {Number} x The x coordinate of the centre of the egg.
 * @param {Number} y The y coordinate of the centre of the egg.
 * @param {Number} size The size of the egg (i.e. its height in pixels).
 * @param {String} color The color of the egg ('#ffffff' is white).
 */
function drawEgg(x, y, size, color) {
  let width = Math.round(2 * size / 3);
  let height = size;

  let x1 = x - Math.round(width / 2);
  let x2 = x + Math.round(width / 2);
  let y1 = y - Math.round(height / 2);
  let y2 = y + Math.round(height / 2);
  
  g.setColor(color);
  g.fillEllipse(x1, y1, x2, y2);
}


/**
 * Draw the timer value in the bottom-right corner of the screen.
 * @param {String} value The timer value.
 * @param {String} color The color of the font ('#ffffff' is white).
 * @param {Number} magnification The magnification of the font.
 */
function drawTimer(value, color, magnification) {
  g.setFont('6x8', magnification);
  g.setFontAlign(1, 1);
  g.setColor(color);
  g.drawString(value, g.getWidth() - 2, g.getHeight() - 2);
}


/**
 * Initiate the hunt by scanning for a device from the given manufacturer.
 * @param {Number} manufacturer Bluetooth company code of the manufacturer.
 */
function startHunt(manufacturer) {
  let filter = { manufacturerData: { 0x0590: {} } }; // Default is Espruino
  if(manufacturer === 0x004c) {                      //   can we make this
    filter = { manufacturerData: { 0x004c: {} } };   //   dynamic in future?
  }

  initialScanTimeout = setTimeout(handleInitialScanTimeout,
                                  SCAN_TIMEOUT_MILLISECONDS);
  
  NRF.setScan(function(device) {
    handleInitialDeviceDetection(device);
  }, { filters: [ filter ] });
}


/**
 * Handle the case where no Espruino/Apple device detected.
 */
function handleInitialScanTimeout() {
  NRF.setScan();

  E.showAlert('SCAN TIMEOUT\nNo such device...', APP_TITLE).then(function() {
    egghunt();
  });
}


/**
 * Update scan to filter only the given device ID, and begin countdown.
 * @param {Object} device The device detected by the scan.
 */
function handleInitialDeviceDetection(device) {
  clearTimeout(initialScanTimeout);

  NRF.setScan(function(device) {
    handleDeviceUpdate(device);
  }, { filters: [ { id: device.id } ] });

  count = COUNT_DURATION_SECONDS;
  timerColor = INITIAL_TIMER_COLOR;
  timerMagnification = INITIAL_TIMER_MAGNIFICATION;
  eggSize = 0;
  countInterval = setInterval(countdown, 1000);
}


/**
 * Handle a packet from the target device, ending the hunt if close enough.
 * @param {Object} device The target device detected by the scan.
 */
function handleDeviceUpdate(device) {
  if(device.rssi >= TARGET_RSSI) {
    return handleEndOfHunt(true);
  }
  
  let proximity = 1 - (Math.max(TARGET_RSSI - device.rssi, 0) /
                               (TARGET_RSSI - MIN_RSSI));
  eggSize = g.getHeight() * proximity;

  g.clear();
  drawEgg(g.getWidth() / 2, g.getHeight() / 2, eggSize, '#ffffff');
  drawTimer(count, timerColor, timerMagnification);
}


/**
 * Handle the end of the hunt, successful or not.
 * @param {boolean} isSuccess Whether the hunt was successful or not.
 */
function handleEndOfHunt(isSuccess) {
  clearInterval(countInterval);
  NRF.setScan();
  
  if(isSuccess) {
    E.showAlert('SUCCESS!\nYou found the egg!', APP_TITLE).then(function() {
      egghunt();
    });
  }
  else {
    E.showAlert('SO CLOSE!\nTry hunting again!', APP_TITLE).then(function() {
      egghunt();
    });
  }
}


/**
 * Decrement and draw the countdown timer, ending the hunt if zero.
 */
function countdown() {
  if(--count < CRITICAL_TIME_THRESHOLD) {
    timerColor = CRITICAL_TIMER_COLOR;
    timerMagnification = CRITICAL_TIMER_MAGNIFICATION;
  }

  g.clear();
  drawEgg(g.getWidth() / 2, g.getHeight() / 2, eggSize, '#ffffff');
  drawTimer(count, timerColor, timerMagnification);
  g.flip();

  if(count === 0) {
    handleEndOfHunt(false);
  }
}


/**
 * The egg hunt!
 */
function egghunt() {
  E.showPrompt("What to hunt?", INITIAL_PROMPT)
    .then(function(manufacturer) {
      E.showMessage('Detecting eggs...\nStart hunting...', 'Egg Hunt');
      startHunt(manufacturer);
  });
}

egghunt();