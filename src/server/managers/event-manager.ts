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
}