import type { IOffsetCoords } from "@/webgl/interfaces/ICoords";

export interface IParticleData {
	vao: WebGLVertexArrayObject;
	positionBuffer: WebGLBuffer;
	positions: number[][];
	coords: IOffsetCoords;
	startTime: number;
}
