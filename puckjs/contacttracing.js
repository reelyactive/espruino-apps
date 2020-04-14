/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const LED_BLINK_MILLISECONDS = 200;
const CHANGE_INTERVAL_MILLISECONDS = 900000;
const CONTACT_TRACING_SERVICE_UUID = 0xfd6f;
const PROXIMITY_IDENTIFIER = [ 0xc0, 0x41, 0xd1, 0x9a, 0x44, 0x1e, 0x90, 0x09,
                               0x1e, 0xc0, 0x47, 0xac, 0x77, 0x2a, 0xc1, 0x89 ];


let isSleeping = false;
let rollingProximityIdentifier = PROXIMITY_IDENTIFIER.slice();


/**
 * Advertise Contact Tracing service with the rolling proximity identifier
 */
function advertiseContactTracing() {
  let data = {};
  data[CONTACT_TRACING_SERVICE_UUID] = rollingProximityIdentifier;

  NRF.setAdvertising(data);  
}


/**
 * Change (randomly) the rolling proximity identifier
 */
function changeRollingProximityIdentifier() {
  rollingProximityIdentifier.forEach(function(byte, index) {
    rollingProximityIdentifier[index] = Math.round(Math.random() * 0xff);
  });

  advertiseContactTracing();
}


/**
 * Watch the button to toggle between sleep and wake
 */
setWatch(function(e) {
  if(isSleeping) {
    LED2.write(true); // Green = wake
    setTimeout(function () {
      LED2.write(false);
      isSleeping = false;
      NRF.wake();
      advertiseContactTracing();
    }, LED_BLINK_MILLISECONDS);
  }
  else {
    LED1.write(true); // Red = sleep
    isSleeping = true;
    setTimeout(function () {
      LED1.write(false);
      NRF.sleep();
    }, LED_BLINK_MILLISECONDS);
  }
}, BTN, { edge: "rising", repeat: true, debounce: 50 });


advertiseContactTracing();
setInterval(changeRollingProximityIdentifier, CHANGE_INTERVAL_MILLISECONDS);