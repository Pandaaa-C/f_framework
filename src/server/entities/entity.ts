/// <reference types="@citizenfx/server" />
import {Vector3} from "../../shared";
import {entityState} from "../internal/state";

export class Entity {
    constructor(public readonly handle: number) {}

    get position(): Vector3 {
        return Vector3.from(GetEntityCoords(this.handle));
    }

    get dimension(): number {
        return GetEntityRoutingBucket(this.handle);
    }

    set dimension(bucket: number) {
        SetEntityRoutingBucket(this.handle, bucket);
    }

    getVariable<T = unknown>(key: string): T | undefined {
        return entityState(this.handle)[key] as T | undefined;
    }

    setVariable(key: string, value: unknown): void {
        entityState(this.handle).set(key, value, true);
    }
}