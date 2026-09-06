/// <reference types="@citizenfx/server" />

import {
    PendingRequests,
    RpcNet,
    RpcRequest,
    RpcResponse,
    nextRpcId,
} from '../../shared/rpc-core.js';

type ServerProcHandler = (source: number, args: unknown[]) => unknown | Promise<unknown>;

class ServerRpc {
    private handlers = new Map<string, ServerProcHandler>();
    private pending = new PendingRequests();

    constructor() {
        onNet(RpcNet.req, (req: RpcRequest) => {
            const source = (globalThis as any).source as number;
            void this.handle(source, req);
        });
        onNet(RpcNet.res, (res: RpcResponse) => this.pending.settle(res));
    }

    register(name: string, handler: ServerProcHandler): void {
        this.handlers.set(name, handler);
    }

    call<T>(source: number, name: string, args: unknown[]): Promise<T> {
        const id = nextRpcId();
        const promise = this.pending.waitFor<T>(id);
        emitNet(RpcNet.req, source, {id, name, args} as RpcRequest);
        return promise;
    }

    private async handle(source: number, req: RpcRequest): Promise<void> {
        const handler = this.handlers.get(req.name);
        if (!handler) {
            emitNet(RpcNet.res, source, {
                id: req.id,
                ok: false,
                error: `no proc '${req.name}' registered on server`,
            } as RpcResponse);
            return;
        }
        try {
            const result = await handler(source, req.args);
            emitNet(RpcNet.res, source, {id: req.id, ok: true, result} as RpcResponse);
        } catch (err) {
            emitNet(RpcNet.res, source, {id: req.id, ok: false, error: String(err)} as RpcResponse);
        }
    }
}

export const serverRpc = new ServerRpc();