import 'dotenv/config';
import express from 'express';
import noble from 'noble'
import readline from 'readline';

var uuid = function(uuid_with_dashes) {
  return uuid_with_dashes.replace(/-/g, '');
};

// let uart_service = '6E400001-B5A3-F393-­E0A9-­E50E24DCCA9E'
let UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
let device = "f3:03:1a:10:25:61"

let uart = {
  service: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  tx: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
  rx: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
}

let connection = {
  peripheral: null,
  tx: null
}

function onDiscovery(peripheral) {
  //console.log(peripheral.address)
  if (peripheral.address == device) {
    console.log('discovered puck.js')
    
    noble.stopScanning()
    peripheral.connect( (error) => {
      if (error) return console.log(error)
      
      console.log('connected to puck.js')
      connection.peripheral = peripheral

      peripheral.discoverSomeServicesAndCharacteristics(
        [],
        [],
        (error, services, characteristics) => {
          if (error) return console.log(error)
          characteristics.map( (c) => {
            console.log(c.uuid)
            console.log(uuid(uart.rx))
            if (c.uuid == uuid(uart.rx)) {
              c.subscribe()
              c.on('data', logAnswer);
              console.log('Found rx')
            }
            if (c.uuid == uuid(uart.tx))
              connection.tx = c 
              console.log('Found tx')
          })
        })
      })
  }
}

let logAnswer = (data, isNotification) => {
  console.log(data.toString())
}

function sendCommand(command) {
  const {tx} = connection

  if (tx === null) {
    return 'not connected'
  }
  let data = Buffer.from(command, 'ascii')
  let offset = 0
  let length = 20

  while (offset + length < data.length) {
    let b = data.slice(offset, offset+length)
    tx.write(b, false);
    offset += length
  }
  // send any remainder bytes less than the last 20:
  tx.write(data.slice(offset), false);

  return `sent ${command}`
}

noble.on('discover', onDiscovery)
noble.on('warning', (warning) => {console.log(warning)})
noble.on('scanStart', () => {console.log('Scan started notif')})
noble.on('scanStop', () => {console.log('Scan stopped notif')}) 

noble.on('stateChange', function (state) {
  console.log(state)
  if (state != "poweredOn") return;
  console.log('start scanning')
  noble.startScanning([], true);
});

noble.on('disconnect', () => {
  console.log('disconnected')
  noble.startScanning([], true);
})


const app = express();

app.get('/toggle', (req, res) => {
  let r = sendCommand('toggle()\n')
  console.log(r)
  return res.send(r);
});

app.get('/release', (req, res) => {
  let r = sendCommand('release()\n')
  console.log(r)
  return res.send(r);
});


app.listen(process.env.PORT, process.env.IP, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);

