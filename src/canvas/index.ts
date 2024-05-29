const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const gl = canvas.getContext("webgl2");
export { resizeData } from "./resizeData";
export { clearData } from "./clearData";

