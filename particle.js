class Particle {
	constructor() {
		this.pos = createVector(random(width), random(height));
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.maxspeed = 3;
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	edges() {
		if (this.pos.x > width) this.pos.x = (0);
		if (this.pos.x < 0) this.pos.x = (width);
		if (this.pos.y > height) this.pos.y = (0);
		if (this.pos.y < 0) this.pos.y = (height);
	}

	applyForce(f) {
		this.acc.add(f);
	}

	show() {
		// Pick color scheme of particles

		// Absolute or on position
		stroke(0);
		// stroke(this.pos.x, this.pos.y, (this.pos.x + this.pos.y)/2, 10);
		// stroke(this.pos.x, this.pos.y, (this.vel.x+this.vel.y)/2, 10);
		// stroke(this.pos.x, (this.vel.x+this.vel.y)/2, this.pos.y);
		// point(this.pos.x, this.pos.y);

		// Pics or stuff
		if (!isPainting) {
			try {
				let index = Math.floor(this.pos.x) + Math.floor(this.pos.y) * width;

				let col = col_noise[index];
				// console.log(col);

				if (typeof col !== 'object') throw 'err';

				// stroke(col[0], col[1], col[2], 10);
				stroke(col[0], col[1], col[2], transparency);
			} catch (err) {}
		}

		let prevpos = {
			'x': this.pos.x - this.vel.x,
			'y': this.pos.y - this.vel.y
		};

		line(this.pos.x, this.pos.y, prevpos.x, prevpos.y);
	}

	follow(vectors) {
		let x = floor(this.pos.x / scl);
		let y = floor(this.pos.y / scl);
		let index = x + y * cols;

		let force = vectors[index];
		this.force = force;
		// this.color = vectors[index].col;

		// console.log(x, y);
		// console.log(index);

		this.applyForce(force);
	}
}