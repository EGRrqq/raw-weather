import * as WebGl from "../../../webgl/utils";
import { ISetupProgram } from "../interfaces";

export async function setupProgram({ gl, paths }: ISetupProgram) {
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

