import type ICanvasController from "@/elements/canvas/ICanvasController";
import type ISource from "@/webgl/interfaces/IPaths";
import { type IParticleData, Particle } from "@/webgl/models/Particle";

import fSource from "@/webgl/shaders/rain/triangle.fs";
import vSource from "@/webgl/shaders/rain/triangle.vs";

export default class Rain {
	RainParticle: Particle;

	constructor(CanvasController: ICanvasController) {
		this.RainParticle = new Particle(CanvasController);
	}

	init = async () => {
		// setup GLSL program
		const paths: ISource = {
			vSource,
			fSource,
		};
		const program = await this.RainParticle.setupProgram({
			source: paths,
		});

		// Store the state of each particle
		const particles: IParticleData[] = [];

		setInterval(() => {
			// Create 10 particles
			for (let i = 0; i < 10; i++) {
				// coords data
				const coords: IParticleData["coords"] = {
					x: Math.randomArbitrary(-1, 1), // Random x position for each particle
					x_offset: 0.005,
					y: 0,
					y_offset: 0.07,
				};

				// supply data to program
				const { positionBuffer, positions, vao } =
					this.RainParticle.supplyDataToProgram({
						program,
						coords,
					});

				const startTime = performance.now() / 1000;
				// push particles
				particles.push({ vao, positionBuffer, positions, coords, startTime });
			}
		}, 250);

		// draw the scene
		this.RainParticle.draw({ program, particles });
	};
}
