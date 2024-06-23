import { Math } from "../../../utils";
import Canvas from "../../../canvas";
import IPaths from "../../interfaces/IPaths";
import { IParticleData, Particle } from "../../models/Particle";

export default class Rain {
  RainParticle: Particle;

  constructor() {
    this.RainParticle = new Particle(Canvas);
  }

  init = async () => {
    // setup GLSL program
    const paths: IPaths = {
      vsPath: "./webgl/shaders/triangle.vs",
      fsPath: "./webgl/shaders/triangle.fs",
    };
    const program = await this.RainParticle.setupProgram({
      paths,
    });

    // Store the state of each particle
    const particles: IParticleData[] = [];

    setInterval(() => {
      // Create 10 particles
      for (let i = 0; i < 10; i++) {
        // coords data
        const coords: IParticleData["coords"] = {
          x: Math.getRandomArbitrary(-1, 1), // Random x position for each particle
          x_offset: 0.005,
          y: 0,
          y_offset: 0.07,
        };

        // supply data to program
        const { positionBuffer, positions, vao } =
          this.RainParticle.supplyDataToProgram({
            program,
            coords,
          });

        const startTime = performance.now() / 1000;
        // push particles
        particles.push({ vao, positionBuffer, positions, coords, startTime });
      }
    }, 250);

    // draw the scene
    this.RainParticle.draw({ program, particles });
  };
}

