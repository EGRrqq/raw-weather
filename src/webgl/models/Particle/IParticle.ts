import IPaths from "../../utils/interfaces/IPaths";
import { IParticleCoords, IParticleData } from "./IParticleInfo";

// main particle interface
interface IParticle {
  draw: TDraw;
  setupProgram: TSetupProgram;
  supplyDataToProgram: TSupplyDataToProgram;
}

// props for particle functions
interface IDrawProps {
  program: WebGLProgram;
  particles: IParticleData[];
}

interface ISetupProgramProps {
  paths: IPaths;
}

interface ISupplyDataToProgramProps {
  program: WebGLProgram;
  coords: IParticleCoords;
}

// types for particle functions based on props
type TDraw = ({ particles, program }: IDrawProps) => void;

type TSetupProgram = ({ paths }: ISetupProgramProps) => Promise<WebGLProgram>;

type TSupplyDataToProgram = ({
  coords,
  program,
}: ISupplyDataToProgramProps) => Pick<
  IParticleData,
  "positions" | "positionBuffer" | "vao"
>;

export { type IParticle as default };

