import {Player} from "../entities/player";

export class EventManager {
    add(name: string, handler: (...args: any[]) => void): void {
        on(name, handler);
    }

    addNet(name: string, handler: (player: Player, ...args: any[]) => void): void {
        onNet(name, (...args: any[]) => {
            const src = (globalThis as any).source as number;
            handler(new Player(src), ...args);
        });
    }

    addCommand(name: string, handler: (player: Player | null, args: string[], raw: string) => void, restricted = false): void {
        RegisterCommand(name, (src: number, args: string[], raw: string) => {
            handler(src > 0 ? new Player(src) : null, args, raw);
        }, restricted);
    }
}