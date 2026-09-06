export interface IVector3 {
	x: number;
	y: number;
	z: number;
}

export class Vector3 implements IVector3 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
	) {}

	static from(value: { x: number; y: number; z: number } | number[]): Vector3 {
		return Array.isArray(value)
			? new Vector3(value[0], value[1], value[2])
			: new Vector3(value.x, value.y, value.z);
	}

	static zero(): Vector3 {
		return new Vector3(0, 0, 0);
	}

	add(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x + value, this.y + value, this.z + value)
			: new Vector3(this.x + value.x, this.y + value.y, this.z + value.z);
	}

	subtract(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x - value, this.y - value, this.z - value)
			: new Vector3(this.x - value.x, this.y - value.y, this.z - value.z);
	}

	multiply(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x * value, this.y * value, this.z * value)
			: new Vector3(this.x * value.x, this.y * value.y, this.z * value.z);
	}

	dot(value: Vector3): number {
		return this.x * value.x + this.y * value.y + this.z * value.z;
	}

	cross(value: Vector3): Vector3 {
		return new Vector3(
			this.y * value.z - this.z * value.y,
			this.z * value.x - this.x * value.z,
			this.x * value.y - this.y * value.x,
		);
	}

	get length(): number {
		return Math.sqrt(this.dot(this));
	}

	get lengthSquared(): number {
		return this.dot(this);
	}

	normalize(): Vector3 {
		const length = this.length;
		return length === 0 ? Vector3.zero() : this.multiply(1 / length);
	}

	distanceTo(v: Vector3): number {
		return this.subtract(v).length;
	}

	distanceToSquared(v: Vector3): number {
		return this.subtract(v).lengthSquared;
	}

	lerp(v: Vector3, t: number): Vector3 {
		return this.add(v.subtract(this).multiply(t));
	}

	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	equals(v: Vector3, epsilon = 1e-6): boolean {
		return (
			Math.abs(this.x - v.x) < epsilon &&
			Math.abs(this.y - v.y) < epsilon &&
			Math.abs(this.z - v.z) < epsilon
		);
	}

	toArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	toString(): string {
		return `Vector3(${this.x}, ${this.y}, ${this.z})`;
	}
}
