export function resizeData(gl: WebGL2RenderingContext) {
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
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

