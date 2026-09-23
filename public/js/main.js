const audioPlr = document.querySelector(".audioPlayerContainer").querySelector("audio");
audioPlr.src = "./audio/Carefree.mp3";

const canvas = document.querySelector(".audioDisplayContainer").querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 256;
canvasCtx.fillStyle = "#13171f";
canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

/** @type {AudioContext} */
let audioCtx;
export let audioNodes = {};

function start() {
	audioCtx = new AudioContext();

	const analyser = audioCtx.createAnalyser(); // british spelling!
	analyser.fftSize = 2048; // 1024 bins
	analyser.smoothingTimeConstant = 0.6;
	const bufferLength = analyser.frequencyBinCount;

	canvas.width = bufferLength;
	canvas.height = 256;

	const outputNode = effectPipeline();
	outputNode.connect(audioCtx.destination);
	outputNode.connect(analyser);
	const results = new Uint8Array(bufferLength);
	function draw() {
		window.requestAnimationFrame(draw);

		// Clear canvas
		canvasCtx.fillStyle = "#10141b";
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		canvasCtx.fillStyle = "white";

		analyser.getByteFrequencyData(results);
		for (let i = 0; i < bufferLength; i++) {
			canvasCtx.fillRect(i, canvas.height - results[i], 1, results[i]);
		}
	}

	draw();
}

window.onclick = () => {
	start();
	audioPlr.style.pointerEvents = "all";
	window.onclick = null;
};

let inputAudioUrl;

document.querySelector("#audioFileInput").addEventListener("change", (e) => {
	const file = e.target.files[0];
	if (!file) {
		return;
	}
	if (inputAudioUrl) {
		URL.revokeObjectURL(inputAudioUrl);
	}
	inputAudioUrl = URL.createObjectURL(file);
	audioPlr.src = inputAudioUrl;
	audioPlr.load();
});

const audioSelector = document.querySelector("#audioSelector");
audioSelector.addEventListener("change", () => {
	const selected = audioSelector.value;
	if (selected === "upload") {
		audioPlr.src = inputAudioUrl;
	} else {
		audioPlr.src = `./audio/${selected}`;
	}
	audioPlr.play();
});

function effectPipeline() {
	const player = audioCtx.createMediaElementSource(audioPlr);
	audioNodes.player = player;
	return panNodes(player);
}

function panNodes(inputNode) {
	const pan = audioCtx.createStereoPanner();
	inputNode.connect(pan);
	const pingPong = audioCtx.createStereoPanner();
	const osc = audioCtx.createOscillator();
	const oscGain = audioCtx.createGain();
	pan.connect(pingPong);
	osc.frequency.value = 0.25;
	oscGain.gain.value = 0;
	osc.start();
	osc.connect(oscGain);
	oscGain.connect(pingPong.pan);
	audioNodes.panNodes = {
		pan,
		pingPong: {
			stereoPanner: pingPong,
			osc,
			oscGain,
		},
	};
	return pingPong;
}
