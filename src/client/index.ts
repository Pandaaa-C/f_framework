/// <reference types="@citizenfx/client" />
export * from '../shared/index.js';

export const Player = {
    get ped(): number {
        return PlayerPedId();
    },
    get position(): number[] {
        return GetEntityCoords(PlayerPedId(), true);
    },
    set position(value: number[]) {
        SetEntityCoords(PlayerPedId(), value[0], value[1], value[2], false, false, false, true);
    }
}

export const Client = {
    onNet: (event: string, handler: (...args: any[]) => void) => onNet(event, handler),
    emitNet: (event: string, ...args: any[]) => emitNet(event, ...args),
    command: (name: string, handler: (src: number, args: string[]) => void) =>
        RegisterCommand(name, (source: number, args: string[]) => handler(source, args), false)
};
