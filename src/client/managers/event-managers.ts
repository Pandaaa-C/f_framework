/// <reference types="@citizenfx/client" />

export class EventManager {
    add(name: string, handler: (...args: any[]) => void): void {
        on(name, handler);
    }

    addNet(name: string, handler: (...args: any[]) => void): void {
        onNet(name, handler);
    }

    call(name: string, ...args: any[]): void {
        emit(name, ...args);
    }

    callRemote(name: string, ...args: any[]): void {
        emitNet(name, ...args);
    }

    addCommand(name: string, handler: (args: string[], raw: string) => void, restricted = false): void {
        RegisterCommand(name, (_s: number, args: string[], raw: string) => {
            handler(args, raw);
        }, restricted);
    }
}