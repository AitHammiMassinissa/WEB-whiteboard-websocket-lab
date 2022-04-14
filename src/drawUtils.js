import {calque, getCalqueName, setSelectionedButton} from "./calqueUtils";
import {DRAW_TYPE} from "./consUtils";

export let draws;

export function makeDraw(canvas, json) {
    canvas.beginPath();
    canvas.lineWidth = 5;
    canvas.lineCap = 'round';
    canvas.strokeStyle = decodeURIComponent(json.color);
    canvas.moveTo(json.x1, json.y1);
    canvas.lineTo(json.x2, json.y2);
    canvas.stroke();
}

export function reDraw(canvas) {
    for (let i = 0; i < draws.value.length; i++) {
        if (draws.value[i].name === getCalqueName()) {
            drawAllLines(draws.value[i], canvas);
        }
    }
}

export function drawLine(json, context) {
    for (let i = 0; i < draws.value.length; i++) {
        if (draws.value[i].name === json.name) {
            draws.value[i].value.push(json);
        }
    }
    if (json.name === getCalqueName()) {
        makeDraw(context, json.value);
    }
}

export function setup(json, canvas, item) {
    draws = json;

    for (let i = 0; i < json.value[0].value.length; i++) {
        makeDraw(canvas, json.value[0].value[i].value);
    }

    for (let i = 0; i < draws.value.length; i++) {
        if (draws.value[i].name === json.name) {
            draws.value[i].value = json;
        }
        calque(json.value[i].name, canvas, item);
    }

    let but = document.querySelector('#' + json.value[0].name);
    setSelectionedButton(but);
}

export function drawAllLines(array, canvas) {
    if (JSON.stringify(array.value).match(/\[.*\]/)) {
        for (let i = 0; i < draws.value.length; i++) {
            if (draws.value[i].name === array.name) {
                draws.value[i].value = array;
            }
        }
        for (let i = 0; i < array.value.length; i++) {
            makeDraw(canvas, array.value[i].value);
        }
    } else {
        for (let i = 0; i < draws.value.length; i++) {
            if (draws.value[i].name === array.name) {
                draws.value[i].value.push(array);
            }
        }
        if (array.name === getCalqueName()) {
            makeDraw(canvas, array.value);
        }
    }
}

export function addCalque(name) {
    draws.value.push({
        type: DRAW_TYPE,
        name: name,
        value: [],
    });
}

