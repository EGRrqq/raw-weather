import "./style.css";
import createShader from "./engine/shader";
import { fragmentShaderSource, vertexShaderSource } from "./engine/sources";
import createProgram from "./engine/program";
import { gl, resizeCanvasToDisplaySize } from "./engine/canvas";

function init() {
  // create shaders
  if (!gl) return;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // create program
  if (!vertexShader || !fragmentShader) return;
  const program = createProgram(gl, vertexShader, fragmentShader);

  // supply data to program
  if (!program) return;
  // look up where the vertex data needs to go.
  // always do during the init, not in render loop
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // attribute get their data from buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // prettier-ignore
  // put data in the buffer
  // three 2d points, for triangle
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

  // handle canvas resize
  resizeCanvasToDisplaySize(gl.canvas);
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // clear canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

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

window.addEventListener("DOMContentLoaded", init, { once: true });
