export interface ISetupProgram {
  gl: WebGL2RenderingContext;
  paths: {
    vsPath: string;
    fsPath: string;
  };
}

export interface IParticleData {
  vao: WebGLVertexArrayObject;
  positionBuffer: WebGLBuffer;
  positions: number[][];
  coords: IParticleCoords;
  startTime: number;
}

export interface IParticleCoords {
  x: number;
  x_offset: number;
  y: number;
  y_offset: number;
}

