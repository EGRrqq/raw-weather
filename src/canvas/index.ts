const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const getGl = () => {
  const ctx = canvas.getContext("webgl2");
  if (!ctx) throw new Error("Error while getting webgl2 context");

  return ctx;
};

export const gl = getGl();
export { resizeData } from "./resizeData";
export { clearData } from "./clearData";

