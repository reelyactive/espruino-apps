Espruino Apps
=============

Open source software applications for [Espruino](https://www.espruino.com/) devices such as Puck.js, Bangle.js, Jolt.js and Pixl.js.


Programming Espruino Devices
----------------------------

Devices can be programmed via the [Espruino IDE](https://www.espruino.com/ide/), which uses Web Bluetooth.  Simply open in the IDE the file from the corresponding device's folder in this repository and program the device.  Consult our tutorials for step-by-step instructions:
- [Puck.js Development Guide](https://reelyactive.github.io/diy/puckjs-dev/)
- [Bangle.js Development Guide](https://reelyactive.github.io/diy/banglejs-dev/)
- [Jolt.js Development Guide](https://reelyactive.github.io/diy/joltjs-dev/)


App Descriptions
----------------

### Emojuino (emojuino.js)

Program the Bangle.js v2 or BBC micro:bit v2 to allow the user to select and transmit an emoji (or any Unicode character) via Bluetooth Low Energy as an [InteroperaBLE Identifier](https://reelyactive.github.io/interoperable-identifier/).  Available via the [Bangle.js app loader](https://banglejs.com/apps/#emojuino), where the latest version is maintained.

### Knob.js (knob-button.js)

Program the Puck.js v2 to advertise its angle of rotation, like a knob, following a button press.  Works best in the vertical plane (as it uses accelerometer data, rotation angle estimation is not possible in the horizontal plane).  [Load in Espruino IDE](https://www.espruino.com/ide/?codeurl=https://raw.githubusercontent.com/reelyactive/espruino-apps/master/puckjs-v2/knob-button.js)

### Temp.js (temperature.js)

Program the Puck.js v2 to periodically advertise its temperature and battery level, with on demand readings triggered by a button press.  [Load in Espruino IDE](https://www.espruino.com/ide/?codeurl=https://raw.githubusercontent.com/reelyactive/espruino-apps/master/puckjs-v2/temperature.js)

### IoCS Common (iocs-common.js)

Program the Pixl.js to support Bluetooth GATT services and characteristics of the InteroperaBLE Characteristics & Services Common specification.  The LCD displays any characteristic values written by the host, for example using the [iocs-common Web Bluetooth app](https://reelyactive.github.io/gatt-interfaces/iocs-common/).  [Load in Espruino IDE](https://www.espruino.com/ide/?codeurl=https://raw.githubusercontent.com/reelyactive/espruino-apps/master/pixljs/iocs-common.js)

### 12-Year Anniversary Clock

Program the Jolt.js as a physical clock with hour and minute hands, controlled by stepper motors.  [Load in Espruino IDE](https://www.espruino.com/ide/?codeurl=https://raw.githubusercontent.com/reelyactive/espruino-apps/master/joltjs/anniversary-clock.js)

### Egg Hunt (egghunt.js)

Program the Bangle.js to hunt for BLE "eggs" which grow in size the closer they get.  The Puck.js can be programmed to act as an Espruino "egg" which can be switched on/off with a button press.  [Video](https://www.youtube.com/watch?v=oUIwdN5F4yI)

### Contact Tracing (contacttracing.js)

Program the Puck.js to simulate the Contact Tracing service collaboration between Apple and Google ([see specifications](https://www.apple.com/covid19/contacttracing/)) in response to the COVID-19 pandemic.  The Puck.js will transmit a rolling proximity identifier which changes (randomly) every 15 minutes, and can be switched on/off with a button press.  The Bangle.js can be programmed to detect Contact Tracing service transmissions and to vibrate relative to their proximity.


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2020-2025 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.