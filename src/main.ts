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
  const vao = supplyDataToProgram(Canvas.gl, program);

  if (!vao) return;
  // handle canvas resize
  canvasResize(Canvas.gl);
  // clear canvas
  clearCanvas(Canvas.gl);

  // draw the scene
  draw(Canvas.gl, program, vao);
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

  // prettier-ignore
  // put data in the buffer, three 2d points, for triangle
  const positions: Iterable<number> = [
    0, 0,
    0.5, 0.3,
    0.7, 0.2
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // attribute state
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // tells webgl that we want to get data out of buffer
  gl.enableVertexAttribArray(positionAttributeLocation);

  // tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  const size = 2; // 2 components per iteration
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

  return vao;
}

function canvasResize(gl: WebGL2RenderingContext) {
  Canvas.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function clearCanvas(gl: WebGL2RenderingContext) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function draw(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  vao: WebGLVertexArrayObject
) {
  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  // draw
  const primitiveType = gl.TRIANGLES;
  const offset_arrays = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset_arrays, count);
}

