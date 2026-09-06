/// <reference types="@citizenfx/client" />

import {
	nextRpcId,
	PendingRequests,
	RpcNet,
	type RpcRequest,
	type RpcResponse,
} from "../../shared/rpc-core.js";

type ClientProcHandler = (args: unknown[]) => unknown | Promise<unknown>;

class ClientRpc {
	private handlers = new Map<string, ClientProcHandler>();
	private pending = new PendingRequests();

	constructor() {
		onNet(RpcNet.req, (req: RpcRequest) => void this.handle(req));
		onNet(RpcNet.res, (res: RpcResponse) => this.pending.settle(res));
	}

	register(name: string, handler: ClientProcHandler): void {
		this.handlers.set(name, handler);
	}

	call<T>(name: string, args: unknown[]): Promise<T> {
		const id = nextRpcId();
		const promise = this.pending.waitFor<T>(id);
		emitNet(RpcNet.req, { id, name, args } as RpcRequest);
		return promise;
	}

	private async handle(req: RpcRequest): Promise<void> {
		const handler = this.handlers.get(req.name);
		if (!handler) {
			emitNet(RpcNet.res, {
				id: req.id,
				ok: false,
				error: `no proc '${req.name}' registered on client`,
			} as RpcResponse);
			return;
		}
		try {
			const result = await handler(req.args);
			emitNet(RpcNet.res, { id: req.id, ok: true, result } as RpcResponse);
		} catch (err) {
			emitNet(RpcNet.res, {
				id: req.id,
				ok: false,
				error: String(err),
			} as RpcResponse);
		}
	}
}

export const clientRpc = new ClientRpc();
