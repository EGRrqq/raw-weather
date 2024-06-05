function createAndValidateProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (program) return validateProgram(gl, program);
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();

  if (program) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    return program;
  }
}

function validateProgram(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    const programLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);

    throw new Error(`program failed to link: ${programLog}`);
  }

  return program;
}

export default createAndValidateProgram;

