declare global {
	interface Math {
		randomArbitrary: (min: number, max: number) => number;
	}
}

export {};
