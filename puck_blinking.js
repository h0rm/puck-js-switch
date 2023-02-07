let led = false;

let toggle = () => {
    led = !led;
    digitalWrite(D1, led);
};

let start = () => {
    setInterval(function () {
        toggle();
    }, 500);
};

let stop = () => {
    clearInterval();
};

let blinking = false;
setWatch(function () {
    if (!blinking) {
        start();
    } else {
        stop();
    }
    blinking = !blinking;
}, BTN, { edge: "rising", debounce: 50, repeat: true });

