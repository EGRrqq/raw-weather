import { IParticleCoords } from "../interfaces";

export function supplyDataToProgram(
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

