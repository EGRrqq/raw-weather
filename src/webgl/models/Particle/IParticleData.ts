import { IOffsetCoords } from "../../interfaces/ICoords";

export interface IParticleData {
  vao: WebGLVertexArrayObject;
  positionBuffer: WebGLBuffer;
  positions: number[][];
  coords: IOffsetCoords;
  startTime: number;
}

