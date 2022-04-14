import './index.css';
import nameGenerator from './name-generator';
import colorGenerator from './color-generator';
import isDef from './is-def';
import {addCalque, drawAllLines, drawLine, setup} from './drawUtils'
import {calque, getCalqueName} from "./calqueUtils";
import {ALL_DRAW, CALQUE, DRAW_TYPE, LINE_TYPE} from "./consUtils";


// Store/retrieve the name in/from a cookie.
const cookies = document.cookie.split(';');

let wsname;
let wscolor;

let wsargs = cookies.find(function (c) {
    return c.match(/wsname/) !== null && c.match(/wscolor/) !== null;
});


if (isDef(wsargs)) {
    let args = wsargs.split(encodeURIComponent(";"));
    wsname = args[0].split('=')[1];
    wscolor = args[1].split('=')[1];
} else {
    wsname = nameGenerator();
    wscolor = colorGenerator();
    document.cookie = "wsname=" + encodeURIComponent(wsname) + encodeURIComponent(";") + "wscolor=" + encodeURIComponent(wscolor);
}

// Set the name in the header
document.querySelector('header>p').textContent = decodeURIComponent(wsname);
document.querySelector('header>p').setAttribute('style', 'color:' + decodeURIComponent(wscolor));

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://" + window.location.host + "/socket");

// We get notified once connected to the server
ws.onopen = (event) => {
    console.log("We are connected.");
};

const calques = document.querySelector('#calques');
ws.onmessage = (event) => {
    let array = JSON.parse(event.data);
    if (array.type && array.value) {
        if (array.type === DRAW_TYPE) {
            drawAllLines(array, contextCanvas);
        } else if (array.type === LINE_TYPE && array.value) {
            drawLine(array, contextCanvas);
        } else if (array.type === CALQUE && array.value) {
            addCalque(array.value);
            calque(array.value, contextCanvas, calques);
        } else if (array.type === ALL_DRAW) {
            setup(array, contextCanvas, calques);
        }
    }
};


function sendLine(event) {
    event.preventDefault();
    event.stopPropagation();
    const array = {
        type: LINE_TYPE,
        name: getCalqueName(),
        value: {
            'x1': beginX - canvas.offsetLeft,
            'y1': beginY - canvas.offsetTop,
            'x2': event.clientX - canvas.offsetLeft,
            'y2': event.clientY - canvas.offsetTop,
            'color': wscolor
        }
    }
    ws.send(JSON.stringify(array));
}


function downEvent(event) {
    downMouse = true;
}

function upEvent(event) {
    downMouse = false;
    beginX = NaN;
    beginY = NaN;
}

function overEvent(event) {
    overMouse = true;
}

function outEvent(event) {
    overMouse = false;
    downMouse = false;
    beginX = NaN;
    beginY = NaN;
}

function moveEvent(event) {
    if (overMouse && downMouse) {
        if (isNaN(beginX) && isNaN(beginY)) {
            beginX = event.clientX;
            beginY = event.clientY;
        }
        sendLine(event)
        beginX = event.clientX;
        beginY = event.clientY;
    }
}

let downMouse = false;
let overMouse = false;
let beginX = NaN;
let beginY = NaN;

const sendCanvas = document.querySelector('#canvas');
const contextCanvas = sendCanvas.getContext('2d');
sendCanvas.addEventListener('mousedown', downEvent, true);
sendCanvas.addEventListener('mouseup', upEvent, true);
sendCanvas.addEventListener('mouseout', outEvent, true);
sendCanvas.addEventListener('mouseover', overEvent, true);
sendCanvas.addEventListener('mousemove', moveEvent, true);


function addDraw(event) {
    event.preventDefault();
    event.stopPropagation();
    if (sendInput.value !== '' && sendInput.value.match(/^[aA-zZ]+$/)) {
        ws.send(JSON.stringify({
            type: CALQUE,
            value: sendInput.value
        }));
    }
    sendInput.value = '';
}


const sendForm = document.querySelector('form');
const sendInput = document.querySelector('form input');
sendForm.addEventListener('submit', addDraw, true);
sendForm.addEventListener('blur', addDraw, true);
