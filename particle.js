class Particle {
	constructor() {
		this.pos = createVector(random(width), random(height));
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.maxspeed = 3;

		this.maxForce = 0.2;
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



	// FLOCKING
	align(flock) {
		let perceptionRadius = 50;

		let total = 0;
		// average of velocities
		let steering = createVector();
		for (let other of flock) {
			// if other isnt me and is close to me
			if (other !== this && this.pos.dist(other.pos) < perceptionRadius) {
				steering.add(other.vel);
				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			// debugger;
			steering.setMag(this.maxspeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	cohesion(flock) {
		let perceptionRadius = 50;

		let total = 0;
		// average of positions
		let steering = createVector();
		for (let other of flock) {
			// if other isnt me and is close to me
			if (other !== this && this.pos.dist(other.pos) < perceptionRadius) {
				steering.add(other.pos);
				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			steering.sub(this.pos);
			steering.setMag(this.maxspeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	separation(flock) {
		let perceptionRadius = 50;
		let total = 0;

		// average of positions
		let steering = createVector();
		for (let other of flock) {
			let d = this.pos.dist(other.pos);
			// if other isnt me and is close to me
			if (other !== this && d < perceptionRadius) {
				let diff = p5.Vector.sub(this.pos, other.pos);

				diff.div(d * d);
				steering.add(diff);

				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			steering.setMag(this.maxspeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}

		return steering;
	}

	flock(birds) {
		let alignment = this.align(birds);
		let cohesion = this.cohesion(birds);
		let separation = this.separation(birds);

		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());

		this.acc.add(alignment);
		this.acc.add(cohesion);
		this.acc.add(separation)
	}
}