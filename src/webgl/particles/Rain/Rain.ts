import { Math } from "../../../utils";
import * as Canvas from "../../../canvas";
import IPaths from "../../utils/interfaces/IPaths";
import { Particle } from "../../models/Particle/Particle";
import {
  IParticleCoords,
  IParticleData,
} from "../../models/Particle/IParticleInfo";

export default class Rain {
  RainParticle: Particle;

  constructor() {
    this.RainParticle = new Particle();
  }

  init = async () => {
    if (!Canvas.gl) return;
    // setup GLSL program
    const paths: IPaths = {
      vsPath: "./shaders/triangle.vs",
      fsPath: "./shaders/triangle.fs",
    };
    const program = await this.RainParticle.setupProgram({
      gl: Canvas.gl,
      paths,
    });

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
        const { positionBuffer, positions, vao } =
          this.RainParticle.supplyDataToProgram({
            gl: Canvas.gl!,
            program,
            coords,
          });

        if (!vao || !positionBuffer) return;

        const startTime = performance.now() / 1000;
        // push particles
        particles.push({ vao, positionBuffer, positions, coords, startTime });
      }
    }, 250);

    // draw the scene
    this.RainParticle.draw({ gl: Canvas.gl, program, particles });
  };
}

