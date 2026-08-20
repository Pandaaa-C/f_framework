/// <reference types="@citizenfx/server" />
import {Vector3} from "../../shared";

export class Entity {
    constructor(public readonly handle: number) {}

    get position(): Vector3 {
        return Vector3.from(GetEntityCoords(this.handle));
    }
}