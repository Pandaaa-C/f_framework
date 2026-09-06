import {Ped} from "./ped";
import {Vector3, Net} from "../../shared";
import {playerState} from "../internal/state";
import {serverRpc} from "../managers/rpc";

export class Player {
    constructor(public readonly source: number) {
    }

    get name(): string {
        return GetPlayerName(String(this.source));
    }

    get ped(): Ped {
        return new Ped(GetPlayerPed(String(this.source)));
    }

    get position(): Vector3 {
        return this.ped.position;
    }

    get identifiers(): Record<string, string> {
        const out: Record<string, string> = {};
        const count = GetNumPlayerIdentifiers(String(this.source));

        for (let i = 0; i < count; i++) {
            const id = GetPlayerIdentifier(String(this.source), i);
            const idx = id.indexOf(':');

            if (idx !== -1) out[id.slice(0, idx)] = id.slice(idx + 1);
        }

        return out;
    }

    get dimension(): number {
        return GetPlayerRoutingBucket(String(this.source));
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

    getIdentifier(prefix: string): string | undefined {
        const count = GetNumPlayerIdentifiers(String(this.source));
        for (let i = 0; i < count; i++) {
            const id = GetPlayerIdentifier(String(this.source), i);
            if (id.startsWith(prefix)) return id;
        }
        return undefined;
    }

    set dimension(bucket: number) {
        SetPlayerRoutingBucket(String(this.source), bucket);
    }

    getVariable<T = unknown>(key: string): T | undefined {
        return playerState(String(this.source))[key] as T | undefined;
    }

    setVariable(key: string, value: unknown): void {
        playerState(String(this.source)).set(key, value, true);
    }

    callProc<T = unknown>(name: string, ...args: unknown[]): Promise<T> {
        return serverRpc.call<T>(this.source, name, args);
    }
}