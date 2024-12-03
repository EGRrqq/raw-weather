import type { CanvasController } from "@/elements/canvas/CanvasController";
import type { ICoords } from "@/webgl/interfaces/ICoords";

type IAsideInputsMap = "weather-speed";

interface IAsideInput {
	el: HTMLInputElement;
	eventCb: (e: Event) => void;
}
type IAsideInputs =
	| Record<IAsideInputsMap, IAsideInput>
	| Record<PropertyKey, never>;

export class AsideController {
	#observer: ResizeObserver;
	#inputs: IAsideInputs = {};
	initCoords: ICoords = { x: 0, y: 0 };

	constructor(canvasController: CanvasController) {
		// set init coords
		this.#updateInitCoords();

		// create inputs
		this.#createInput("weather-speed", () => console.log("we movin"));

		// resize canvas on aside resize
		this.#observer = new ResizeObserver(() => this.#init(canvasController));
		this.#observer.observe(this.#aside);
	}

	get #aside(): HTMLElement {
		const asideId = "aside-settings";
		const aside = document.getElementById(asideId);

		if (!(aside instanceof HTMLElement))
			throw new Error(`aside element with id: ${asideId} was not found`);

		return aside;
	}

	#createInput = (id: IAsideInputsMap, cb: IAsideInput["eventCb"]) => {
		const wrapper = document.createElement("section");

		const inputEl = document.createElement("input");
		inputEl.id = id;
		inputEl.name = id;
		inputEl.type = "range";
		this.#inputs[id] = { el: inputEl, eventCb: cb };
		inputEl.addEventListener("input", cb);

		wrapper.appendChild(inputEl);
		this.#aside.appendChild(wrapper);
	};

	#updateInitCoords = () => {
		this.initCoords.x = -this.#aside.clientWidth / 2;
	};

	#init = (canvasController: CanvasController) => {
		// update init coords
		this.#updateInitCoords();

		// get gl only once
		const { gl } = canvasController;
		// handle canvas resize
		canvasController.resizeData({ gl });
		// clear canvas
		canvasController.clearData({ gl });
	};
}
