import { clientRpc } from './rpc.js';
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

    addNet<K extends EventName>(name: K, handler: (...args: EventArgs<K>) => void): void {
        onNet(name as string, handler as (...a: any[]) => void);
    }

    callRemote<K extends EventName>(name: K, ...args: EventArgs<K>): void {
        emitNet(name as string, ...(args as any[]));
    }

    addCommand(
        name: string,
        handler: (args: string[], raw: string) => void,
        restricted = false,
    ): void {
        RegisterCommand(
            name,
            (_src: number, cmdArgs: string[], raw: string) => handler(cmdArgs, raw),
            restricted,
        );
    }

    addProc<K extends ProcName>(
        name: K,
        handler: (...args: ProcArgs<K>) => ProcReturn<K> | Promise<ProcReturn<K>>,
    ): void {
        clientRpc.register(name as string, (args) => handler(...(args as ProcArgs<K>)));
    }

    callRemoteProc<K extends ProcName>(name: K, ...args: ProcArgs<K>): Promise<ProcReturn<K>> {
        return clientRpc.call<ProcReturn<K>>(name as string, args as unknown[]);
    }
}