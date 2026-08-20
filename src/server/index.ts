/// <reference types="@citizenfx/server" />

export class ServerPlayer {
    constructor(public readonly source: number) {
    }

    get name(): string {
        return GetPlayerName(String(this.source));
    }

    drop(reason: string) {
        DropPlayer(String(this.source), reason);
    }
}

export const Server = {
    onNet: (event: string, handler: (...args: any[]) => void) => onNet(event, handler),
    emitNet: (event: string, target: number | string, ...args: any[]) => emitNet(event, target, ...args)
};
