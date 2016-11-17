'use strict';

const KGOAL_SERVICE = '8e7c6065-7656-17ad-1b41-b53d1a548e0d';
const KGOAL_TX_CHAR = '453ad6d2-c7f2-16ae-6948-1859e5f040d0';
const KGOAL_RX_CHAR = '10c2be2d-d2d5-b7a8-5f42-e2468c9ebbf5';

function findDevice() {
  return navigator.bluetooth.requestDevice({
    filters: [{
      services: [KGOAL_SERVICE]
    }]
  });
};

class KHoleWebBluetooth {
  constructor(device) {
    if (device === undefined) {
      throw new Error('KGoalWebBluetooth requires a bluetooth device!');
    }
    this._device = device;
    this._service = undefined;
    this._tx = undefined;
    this._rx = undefined;
    this._msg_queue = [];
  }

  open() {
    return this._device.gatt.connect()
      .then(server => { return server.getPrimaryService(KGOAL_SERVICE); }).catch(er => { console.log(er); })
      .then(service => { this._service = service;
                         return this._service.getCharacteristic(KGOAL_TX_CHAR);
                       }).catch(er => { console.log(er); })
      .then(char => { this._tx = char;
                      return this._service.getCharacteristic(KGOAL_RX_CHAR);
                    }).catch(er => { console.log(er); })
      .then(char => { this._rx = char;
                      return this._rx.startNotifications().then(_ => {
                        this._rx.addEventListener('characteristicvaluechanged', e => {
                          var msg = new Uint8Array(e.target.value.buffer);
                          var cal = msg[3] << 8 | msg[4];
                          var uncal = msg[5] << 8 | msg[6];
                          console.log("Calibrated: " + cal + " Uncalibrated:" + uncal);
                        });
                      });
                    });
  }

  close() {
    if (this._device !== undefined) {
      return this._device.gatt.disconnect();
    }
  }

  _write(cmd) {
    if (this._tx === undefined) {
      return Promise().reject('No tx to write to!');
    }
    return this._tx.writeValue(new TextEncoder('ASCII').encode(cmd));
  }

  _writeFromQueue() {
    if (this._msg_queue.length == 0) {
      return;
    }

    this._write(this._msg_queue[0]).then(() => { this._msg_queue.shift(); this._writeFromQueue(); });
  }

  _queueOrWrite(cmd) {
    this._msg_queue.push(cmd);
    if (this._msg_queue.length == 1) {
      this._writeFromQueue();
    }
  }

  _maybeWrite(cmd, parser) {
    return new Promise((resolve, reject) => {
      this._queueOrWrite(cmd);//.then(() => { resolve('OK'); }).catch((err) => {
      resolve();
        //reject(err);
      //});
    });
  }
};
