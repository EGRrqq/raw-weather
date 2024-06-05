import { Math } from "../../../utils";
import * as Canvas from "../../../canvas";
import { IParticleCoords, IParticleData, ISetupProgram } from "../interfaces";
import { setupProgram } from "./setupProgram";
import { supplyDataToProgram } from "./supplyDataToProgram";
import { draw } from "./draw";

export async function init() {
  if (!Canvas.gl) return;
  // setup GLSL program
  const paths: ISetupProgram["paths"] = {
    vsPath: "./shaders/triangle.vs",
    fsPath: "./shaders/triangle.fs",
  };
  const program = await setupProgram({ gl: Canvas.gl, paths });

  if (!program) return;
  // Store the state of each particle
  const particles: IParticleData[] = [];

  setInterval(() => {
    // Create 10 particles
    for (let i = 0; i < 10; i++) {
      // coords data
      const coords: IParticleCoords = {
        x: Math.getRandomArbitrary(-1, 1), // Random x position for each particle
        x_offset: 0.005,
        y: 0,
        y_offset: 0.07,
      };

      // supply data to program
      const { positionBuffer, positions, vao } = supplyDataToProgram(
        Canvas.gl!,
        program,
        coords
      );

      if (!vao || !positionBuffer) return;

      const startTime = performance.now() / 1000;
      // push particles
      particles.push({ vao, positionBuffer, positions, coords, startTime });
    }
  }, 250);

  // draw the scene
  draw(Canvas.gl, program, particles);
}

