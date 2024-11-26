import type { CanvasController } from "@/elements/canvas/CanvasController";
import type { ICoords } from "@/webgl/interfaces/ICoords";

export class AsideController {
	#observer: ResizeObserver;
	initCoords: ICoords = { x: 0, y: 0 };

	constructor(canvasController: CanvasController) {
		// set init coords
		this.#updateInitCoords();

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
