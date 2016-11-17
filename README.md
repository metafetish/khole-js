# kHole (Javascript Version)

Reverse engineered drivers for the
[Minna kGoal](http://www.minnalife.com/products/kgoal) kegel
exerciser.

Python version at [khole-py](https://github.com/metafetish/khole-py).

## Description

The kGoal is a Bluetooth LE Kegelcizer device, made to communicate
with iPhone and android phones. The kHole project aims to make the
device accessible to other platforms, such as desktop, arduino,
Raspberry Pi, and other bluetooth accessible systems.

## Protocol

In terms of communication, the kGoal is a fairly simple device, It
uses BTLE to connect to a host, with no pairing or long term key
exchange. After this, the host can do the following things:

- Request the values of the internal pressure sensor
- Set whether vibration feedback happens via "Squeeze Pillow" or
  "Control Arm"
  
That's pretty much it.

To read information from the device, issue a characteristic read
request to handle 0x2a. This should return a 19 byte value, similar to
the one below:

00 01 04 01 9b 07 67 00 00 00 00 00 00 00 00 00 00 00

The important values are:

- bytes 3-4 (0x019b in example) - This is the big-endian calibrated
  sensor reading, starting from 0 based on the last calibration
  setting and going up. Calibration can be reset by hitting the button
  on the top of the toy, which makes the LED turn green.
- bytes 5-6 (0x0767 in example) - This is the big-endian uncalibrated
  sensor reading. It'll always report the same range no matter the
  calibration setting.

In the case of our example above, the calibration point was set at
0x767 - 0x19b = 0x5cc. If the uncalibrated reading is <= 0x5cc, the
calibrated reading will just read 0x0.

## Javascript Implementation for WebBluetooth

The WebBluetooth implementation of the library allows access to the
aforementioned functionality thru web browsers supporting the
WebBluetooth API. At the time of this writing, the only browser
supporting this is Google Chrome >= 54 for Mac, Linux, Android M, and
Chrome OS. Windows is currently not supported, but hopefully will be
soon.

## Javascript Implementation for Node.js

_NOTE:_ Node.js support not yet implemented.

The node.js implementation in the library allows access to the
aforementioned functionality. It uses the bleno library
(https://github.com/sandeepmistry/bleno) to access BLE. It should work
on mac and linux with no special work necessary. It will work on
Windows if WinUSB drivers are used for the bluetooth dongle.

## License

kHole-py is BSD licensed.

    Copyright (c) 2016, Metafetish
    All rights reserved.
    
    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright notice, this
      list of conditions and the following disclaimer.
    
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.
    
    * Neither the name of the project nor the names of its
      contributors may be used to endorse or promote products derived from
      this software without specific prior written permission.
    
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
