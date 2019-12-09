let scl = 50;
let cols, rows;

let zoff = 0;
let inc = 0.075;

let particles = [];

let flowfield = [];
let col_noise = [];

let picture; // if drawing picture

let particleNum = 300;
let transparency = 100;

function preload() {
	picture = loadImage('garden of the gods.jpg'); // if drawing picture
}

function reset() {
	// if drawing colors
	// pixelDensity(1);
	// loadPixels();
	// calcPerlinColors();
	// updatePixels();

	// if drawing pic
	// pixelDensity(1);
	// loadPixels();
	// updatePixels();

	if (chooseSetting) {
		switch (chooseSetting.value()) {
			case 'reveal picture':
				calcPictureColors();
				break;
			case 'reveal perlin noise colours':
				calcPerlinColors();
				break;
		}
	} else {
		calcPictureColors();
	}


	// background(50);
	background('#d8f8ff');
	// background('#000');

	// for (let i = 0; i < 3000; i++) { // if drawing particles
	particles = [];
	for (let i = 0; i < particleNum; i++) { // if drawing particles
		particles[i] = new Particle();
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	cols = floor(width / scl);
	rows = floor(height / scl);

	reset();

	createDom();
}

function draw() {
	// background('#d8f8ff'); // For drawing direction of flowfield

	for (let y = 0; y <= rows; y++) {
		for (let x = 0; x <= cols; x++) {
			let index = (x + y * cols);

			let num = noise(x * inc, y * inc, zoff) * TWO_PI * 4;
			let angle = p5.Vector.fromAngle(num);
			angle.setMag(1);

			flowfield[index] = angle;

			// For drawing direction of flowfield

			// push();

			// stroke(255, 0, 255);

			// translate(x*scl, y*scl);
			// rotate(angle.heading());
			// line(0, 0, scl, 0);

			// pop();
		}

		zoff += inc;
	}

	// For drawing particles
	for (let p of particles) {
		p.show();
		p.update();
		p.edges();
		p.follow(flowfield);
	}
}

function calcPerlinColors() {
	for (let y = 0; y <= height; y++) {
		for (let x = 0; x <= width; x++) {
			let index = (x + y * width);

			// perlin intensity will be between 0-1
			let num = noise(x * inc * perlinIntensity,
				y * inc * perlinIntensity) * TWO_PI * 4;
			let angle = p5.Vector.fromAngle(num);
			angle.setMag(1);

			col_noise[index] = getRawColor(TWO_PI, angle.heading());

			// For just colors
			// Slightly laggy way
			// noStroke();
			// fill(col_noise[index]);
			// rectMode(CORNER);

			// rect(x, y, 1, 1);

			// Slightly faster way (remember to load pixels)
			// let raw_col = getRawColor(TWO_PI, angle.heading());

			// pixels[index * 4 + 0] = raw_col[0];
			// pixels[index * 4 + 1] = raw_col[1];
			// pixels[index * 4 + 2] = raw_col[2];
			// pixels[index * 4 + 3] = 255;
		}
	}
}

function calcPictureColors() {
	picture.resize(width, height);
	picture.loadPixels();

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let index = (x + y * width) * 4; // maybe *4

			col_noise[index / 4] = [
				picture.pixels[index + 0],
				picture.pixels[index + 1],
				picture.pixels[index + 2],
				// picture.pixels[index + 3],
			];

			// pixels[index + 0] = picture.pixels[index + 0];
			// pixels[index + 1] = picture.pixels[index + 1];
			// pixels[index + 2] = picture.pixels[index + 2];
			// pixels[index + 3] = 255;
		}
	}
}