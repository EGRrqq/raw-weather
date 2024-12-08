import type { CanvasController } from "@/elements/canvas/CanvasController";
import { s } from "@/webgl/elements/particles/Rain/Rain";
import type { ICoords } from "@/webgl/interfaces/ICoords";

type IAsideInputsMap = "particles" | "respawn_time";

interface IAsideInput {
	el: HTMLInputElement;
	eventCb: (e: Event) => void;
	settings: {
		min: number;
		max: number;
		step: number;
		value: number;
	};
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
		this.#createInput(
			"particles",
			(e) => {
				if (e.target instanceof HTMLInputElement)
					s.particleCount = Number.parseInt(e.target.value);
			},
			{
				min: 0,
				max: 25,
				step: 1,
				value: s.particleCount,
			},
		);
		this.#createInput(
			"respawn_time",
			(e) => {
				if (e.target instanceof HTMLInputElement) {
					s.respawn.timeInSeconds = Number.parseFloat(e.target.value);
					s.respawn.flag = true;
				}
			},
			{
				min: 0,
				max: 1,
				step: 0.05,
				value: s.respawn.timeInSeconds,
			},
		);

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

	#createInput = (
		id: IAsideInputsMap,
		cb: IAsideInput["eventCb"],
		s: IAsideInput["settings"],
	) => {
		const wrapper = document.createElement("section");

		const inputEl = document.createElement("input");
		inputEl.name = id;
		inputEl.type = "range";
		inputEl.min = s.min.toString();
		inputEl.max = s.max.toString();
		inputEl.step = s.step.toString();
		inputEl.value = s.value.toString();

		const nameLabel = document.createElement("label");
		nameLabel.textContent = inputEl.name;

		const valueLabel = document.createElement("label");
		valueLabel.textContent = inputEl.value;

		const eventCb: IAsideInput["eventCb"] = (e) => {
			cb(e);
			valueLabel.textContent = inputEl.value;
		};
		
		inputEl.addEventListener("input", eventCb);
		this.#inputs[id] = { el: inputEl, eventCb, settings: s };

		wrapper.id = id;
		wrapper.appendChild(nameLabel);
		wrapper.appendChild(inputEl);
		wrapper.appendChild(valueLabel);
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
