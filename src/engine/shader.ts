function createAndValidateShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = createShader(gl, type, source);
  if (shader) return validateShader(gl, shader);
}

// type stands for shader type vertex/fragment
// source stands for ur shader source code
function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);

  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  }

  return shader;
}

function validateShader(gl: WebGL2RenderingContext, shader: WebGLShader) {
  const success = gl.getShaderParameter(shader, gl.SHADER_TYPE);

  if (!success) {
    const shaderLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    throw new Error(`Could not compile shader: ${shaderLog}`);
  }

  return shader;
}

export default createAndValidateShader;

