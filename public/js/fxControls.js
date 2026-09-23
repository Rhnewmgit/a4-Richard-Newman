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
	pane.title = "Pan betewen ears";
	pane.addBinding(panParams, "pan", {min: -1, max: 1}).label = "L/R";
	const pingPong = pane.addFolder({title: "Ping-pong", expanded: true});
	pingPong.addBinding(panParams, "pingpong").label = "enabled";
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

function eqPane() {
	pane.title = "Apply a lowpass or highpass filter";
	pane.addBinding(eqParams, "enabled");
	pane.on("change", () => {});
}
function pitchTempoPane() {
	pane.title = "Change pitch & tempo";
	pane.addBinding(pitchTempoParams, "pitch").label = "pitch (cents)";
	pane.addBinding(pitchTempoParams, "tempo", {min: 0});
	pane.on("change", () => {});
}
function bitcrusherPane() {
	pane.title = "Distiortion through limiting sample bits";
	pane.addBinding(bitcrusherParams, "bits", {min: 1, max: 16});
	pane.on("change", () => {
		const discreteValues = 2.0 ** bits - 1;
	});
}
function distortionPane() {
	pane.title = "Distortion through clipping";
	pane.addBinding(distortionParams, "enabled");
	pane.addBinding(distortionParams, "drive", {min: 0, max: 40}).label = "drive (db)";
	pane.addBinding(distortionParams, "gain", {min: -20, max: 20}).label = "post gain (db)";
	pane.on("change", () => {});
}
function reverbPane() {
	pane.title = "Echo effect";
	pane.addBinding(reverbParams, "enabled");
	pane.addBinding(reverbParams, "decay", {min: 0, max: 1});
	pane.addBinding(reverbParams, "decay", {min: 0}).label = "delay (ms)";
	pane.on("change", () => {});
}
function stereoDifferencePane() {
	pane.title = "Output only the difference between L and R channels";
	pane.addBinding(stereoDifferenceParams, "enabled");
	pane.on("change", () => {});
}

document.querySelector("#panBtn").addEventListener("click", () => changePane(panPane));
document.querySelector("#EQBtn").addEventListener("click", () => changePane(eqPane));
document.querySelector("#pitchTempoBtn").addEventListener("click", () => changePane(pitchTempoPane));
document.querySelector("#bitcrusherBtn").addEventListener("click", () => changePane(bitcrusherPane));
document.querySelector("#distortionBtn").addEventListener("click", () => changePane(distortionPane));
document.querySelector("#reverbBtn").addEventListener("click", () => changePane(reverbPane));
document.querySelector("#stereoDiffBtn").addEventListener("click", () => changePane(stereoDifferencePane));

const panParams = {
	pan: 0.0,
	pingpong: false,
	frequency: 2,
	amplitude: 0.5,
};

const eqParams = {
	enabled: false,
	lowpass: 100,
	highpass: 2000,
};

const pitchTempoParams = {
	pitch: 0,
	tempo: 1,
};

const bitcrusherParams = {
	enabled: false,
	bits: 4,
};

const distortionParams = {
	enabled: false,
	drive: 0,
	gain: 0,
};

const reverbParams = {
	enabled: false,
	decay: 0,
	delay: 100,
};

const stereoDifferenceParams = {
	enabled: false,
};

window.addEventListener("load", () => hidePane());
