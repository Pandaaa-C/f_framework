import {Ped} from "./ped";
import {Vector3, Net} from "../../shared";

export class Player {
    constructor(public readonly source: number) {}

    get name(): string {
        return GetPlayerName(String(this.source));
    }
    get ped(): Ped {
        return new Ped(GetPlayerPed(String(this.source)));
    }
    get position(): Vector3 {
        return this.ped.position;
    }

    setHealth(value: number): void {
        emitNet(Net.setHealth, this.source, value);
    }
    setArmour(value: number): void {
        emitNet(Net.setArmour, this.source, value);
    }
    setPosition(v: Vector3): void {
        emitNet(Net.setPosition, this.source, v.x, v.y, v.z);
    }

    call(name: string, ...args: any[]): void {
        emitNet(name, this.source, ...args);
    }
    drop(reason: string): void {
        DropPlayer(String(this.source), reason);
    }
}