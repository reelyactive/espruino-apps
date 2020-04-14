Espruino Apps
=============

Open source software applications for [Espruino](https://www.espruino.com/) devices such as Puck.js and Bangle.js.


Programming Espruino Devices
----------------------------

Devices can be programmed via the [Espruino IDE](https://www.espruino.com/ide/), which uses Web Bluetooth.  Simply open in the IDE the file from the corresponding device's folder in this repository and program the device.  Consult our tutorials for step-by-step instructions:
- [Develop BLE applications with Puck.js](https://reelyactive.github.io/diy/puckjs-dev/)
- [Develop BLE applications with Bangle.js](https://reelyactive.github.io/diy/banglejs-dev/)


App Descriptions
----------------

### Egg Hunt (egghunt.js)

Program the Bangle.js to hunt for BLE "eggs" which grow in size the closer they get.  The Puck.js can be programmed to act as an Espruino "egg" which can be switched on/off with a button press.  [Video](https://www.youtube.com/watch?v=oUIwdN5F4yI)

### Contact Tracing (contacttracing.js)

Program the Puck.js to simulate the Contact Tracing service collaboration between Apple and Google ([see specifications](https://www.apple.com/covid19/contacttracing/)) in response to the COVID-19 pandemic.  The Puck.js will transmit a rolling proximity identifier which changes (randomly) every 15 minutes, and can be switched on/off with a button press.  The Bangle.js can be programmed to detect Contact Tracing service transmissions and to vibrate relative to their proximity.


License
-------

MIT License

Copyright (c) 2020 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.