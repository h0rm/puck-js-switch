let state = 0;// 0 - off, 1 - on, 2 - blinking
const n_states = 3;

let led = false;
let toggle = () => {
    led = !led;
    digitalWrite(D1, led);
};

let blinking = () => {
    clearInterval();
    toggle();
    setInterval(function () {
        toggle();
    }, 500);
};

let blinking_interval = (timeout_ms) => {
    clearInterval();
    toggle();
    timeout_ms = Math.max(timeout_ms,100); //not faster than 100ms
    timeout_ms = Math.min(timeout_ms,100000); //not slower than 10s
    setInterval(function () {
        toggle();
    }, timeout_ms);
};

let on = () => {
    clearInterval();
    digitalWrite(D1, true);
};

let off = () => {
    clearInterval();
    digitalWrite(D1, false);
};

setWatch(function () {
    state = (state + 1) % n_states;

    switch (state) {
        case 0: off(); break;
        case 1: on(); break;
        case 2: blinking(); break;
        default: off(); break;
    }
}, BTN, { edge: "rising", debounce: 50, repeat: true });

