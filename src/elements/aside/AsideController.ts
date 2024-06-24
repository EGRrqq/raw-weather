export class AsideController {
  #observer: ResizeObserver;

  constructor() {
    // create observer
    this.#observer = new ResizeObserver(this.#init);
    // observe aside elem
    this.#observer.observe(this.#aside);
  }

  get #aside(): HTMLElement {
    const asideId = "aside-settings";
    const aside = document.getElementById(asideId);

    if (!(aside instanceof HTMLElement))
      throw new Error(`aside element with id: ${asideId} was not found`);

    return aside;
  }

  #init = () => {
    console.log("buh");
  };
}

