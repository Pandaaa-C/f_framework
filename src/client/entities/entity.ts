/// <reference types="@citizenfx/client" />

import { Vector3 } from "../../shared";
import { entityState } from "../internal/state";

export class Entity {
	public get handle(): number {
		return this._handle;
	}

	constructor(private readonly _handle: number) {}

	get exists(): boolean {
		return DoesEntityExist(this.handle);
	}

	get model(): number {
		return GetEntityModel(this.handle);
	}

	get health(): number {
		return GetEntityHealth(this.handle);
	}

	set health(v: number) {
		SetEntityHealth(this.handle, v);
	}

	get position(): Vector3 {
		return Vector3.from(GetEntityCoords(this.handle, true));
	}

	set position(v: Vector3) {
		SetEntityCoords(this.handle, v.x, v.y, v.z, false, false, false, true);
	}

	get heading(): number {
		return GetEntityHeading(this.handle);
	}

	set heading(v: number) {
		SetEntityHeading(this.handle, v);
	}

	distanceTo(other: Entity | Vector3): number {
		const p = other instanceof Entity ? other.position : other;
		return this.position.distanceTo(p);
	}

	delete(): void {
		DeleteEntity(this.handle);
	}

	getVariable<T = unknown>(key: string): T | undefined {
		return entityState(this.handle)[key] as T | undefined;
	}
}
