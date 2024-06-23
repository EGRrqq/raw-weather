import { ICanvasController } from "./ICanvasController";

export class CanvasController implements ICanvasController {
  // getters with appropriate error handling
  get gl(): WebGL2RenderingContext {
    const ctx = this.#canvas.getContext("webgl2");
    if (!ctx) throw new Error("Error while getting webgl2 context");

    return ctx;
  }
  get #canvas(): HTMLCanvasElement {
    const canvasId = "canvas";
    const canvas = document.getElementById(canvasId);

    if (!(canvas instanceof HTMLCanvasElement))
      throw new Error(`canvas element with id: ${canvasId} was not found`);

    return canvas;
  }

  // functions to work with canvas data
  clearData: ICanvasController["clearData"] = ({ gl }) => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(this.gl.COLOR_BUFFER_BIT);
  };

  resizeData: ICanvasController["resizeData"] = ({ gl, initCoords }) => {
    this.#resizeCanvasToDisplaySize(this.#canvas);
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(initCoords.x, initCoords.y, gl.canvas.width, gl.canvas.height);
  };

  #resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
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
}

