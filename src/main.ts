import "./style.css";
import * as Canvas from "./canvas";
import * as WebGl from "./webgl";
import { Math } from "./utils";

interface ISetupProgram {
  gl: WebGL2RenderingContext;
  paths: {
    vsPath: string;
    fsPath: string;
  };
}

interface IParticleData {
  vao: WebGLVertexArrayObject;
  positionBuffer: WebGLBuffer;
  positions: number[][];
  coords: ICoords;
  startTime: number;
}

interface IParticleCoords {
  x: number;
  x_offset: number;
  y: number;
  y_offset: number;
}

interface ICoords {
  x: number;
  x_offset: number;
  y: number;
  y_offset: number;
}

window.addEventListener("DOMContentLoaded", init, { once: true });

async function init() {
  if (!Canvas.gl) return;
  // setup GLSL program
  const paths: ISetupProgram["paths"] = {
    vsPath: "./shaders/triangle.vs",
    fsPath: "./shaders/triangle.fs",
  };
  const program = await setupProgram({ gl: Canvas.gl, paths });

  if (!program) return;
  // Store the state of each particle
  const particles: IParticleData[] = [];

  setInterval(() => {
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
      // coords data
      const coords: ICoords = {
        x: Math.getRandomArbitrary(-1, 1), // Random x position for each particle
        x_offset: 0.005,
        y: 0,
        y_offset: 0.07,
      };

      // supply data to program
      const { positionBuffer, positions, vao } = supplyDataToProgram(
        Canvas.gl!,
        program,
        coords
      );

      if (!vao || !positionBuffer) return;

      const startTime = performance.now() / 1000;
      // push particles
      particles.push({ vao, positionBuffer, positions, coords, startTime });
    }
  }, 250);

  // draw the scene
  draw(Canvas.gl, program, particles);
}

async function setupProgram({ gl, paths }: ISetupProgram) {
  // create shaders
  const [vertSource, fragSource] = await Promise.all([
    fetch(paths.vsPath).then((res) => res.text()),
    fetch(paths.fsPath).then((res) => res.text()),
  ]);

  const vertexShader = WebGl.createShader(gl, gl.VERTEX_SHADER, vertSource);
  const fragmentShader = WebGl.createShader(gl, gl.FRAGMENT_SHADER, fragSource);

  // create program
  if (!vertexShader || !fragmentShader) return;
  const program = WebGl.createProgram(gl, vertexShader, fragmentShader);

  return program;
}

function supplyDataToProgram(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  coords: IParticleCoords
) {
  // look up where the vertex data needs to go.
  // always do during the init, not in render loop
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
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

  return { positions, positionBuffer, vao };
}

function draw(
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

