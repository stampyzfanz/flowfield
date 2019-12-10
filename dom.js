let chooseSetting;
let perlinIntensity = 0.1;
let isPainting = false;
let isFlocking = false;
let isPerlinFlowing = true;

let separationSlider, cohesionSlider, alignSlider;

let modes = {
	'reveal picture': 'pictureFn',
	'reveal perlin noise colours': 'perlin',
	'paint on normal colours': 'paint',
};

function createDom() {
	let args = [];
	let argsExplain = [];

	let functions = {}

	function br(doPush) {
		let br = createElement('br');
		if (doPush) {
			args.push(br);
		}
		return br;
	}

	function space(doPush) {
		let s = createP('&nbsp'.repeat(4)).style('display', 'inline-block');
		if (doPush) {
			args.push(s);
		}
	}

	function explain(text, doPush) {
		let p = createP(text).style('display', 'inline-block');
		space(doPush);
		if (doPush) {
			argsExplain.push(p);
		}
		return p;
	}

	functions.pictureFn = function() {
		explain('Draw picture:', true);

		args.push(createFileInput(handleFile));
		async function handleFile(file) {
			reset();
			print(file);
			if (file.type === 'image') {
				await console.log(file.data);
				picture = await loadImage(file.data);;
				await sleep(300);

				reset();
			}
		}
		br(true);
	}

	functions.perlin = function() {
		explain('Intensity of colours (rate of change (speed))', true);

		let intensitySlider = createSlider(0, 1, 0.1, 0.01)
			.changed(() => {
				perlinIntensity = intensitySlider.value();
				reset();
			});
		args.push(intensitySlider);

		br(true)
	}

	functions.paint = function() {
		isPainting = true;
	}

	function createNewArguments() {

		// delete old ones
		for (let arg of args) {
			arg.remove();
		}
		args = [];

		for (let elt of argsExplain) {
			elt.remove();
		}
		argsExplain = [];

		isPainting = false;

		// create new ones
		let mode = modes[chooseSetting.value()];
		functions[mode]();

		reset();
	}

	let resetBtn = createButton('reset')
		.mousePressed(reset);

	br();
	br();

	chooseSetting = createSelect();
	for (let mode in modes) {
		if (modes.hasOwnProperty(mode)) {
			chooseSetting.option(mode);
		}
	}

	chooseSetting.changed(createNewArguments);

	explain('How many particles there will be:');
	let particle = createSlider(1, 10000, 3000, 3).changed(() => {
		console.log(particle.value())
		particleNum = particle.value();
		reset();
	});
	br();

	explain('The transparency of each particle:');
	let transparencySlider = createSlider(1, 255, 100, 1).changed(() => {
		console.log(transparencySlider.value())
		transparency = transparencySlider.value();
		reset();
	});
	br();

	let perlinFlowCheckbox = createCheckbox(
			'Perlin noise flow field forces on particles', true)
		.changed(() => {
			isPerlinFlowing = perlinFlowCheckbox.checked();
			// if (flockingCheckbox.value()) {
			// 	flockingDiv.show();
			// } else {
			// 	flockingDiv.hide();
			// }
		});

	let flockingCheckbox = createCheckbox(
			'Flocking simulation forces on particles', false)
		.changed(() => {
			// .isChecked maybe
			isFlocking = flockingCheckbox.checked();
			if (isFlocking) {
				flockingDiv.show();
			} else {
				flockingDiv.hide();
			}
		});

	let flockingDiv = createDiv('').hide();

	explain('Weighting of Align (same direction as neighbours)')
		.parent(flockingDiv);
	alignSlider = createSlider(0, 5, 1, 0.1)
		.parent(flockingDiv);
	br()
		.parent(flockingDiv);

	explain('Weighting of Cohesion (join in flocks - attract))')
		.parent(flockingDiv);
	cohesionSlider = createSlider(0, 5, 1, 0.1)
		.parent(flockingDiv);
	br()
		.parent(flockingDiv);


	explain('Weighting of Seperation (don\'t ram into neigbour))')
		.parent(flockingDiv);
	separationSlider = createSlider(0, 5, 1, 0.1)
		.parent(flockingDiv);






	functions.pictureFn();
}