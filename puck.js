
let led = false;

let toggle = () => {
  led = ! led;
  digitalWrite(LED2, led);
};

D1.set();

let release = () => {
  D1.reset();
  LED1.set();
  setTimeout(() => {
    D1.set();
    LED1.reset();
  }, 100);
};

setWatch(function() {
  release();
}, BTN, {edge:"rising", debounce:50, repeat:true});