/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


// User-configurable constants
const NAME_ADVERTISING_PERIOD_MILLISECONDS = 5000;
const STEP_FREQUENCY_HZ = 100;           // 28BYJ-48 = 100Hz
const HOURS_STEPS_PER_ROTATION = 2038;   // 28BYJ-48 = 2038
const MINUTES_STEPS_PER_ROTATION = 2038; // 28BYJ-48 = 2038


// Non-user-configurable constants


// Global variables
let hourStepper;
let minuteStepper;
let hourZeroSteps = 0;
let hourTwelveSteps = 510;
let minuteZeroSteps = 0;
let minuteSixtySteps = 510;


// Advertise the name "Clock.js"
function advertiseName() {
  NRF.setAdvertising({}, {
      showName: false,
      manufacturer: 0x0590,
      manufacturerData: JSON.stringify({ name: "Clock.js" }),
      interval: NAME_ADVERTISING_PERIOD_MILLISECONDS
  });
}


// Initialise the stepper motors for the hours and minutes hands
function initialiseStepperMotors() {
  Jolt.setDriverMode(0, true); // Enables H0..H3 as independent bridge
  Jolt.setDriverMode(1, true); // Enables H4..H7 as independent bridge
  hourStepper = new Stepper({ pins : [ H0, H1, H2, H3 ],
                              freq : STEP_FREQUENCY_HZ });
  minuteStepper = new Stepper({ pins : [ H4, H5, H6, H7 ],
                                freq : STEP_FREQUENCY_HZ });
}


// Adjust the stepper motors in sequence and sleep until the next time iteration
function updateClock() {
  let now = Date.now();
  let minuteStepPosition = calculateMinuteStepPosition(now);
  let isMinuteMovement = (minuteStepPosition !== minuteStepper.getPosition());
  LED2.set();

  // Adjust the minute hand first
  if(isMinuteMovement) {
    minuteStepper.moveTo(minuteStepPosition, { turnOff: true }).then(() => {
      let hourStepPosition = calculateHourStepPosition(now);
      let isHourMovement = (hourStepPosition !== hourStepper.getPosition());

      // Adjust the hour hand next (hour only changes if minutes change)
      if(isHourMovement) {
        hourStepper.moveTo(hourStepPosition, { turnOff: true }).then(() => {
          setTimeout(updateClock, calculateNextUpdateMilliseconds(now));
          LED2.reset();
        });
      }
      else {
        setTimeout(updateClock, calculateNextUpdateMilliseconds(now));
        LED2.reset();
      }
    });
  }
  else {
    setTimeout(updateClock, calculateNextUpdateMilliseconds(now));
    LED2.reset();
  }
}


// Calculate hour step position
function calculateHourStepPosition(now) {
  let hour = new Date(now).getHours() % 12;
  return hourZeroSteps + Math.round(hourTwelveSteps * (hour / 12));
}


// Calculate minute step position
function calculateMinuteStepPosition(now) {
  let minute = new Date(now).getMinutes();
  return minuteZeroSteps + Math.round(minuteSixtySteps * (minute / 60));
} 


// Calculate the number of milliseconds until the next update
function calculateNextUpdateMilliseconds(now) {
  return 1000 - (Math.floor(now) % 1000);
}


// Handle a button press: TODO
function handleButton() {
  // TODO
}


// Start the clock
advertiseName();
initialiseStepperMotors();
updateClock();
setWatch(handleButton, BTN, { edge: "rising", repeat: true, debounce: 50 });