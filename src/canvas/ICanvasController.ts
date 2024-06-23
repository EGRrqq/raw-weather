export interface ICanvasController {
  gl: WebGL2RenderingContext;

  clearData(gl: WebGL2RenderingContext): void;
  resizeData(gl: WebGL2RenderingContext): void;
}

