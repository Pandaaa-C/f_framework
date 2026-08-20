/// <reference types="@citizenfx/client" />
import {Vector3} from "../shared";

export * from '../shared/index.js';

export const player = {
    get ped(): number {
        return PlayerPedId();
    },
    get serverId(): number {
        return GetPlayerServerId(PlayerId());
    },
    get position(): Vector3 {
        return Vector3.from(GetEntityCoords(PlayerPedId(), true));
    },
    set position(value: Vector3) {
        SetEntityCoords(PlayerPedId(), value.x, value.y, value.z, false, false, false, true);
    },
    get health(): number {
        return GetEntityHealth(PlayerPedId());
    },
    set health(value: number) {
        SetEntityHealth(PlayerPedId(), value);
    }
};

export const events = {
    on: (event: string, handler: (...args: any[]) => void) => on(event, handler),
    emit: (event: string, ...args: any[]) => emit(event, ...args),

    onNet: (event: string, handler: (...args: any[]) => void) => onNet(event, handler),
    emitNet: (event: string, ...args: any[]) => emitNet(event, ...args),

    addCommand: (name: string, handler: (src: number, args: string[]) => void) =>
        RegisterCommand(name, (source: number, args: string[]) => handler(source, args), false)
};

const keys = {
    bind(command: string, description: string, key: string) {
        RegisterKeyMapping(command, description, 'keyboard', key);
    }
};

export const fx = {events, player, keys, Vector3};
