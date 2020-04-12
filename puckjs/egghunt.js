/**
 * Copyright reelyActive 2020
 * We believe in an open Internet of Things
 */


const LED_BLINK_MILLISECONDS = 200;


let isSleeping = false;


/**
 * Advertise Espruino manufacturer data
 */
function advertiseEspruino() {
  NRF.setAdvertising({}, { manufacturer: 0x0590, manufacturerData: [ 0x00 ] });  
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
      advertiseEspruino();
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


advertiseEspruino();