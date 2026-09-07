/**
 * 3D vector type and math, shared by the client and server.
 *
 * @remarks
 * This module contains no natives, so both runtimes import it. Use {@link IVector3}
 * for anything that crosses the wire (event payloads, stored data) and {@link Vector3}
 * for computation.
 *
 * @packageDocumentation
 */

/**
 * A plain 3D coordinate shape: `{ x, y, z }` with no methods.
 *
 * @remarks
 * This is the type to use for data that is serialized — sent through `emitNet`,
 * written to a state bag, or stored — because serialization strips class
 * prototypes, so a {@link Vector3} arrives on the other side as a plain object
 * anyway. Re-wrap with {@link Vector3.from} if you need the methods back.
 */
export interface IVector3 {
	/** Position along the world X axis (east/west). */
	x: number;
	/** Position along the world Y axis (north/south). */
	y: number;
	/** Position along the world Z axis (up/down). */
	z: number;
}

/**
 * An immutable-by-convention 3D vector with common math operations.
 *
 * @remarks
 * Every operation returns a **new** `Vector3` rather than mutating in place, so
 * instances are safe to share. Because the public `x`/`y`/`z` fields satisfy
 * {@link IVector3}, an instance can be passed directly to any native that expects
 * a coordinate shape (e.g. `SetEntityCoords`).
 *
 * @example
 * ```ts
 * const a = new Vector3(0, 0, 0);
 * const b = new Vector3(10, 0, 0);
 *
 * a.distanceTo(b);          // 10
 * a.lerp(b, 0.5);           // Vector3(5, 0, 0)
 * a.add(new Vector3(0, 0, 5)); // Vector3(0, 0, 5)
 * ```
 */
