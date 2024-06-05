import * as Canvas from "../../../canvas";
import { IParticleData } from "../interfaces";

export function draw(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  particles: IParticleData[]
) {
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // set a line width
  gl.lineWidth(7);

  // set uniform vars
  const canvasResUniform = gl.getUniformLocation(program, "u_resolution");
  const timeUniform = gl.getUniformLocation(program, "u_time");
  const xPosUniform = gl.getUniformLocation(program, "u_xPos");

  // draw settings
  const primitiveType = gl.LINES;
  const offset = 0;

  const onAnimate = () => {
    // handle canvas resize
    Canvas.resizeData(gl);
    // clear canvas
    Canvas.clearData(gl);

    // set current canvas resolution
    gl.uniform2f(canvasResUniform, gl.canvas.width, gl.canvas.height);

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
        gl.deleteVertexArray(vao);
        gl.deleteBuffer(positionBuffer);
      } else {
        // set init xPos
        gl.uniform1f(xPosUniform, coords.x);
        // set time for shader animation
        gl.uniform1f(timeUniform, time());

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // draw data
        gl.drawArrays(primitiveType, offset, positions.length);
      }
    }

    // perform an animation
    requestAnimationFrame(onAnimate);
  };

  // run the animation
  onAnimate();
}

