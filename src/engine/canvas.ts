// canvas stuff
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const gl = canvas.getContext("webgl2");

export function resizeCanvasToDisplaySize(
  canvas: WebGL2RenderingContext["canvas"]
) {
  // lookup the size of canvas in css pixels
  let height = canvas.height;
  let width = canvas.width;

  // check if canvas is not the same size
  const resizeFlag = canvas.width !== width || canvas.height !== height;

  if (resizeFlag) {
    // make canvas the same size
    width = canvas.width;
    height = canvas.height;
  }

  // return flag
  return resizeFlag;
}

