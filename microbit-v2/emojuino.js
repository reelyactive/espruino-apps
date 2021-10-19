/**
 * Copyright reelyActive 2021
 * We believe in an open Internet of Things
 */


// Emojis are integer pairs with the form [ bitmap, Unicode code point ]
// For code points see https://unicode.org/emoji/charts/emoji-list.html
const EMOJIS = [
    [ 0x0e88140, 0x1f642 ], // Slightly smiling
    [ 0x00f8140, 0x1f610 ], // Neutral
    [ 0x1170140, 0x1f641 ], // Slightly frowning
    [ 0x0e7bc42, 0x1f44d ], // Thumbs up
    [ 0x0213dee, 0x1f44e ], // Thumbs down
    [ 0x0477fea, 0x02764 ], // Heart
];
const EMOJI_TRANSMISSION_MILLISECONDS = 5000;
const BLINK_PERIOD_MILLISECONDS = 500;

// Non-user-configurable constants
const BITMAP_INDEX = 0;
const CODE_POINT_INDEX = 1;
const BTN_WATCH_OPTIONS = { repeat: true, debounce: 20, edge: "falling" };
const UNICODE_CODE_POINT_ELIDED_UUID = [ 0x49, 0x6f, 0x49, 0x44, 0x55,
                                         0x54, 0x46, 0x2d, 0x33, 0x32 ];


// Global variables
let emojiIndex = 0;
let isToggleOn = false;


// Handle a Button A (mode) press: cycle through emojis
function handleButtonAPress() {
  emojiIndex = (emojiIndex + 1) % EMOJIS.length;
  show(EMOJIS[emojiIndex][BITMAP_INDEX]);
}


// Handle a Button B (select) press: transmit displayed emoji
function handleButtonBPress() {
  let emoji = EMOJIS[emojiIndex];
  transmitEmoji(emoji[BITMAP_INDEX], emoji[CODE_POINT_INDEX],
                EMOJI_TRANSMISSION_MILLISECONDS);
}


// Transmit the given code point for the given duration in milliseconds,
// blinking the bitmap once per second.
function transmitEmoji(bitmap, codePoint, duration) {
  let instance = [ 0x00, 0x00, (codePoint >> 24) & 0xff,
                  (codePoint >> 16) & 0xff, (codePoint >> 8) & 0xff,
                  codePoint & 0xff ];

  require('ble_eddystone_uid').advertise(UNICODE_CODE_POINT_ELIDED_UUID,
                                         instance);

  let displayIntervalId = setInterval(toggleBitmap, BLINK_PERIOD_MILLISECONDS,
                                      bitmap);

  setTimeout(terminateEmoji, duration, displayIntervalId);
}


// Terminate the emoji transmission
function terminateEmoji(displayIntervalId) {
  NRF.setAdvertising({ });
  clearInterval(displayIntervalId);
  show(EMOJIS[emojiIndex][BITMAP_INDEX]);
}


// Toggle the display between bitmap/off
function toggleBitmap(bitmap) {
  show(isToggleOn ? bitmap : 0);
  isToggleOn = !isToggleOn;
}


// On start: display the first emoji and watch both buttons
show(EMOJIS[emojiIndex][BITMAP_INDEX]);
setWatch(handleButtonAPress, BTN1, BTN_WATCH_OPTIONS);
setWatch(handleButtonBPress, BTN2, BTN_WATCH_OPTIONS);