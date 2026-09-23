const audioPlr = document.querySelector(".audioPlayerContainer").querySelector("audio");
audioPlr.src = "./audio/Carefree.mp3";

const canvas = document.querySelector(".audioDisplayContainer").querySelector("canvas");
const canvasCtx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 256;
canvasCtx.fillStyle = "#13171f";
canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

function start() {
	const audioCtx = new AudioContext();

	const analyser = audioCtx.createAnalyser(); // british spelling!
	analyser.fftSize = 2048; // 1024 bins
	const bufferLength = analyser.frequencyBinCount;

	canvas.width = bufferLength;
	canvas.height = 256;

	const player = audioCtx.createMediaElementSource(audioPlr);
	player.connect(audioCtx.destination);
	player.connect(analyser);
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
