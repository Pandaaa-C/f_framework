/// <reference types="@citizenfx/server" />
import { Net, Vector3 } from "../../shared";
import { entityState } from "../internal/state";

export class Entity {
	constructor(public readonly handle: number) {}

	get position(): Vector3 {
		return Vector3.from(GetEntityCoords(this.handle));
	}

	get rotation(): Vector3 {
		return Vector3.from(GetEntityCoords(this.handle));
	}

	get heading(): number {
		return GetEntityHeading(this.handle);
	}

	get dimension(): number {
		return GetEntityRoutingBucket(this.handle);
	}

	set dimension(bucket: number) {
		SetEntityRoutingBucket(this.handle, bucket);
	}

	set position(position: Vector3) {
		emitNet(Net.setPosition, position);
	}

	set rotation(rotation: Vector3) {
		emitNet(Net.setRotation, rotation);
	}

	getVariable<T = unknown>(key: string): T | undefined {
		return entityState(this.handle)[key] as T | undefined;
	}

	setVariable(key: string, value: unknown): void {
		entityState(this.handle).set(key, value, true);
	}

	distance(position: Vector3) {
		return this.position.distanceTo(position);
	}

	distanceSquared(position: Vector3) {
		return this.position.distanceToSquared(position);
	}

	get type() {
		return GetEntityType(this.handle);
	}

	destroy() {
		DeleteEntity(this.handle);
	}
}
