import IPaths from "../../utils/interfaces/IPaths";
import { IParticleCoords, IParticleData } from "./IParticleInfo";

interface IParticle {
  draw: TDraw;
  setupProgram: TSetupProgram;
  supplyDataToProgram: TSupplyDataToProgram;
}

interface IDrawProps {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  particles: IParticleData[];
}

interface ISetupProgramProps {
  gl: WebGL2RenderingContext;
  paths: IPaths;
}

interface ISupplyDataToProgramProps {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  coords: IParticleCoords;
}

type TDraw = ({ gl, particles, program }: IDrawProps) => void;

type TSetupProgram = ({
  gl,
  paths,
}: ISetupProgramProps) => Promise<WebGLProgram | undefined>;

type TSupplyDataToProgram = ({
  gl,
  coords,
  program,
}: ISupplyDataToProgramProps) => Pick<
  IParticleData,
  "positions" | "positionBuffer" | "vao"
>;

export { type IParticle as default };

