import {Pane} from "./tweakpane.min.js"; // "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js";
import {audioNodes} from "./main.js";

const paneContainer = document.querySelector(".audioFXControls");
const canvasContainer = document.querySelector(".audioDisplayContainer");

let pane = new Pane({container: paneContainer});

function changePane(panefunc) {
	pane.dispose();
	pane = new Pane({container: paneContainer});
	canvasContainer.style.width = "50lvw";
	paneContainer.removeAttribute("hidden");
	panefunc();
	pane.addButton({title: "Hide"}).on("click", hidePane);
}

function hidePane() {
	paneContainer.setAttribute("hidden", true);
	canvasContainer.style.width = "100lvw";
}

function panPane() {
	pane.addBinding(panParams, "pan");
	const pingPong = pane.addFolder({title: "Ping-pong", expanded: true});
	pingPong.addBinding(panParams, "pingpong");
	pingPong.addBinding(panParams, "frequency", {min: 0, max: 50});
	pingPong.addBinding(panParams, "amplitude", {min: 0, max: 1});
	pane.on("change", () => {
		const panNodes = audioNodes.panNodes;
		panNodes.pan.pan.value = panParams.pan;
		const pingPong = panNodes.pingPong;
		pingPong.osc.frequency.value = panParams.frequency;
		pingPong.oscGain.gain.value = panParams.pingpong ? panParams.amplitude : 0;
	});
}

document.querySelector("#panBtn").addEventListener("click", () => changePane(panPane));

window.addEventListener("load", () => changePane(panPane));
// document.querySelectorAll(".audioFXButtons > button").forEach((element) => {
// 	element.addEventListener("click", () => {
// 		console.log(element);
// 	});
// });

const panParams = {
	pan: 0.5,
	pingpong: false,
	frequency: 2,
	amplitude: 0.5,
};
