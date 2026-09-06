export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const remap = (
	v: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
) => outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);
export const toRadians = (deg: number) => (deg * Math.PI) / 180;
export const toDegrees = (rad: number) => (rad * 180) / Math.PI;
export const randomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;
export const randomFloat = (min: number, max: number) =>
	Math.random() * (max - min) + min;