export class Vector3 implements IVector3 {
	/**
	 * Creates a vector from its components.
	 *
	 * @param x - X component. @defaultValue 0
	 * @param y - Y component. @defaultValue 0
	 * @param z - Z component. @defaultValue 0
	 */
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
	) {}

	/**
	 * Builds a `Vector3` from a plain object or a `[x, y, z]` tuple.
	 *
	 * @param value - Either an `{ x, y, z }` object or a numeric array in `[x, y, z]` order.
	 * @returns A new `Vector3`.
	 *
	 * @example
	 * ```ts
	 * Vector3.from({ x: 1, y: 2, z: 3 });
	 * Vector3.from(GetEntityCoords(ped, true)); // wrap a native result
	 * Vector3.from([1, 2, 3]);
	 * ```
	 */
	static from(value: IVector3 | number[]): Vector3 {
		return Array.isArray(value)
			? new Vector3(value[0], value[1], value[2])
			: new Vector3(value.x, value.y, value.z);
	}

	/**
	 * The zero vector, `(0, 0, 0)`.
	 *
	 * @returns A new zero `Vector3`.
	 */
	static zero(): Vector3 {
		return new Vector3(0, 0, 0);
	}

	/**
	 * Adds a vector or a scalar to this vector.
	 *
	 * @param value - A `Vector3` (component-wise) or a number (added to every component).
	 * @returns The resulting vector.
	 */
	add(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x + value, this.y + value, this.z + value)
			: new Vector3(this.x + value.x, this.y + value.y, this.z + value.z);
	}

	/**
	 * Subtracts a vector or a scalar from this vector.
	 *
	 * @param value - A `Vector3` (component-wise) or a number (subtracted from every component).
	 * @returns The resulting vector.
	 */
	subtract(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x - value, this.y - value, this.z - value)
			: new Vector3(this.x - value.x, this.y - value.y, this.z - value.z);
	}

	/**
	 * Multiplies this vector by a vector or a scalar.
	 *
	 * @remarks
	 * Vector input is a **component-wise** (Hadamard) product, not a dot or cross
	 * product. Pass a scalar to uniformly scale — e.g. `v.multiply(2)` doubles the length.
	 *
	 * @param value - A `Vector3` (component-wise) or a number (scales every component).
	 * @returns The resulting vector.
	 */
	multiply(value: Vector3 | number): Vector3 {
		return typeof value === "number"
			? new Vector3(this.x * value, this.y * value, this.z * value)
			: new Vector3(this.x * value.x, this.y * value.y, this.z * value.z);
	}

	/**
	 * Dot product with another vector.
	 *
	 * @param value - The other vector.
	 * @returns The scalar dot product. `0` means the vectors are perpendicular.
	 */
	dot(value: Vector3): number {
		return this.x * value.x + this.y * value.y + this.z * value.z;
	}

	/**
	 * Cross product with another vector.
	 *
	 * @param value - The other vector.
	 * @returns A new vector perpendicular to both inputs.
	 */
	cross(value: Vector3): Vector3 {
		return new Vector3(
			this.y * value.z - this.z * value.y,
			this.z * value.x - this.x * value.z,
			this.x * value.y - this.y * value.x,
		);
	}

	/**
	 * The magnitude (Euclidean length) of the vector.
	 *
	 * @remarks
	 * Involves a square root. If you only need to compare magnitudes, prefer
	 * {@link Vector3.lengthSquared} to avoid the `Math.sqrt` call.
	 */
	get length(): number {
		return Math.sqrt(this.dot(this));
	}

	/**
	 * The squared magnitude of the vector.
	 *
	 * @remarks
	 * Cheaper than {@link Vector3.length} because it skips the square root. Order is
	 * preserved, so it is ideal for "which is closer" comparisons.
	 */
	get lengthSquared(): number {
		return this.dot(this);
	}

	/**
	 * Returns a unit vector pointing in the same direction.
	 *
	 * @returns A new vector with length `1`, or {@link Vector3.zero} if this vector
	 * has zero length (avoids dividing by zero).
	 */
	normalize(): Vector3 {
		const length = this.length;
		return length === 0 ? Vector3.zero() : this.multiply(1 / length);
	}

	/**
	 * Euclidean distance to another point.
	 *
	 * @param v - The other point.
	 * @returns The distance.
	 * @see {@link Vector3.distanceToSquared} for a cheaper comparison-only variant.
	 */
	distanceTo(v: Vector3): number {
		return this.subtract(v).length;
	}

	/**
	 * Squared Euclidean distance to another point.
	 *
	 * @remarks
	 * Skips the square root, so use this when ranking or thresholding distances
	 * (compare against a squared radius) rather than reporting an actual distance.
	 *
	 * @param v - The other point.
	 * @returns The squared distance.
	 */
	distanceToSquared(v: Vector3): number {
		return this.subtract(v).lengthSquared;
	}

	/**
	 * Linearly interpolates from this vector toward another.
	 *
	 * @param v - The target vector.
	 * @param t - Interpolation factor. `0` returns this vector, `1` returns `v`;
	 * values outside `[0, 1]` extrapolate.
	 * @returns The interpolated vector.
	 */
	lerp(v: Vector3, t: number): Vector3 {
		return this.add(v.subtract(this).multiply(t));
	}

	/**
	 * Creates an independent copy of this vector.
	 *
	 * @returns A new `Vector3` with the same components.
	 */
	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * Compares two vectors for approximate equality.
	 *
	 * @remarks
	 * Uses a tolerance because floating-point math rarely produces exactly equal
	 * components after arithmetic.
	 *
	 * @param v - The vector to compare against.
	 * @param epsilon - Maximum allowed per-component difference. @defaultValue 1e-6
	 * @returns `true` if every component is within `epsilon` of `v`.
	 */
	equals(v: Vector3, epsilon = 1e-6): boolean {
		return (
			Math.abs(this.x - v.x) < epsilon &&
			Math.abs(this.y - v.y) < epsilon &&
			Math.abs(this.z - v.z) < epsilon
		);
	}

	/**
	 * Converts to a plain `[x, y, z]` tuple.
	 *
	 * @returns The components as a fixed-length array.
	 */
	toArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	/**
	 * A human-readable representation, e.g. `"Vector3(1, 2, 3)"`.
	 *
	 * @returns The formatted string.
	 */
	toString(): string {
		return `Vector3(${this.x}, ${this.y}, ${this.z})`;
	}
}