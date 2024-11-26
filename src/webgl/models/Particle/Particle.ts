import * as WebGl from "@/webgl/utils";
import ICanvasController from "@/elements/canvas/ICanvasController";
import IParticle from "./IParticle";

import vertSource from "@/webgl/shaders/triangle.vs";
import fragSource from "@/webgl/shaders/triangle.fs";

export class Particle implements IParticle {
	// declare constants
	#canvas: ICanvasController;
	#gl: WebGL2RenderingContext;

	constructor(canvasController: ICanvasController) {
		// assign canvas controller
		this.#canvas = canvasController;
		// get instance of gl context only once
		this.#gl = this.#canvas.gl;
	}

	draw: IParticle["draw"] = ({ particles, program }) => {
		// Tell it to use our program (pair of shaders)
		this.#gl.useProgram(program);

		// set a line width
		this.#gl.lineWidth(7);

		// set uniform vars
		const canvasResUniform = this.#gl.getUniformLocation(
			program,
			"u_resolution",
		);
		const timeUniform = this.#gl.getUniformLocation(program, "u_time");

		// draw settings
		const primitiveType = this.#gl.LINES;
		const offset = 0;

		const onAnimate = () => {
			// handle canvas resize
			this.#canvas.resizeData({ gl: this.#gl });
			// clear canvas
			this.#canvas.clearData({ gl: this.#gl });

			// set current canvas resolution
			this.#gl.uniform2f(
				canvasResUniform,
				this.#gl.canvas.width,
				this.#gl.canvas.height,
			);

			// draw each particle
			for (let i = 0; i < particles.length; i++) {
				const { vao, positionBuffer, positions, coords, startTime } =
					particles[i];

				// particle frame rate
				const time = () => performance.now() / 1000 - startTime;

				// calc particle height
				const height = coords.y_offset * 2;
				// calc current particle y coord
				const y = -time() - height;

				// If the particle is out of the canvas
				if (y < -1) {
					// remove it from the particles array
					particles.splice(i, 1);

					// delete VAO and buffer to free up memory
					this.#gl.deleteVertexArray(vao);
					this.#gl.deleteBuffer(positionBuffer);
				} else {
					// set time for shader animation
					this.#gl.uniform1f(timeUniform, time());

					// Bind the attribute/buffer set we want.
					this.#gl.bindVertexArray(vao);

					// draw data
					this.#gl.drawArrays(primitiveType, offset, positions.length);
				}
			}

			// perform an animation
			requestAnimationFrame(onAnimate);
		};

		// run the animation
		onAnimate();
	};

	setupProgram: IParticle["setupProgram"] = async () => {
		// create shaders
		const vertexShader = WebGl.createShader(
			this.#gl,
			this.#gl.VERTEX_SHADER,
			vertSource,
		);
		const fragmentShader = WebGl.createShader(
			this.#gl,
			this.#gl.FRAGMENT_SHADER,
			fragSource,
		);

		// create program
		const program = WebGl.createProgram(this.#gl, vertexShader, fragmentShader);

		return program;
	};

	supplyDataToProgram: IParticle["supplyDataToProgram"] = ({
		coords,
		program,
	}) => {
		// look up where the vertex data needs to go.
		// always do during the init, not in render loop
		const positionAttributeLocation = this.#gl.getAttribLocation(
			program,
			"a_position",
		);
		// attribute get their data from buffer
		const positionBuffer = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);

		// coords data
		const { x, x_offset, y, y_offset } = coords;

		// put data in the buffer, two 2d points
		const positions = [
			[x, y + y_offset],
			[x, y - y_offset],

			[x - x_offset, y + y_offset],
			[x, y - y_offset],

			[x + x_offset, y + y_offset],
			[x, y - y_offset],
		];
		this.#gl.bufferData(
			this.#gl.ARRAY_BUFFER,
			new Float32Array(positions.flat()),
			this.#gl.STATIC_DRAW,
		);

		// attribute state
		const vao = this.#gl.createVertexArray();
		this.#gl.bindVertexArray(vao);

		// tells webgl that we want to get data out of buffer
		this.#gl.enableVertexAttribArray(positionAttributeLocation);

		// tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		const size = positions[0].length; // 2 components per iteration
		const type = this.#gl.FLOAT; // the data is 32bit floats
		const normalize = false; // don't normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0; // start at the beginning of the buffer
		this.#gl.vertexAttribPointer(
			positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset,
		);

		// check if vao and pos buffer are created
		if (!vao) throw new Error("Failed to create vao");
		if (!positionBuffer) throw new Error("Failed to create position buffer");

		return { positions, positionBuffer, vao };
	};
}
