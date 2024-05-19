// canvas stuff
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

export const gl = canvas.getContext("webgl2");

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // lookup the size of canvas in css pixels
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // check if canvas is not the same size
  const resizeFlag =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (resizeFlag) {
    // make canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  // return flag
  return resizeFlag;
}

