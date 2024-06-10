import * as WebGl from "../../utils";
import * as Canvas from "../../../canvas";
import IParticle from "./IParticle";

export class Particle implements IParticle {
  draw: IParticle["draw"] = ({ gl, particles, program }) => {
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
  };

  setupProgram: IParticle["setupProgram"] = async ({ gl, paths }) => {
    // create shaders
    const [vertSource, fragSource] = await Promise.all([
      fetch(paths.vsPath).then((res) => res.text()),
      fetch(paths.fsPath).then((res) => res.text()),
    ]);

    const vertexShader = WebGl.createShader(gl, gl.VERTEX_SHADER, vertSource);
    const fragmentShader = WebGl.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragSource
    );

    // create program
    if (!vertexShader || !fragmentShader) return;
    const program = WebGl.createProgram(gl, vertexShader, fragmentShader);

    return program;
  };

  supplyDataToProgram: IParticle["supplyDataToProgram"] = ({
    gl,
    coords,
    program,
  }) => {
    // look up where the vertex data needs to go.
    // always do during the init, not in render loop
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      "a_position"
    );
    // attribute get their data from buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

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
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(positions.flat()),
      gl.STATIC_DRAW
    );

    // attribute state
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // tells webgl that we want to get data out of buffer
    gl.enableVertexAttribArray(positionAttributeLocation);

    // tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = positions[0].length; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // --- good idea to move it into decorator/mixin ---
    // --- smth like @isValidate ---
    // check if vao and pos buffer are created
    if (!vao) throw new Error("Failed to create vao");
    if (!positionBuffer) throw new Error("Failed to create position buffer");

    return { positions, positionBuffer, vao };
  };
}

