import {Player} from '../entities/player.js';
import {serverRpc} from './rpc.js';
import {
    EventName,
    EventArgs,
    ProcName,
    ProcArgs,
    ProcReturn,
} from '../../shared/events-map.js';

export class EventManager {
    add(name: string, handler: (...args: any[]) => void): void {
        on(name, handler);
    }

    call(name: string, ...args: any[]): void {
        emit(name, ...args);
    }

    addNet<K extends EventName>(
        name: K,
        handler: (player: Player, ...args: EventArgs<K>) => void,
    ): void {
        onNet(name as string, (...args: any[]) => {
            const source = (globalThis as any).source as number;
            handler(new Player(source), ...(args as EventArgs<K>));
        });
    }

    addCommand(
        name: string,
        handler: (player: Player | null, args: string[], raw: string) => void,
        restricted = false,
    ): void {
        RegisterCommand(
            name,
            (src: number, cmdArgs: string[], raw: string) => {
                handler(src > 0 ? new Player(src) : null, cmdArgs, raw);
            },
            restricted,
        );
    }

    addProc<K extends ProcName>(
        name: K,
        handler: (player: Player, ...args: ProcArgs<K>) => ProcReturn<K> | Promise<ProcReturn<K>>,
    ): void {
        serverRpc.register(name as string, (source, args) =>
            handler(new Player(source), ...(args as ProcArgs<K>)),
        );
    }
}