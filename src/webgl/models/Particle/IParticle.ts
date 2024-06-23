import IPaths from "../../interfaces/IPaths";
import { IParticleData } from "./IParticleData";

// main particle interface
export default interface IParticle {
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
  coords: IParticleData["coords"];
}

// types for particle functions
type TDraw = (props: IDrawProps) => void;

type TSetupProgram = (props: ISetupProgramProps) => Promise<WebGLProgram>;

type TSupplyDataToProgram = (
  props: ISupplyDataToProgramProps
) => Pick<IParticleData, "positions" | "positionBuffer" | "vao">;

