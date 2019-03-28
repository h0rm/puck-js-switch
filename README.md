# puck-js-switch

This small project allows the control of a door opening magnet remotely using a
puck.js

# Install 

1. upload `puck.js` code to puck.js
2. connect super strong magnet to pin `D1` using MOSFET as described in https://www.espruino.com/mosfets
3. install node
4. `npm install` in project dir
5. run server with `node --experimental-modules discover.mjs`

The server connects to the puck.js via bluetooth and releases pin `D1` when the
api endpoint is called. UART is used for simplicity. This is not secure at
all!! Don't use this for your super secret safe. 

# API

Toggle green led with:

curl http://localhost:6666/toggle

Release door magnet connected to D1 with:

curl http://localhost:6666/release
