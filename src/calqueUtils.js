import {draws, makeDraw} from "./drawUtils";

let calqueName = 'index';
export let selectioned;

export function calque(name, context, item) {
    let line;
    let but;
    line = document.createElement('li');
    but = document.createElement('button');
    but.innerText = name;
    but.setAttribute("id", name);
    but.onclick = () => {
        setSelectionedButton(but);
        calqueName = but.innerText;
        clearCanvas(context, canvas);
        for (let i = 0; i < draws.value.length; i++) {
            if (draws.value[i].name === calqueName) {
                for (let j = 0; j < draws.value[i].value.length; j++) {
                    makeDraw(context, draws.value[i].value[j].value);
                }
            }
        }
    }
    line.appendChild(but);
    item.appendChild(line);
}

function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    let w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}

export function setCalqueName(name) {
    calqueName = name;
}

export function getCalqueName() {
    return calqueName;
}

export function setSelectionedButton(button) {
    if (selectioned) {
        selectioned.setAttribute("class", "");
    }
    selectioned = button;
    selectioned.setAttribute("class", "selectioned");
}