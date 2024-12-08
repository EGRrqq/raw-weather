import type ICanvasController from "@/elements/canvas/ICanvasController";
import type ISource from "@/webgl/interfaces/IPaths";
import { type IParticleData, Particle } from "@/webgl/models/Particle";

import fSource from "@/webgl/shaders/rain/triangle.fs";
import vSource from "@/webgl/shaders/rain/triangle.vs";

interface ISpawn {
	data: {
		program: WebGLProgram;
		particles: IParticleData[];
	};
}

// settings
export const s = {
	particleCount: 10,
	respawn: {
		timeInSeconds: 0.15,
		flag: false,
	},
};

export default class Rain {
	RainParticle: Particle;
	#spawnId: null | number = null;

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

		// Spawn particles
		this.spawn({
			data: { program, particles },
		});

		// draw the scene
		this.RainParticle.draw({ program, particles });
	};

	reSpawn = ({ data }: ISpawn) => {
		// Clear the existing interval
		if (this.#spawnId) clearInterval(this.#spawnId);

		// Start a new interval with the updated time
		this.spawn({ data });
	};

	spawn = ({ data: d }: ISpawn) => {
		this.#spawnId = setInterval(() => {
			for (let i = 0; i < s.particleCount; i++) {
				// coords data
				const coords: IParticleData["coords"] = {
					x: Math.randomArbitrary(-1, 1), // Random x position for each particle
					x_offset: 0.005,
					y: 1,
					y_offset: 0.07,
				};

				// supply data to program
				const { positionBuffer, positions, vao } =
					this.RainParticle.supplyDataToProgram({
						program: d.program,
						coords,
					});

				const startTime = performance.now() / 1000;
				// push particles
				d.particles.push({ vao, positionBuffer, positions, coords, startTime });

				// respawn particles
				if (s.respawn.flag) {
					s.respawn.flag = false;
					this.reSpawn({ data: d });
				}
			}
		}, s.respawn.timeInSeconds * 1000);
	};
}
