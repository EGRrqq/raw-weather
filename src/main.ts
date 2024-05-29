import "./style.css";
import * as Canvas from "./canvas";
import * as WebGl from "./webgl";

interface ISetupProgram {
  gl: WebGL2RenderingContext;
  paths: {
    vsPath: string;
    fsPath: string;
  };
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
  // supply data to program
  const { posCount, vao } = supplyDataToProgram(Canvas.gl, program);

  if (!vao) return;

  // draw the scene
  draw(Canvas.gl, program, vao, posCount);
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
  program: WebGLProgram
) {
  // look up where the vertex data needs to go.
  // always do during the init, not in render loop
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // attribute get their data from buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // coords data
  const x = 0;
  const x_offset = 0.005;
  const y = 0;
  const y_offset = 0.07;

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

  const posCount = positions.length;
  return { posCount, vao };
}

function draw(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vao: WebGLVertexArrayObject,
  posCount: number
) {
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);
  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  // set a line width
  gl.lineWidth(7);

  // set uniform var
  const canvasResUniform = gl.getUniformLocation(program, "u_resolution");
  const timeUniform = gl.getUniformLocation(program, "u_time");

  // draw settings
  const primitiveType = gl.LINES;
  const offset = 0;
  const count = posCount || 2;

  const onAnimate = () => {
    // handle canvas resize
    Canvas.resizeData(gl);
    // clear canvas
    Canvas.resizeData(gl);

    // set uniforms
    gl.uniform2f(canvasResUniform, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeUniform, performance.now() / 1000);

    // draw data
    gl.drawArrays(primitiveType, offset, count);

    // perform an animation
    requestAnimationFrame(onAnimate);
  };

  // run the animation
  onAnimate();
}

