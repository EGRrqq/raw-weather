import type { ICoords } from "../../webgl/interfaces/ICoords";

export default interface ICanvasController {
	gl: WebGL2RenderingContext;
	initCoords: ICoords;

	clearData: TClearData;
	resizeData: TResizeData;
}

// props for canvas functions
interface IClearDataProps {
	gl: WebGL2RenderingContext;
}
interface IResizeDataProps {
	gl: WebGL2RenderingContext;
}

// types for canvas functions
type TClearData = (props: IClearDataProps) => void;
type TResizeData = (props: IResizeDataProps) => void;
