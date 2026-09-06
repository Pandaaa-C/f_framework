export const RpcNet = {
    req: '__fx:rpc:req',
    res: '__fx:rpc:res',
} as const;

export interface RpcRequest {
    id: string;
    name: string;
    args: unknown[];
}

export interface RpcResponse {
    id: string;
    ok: boolean;
    result?: unknown;
    error?: string;
}

export const RPC_TIMEOUT_MS = 10_000;

let counter = 0;

export function nextRpcId(): string {
    return `${Date.now().toString(36)}-${(counter++).toString(36)}`;
}

interface Waiter {
    resolve: (value: any) => void;
    reject: (err: any) => void;
    timer: ReturnType<typeof setTimeout>;
}

export class PendingRequests {
    private map = new Map<string, Waiter>();

    waitFor<T>(id: string, timeoutMs = RPC_TIMEOUT_MS): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                this.map.delete(id);
                reject(new Error(`[fx] rpc '${id}' timed out after ${timeoutMs}ms`));
            }, timeoutMs);
            this.map.set(id, {resolve, reject, timer});
        });
    }

    settle(res: RpcResponse): void {
        const waiter = this.map.get(res.id);
        if (!waiter) return;

        clearTimeout(waiter.timer);
        this.map.delete(res.id);

        if (res.ok) waiter.resolve(res.result);
        else waiter.reject(new Error(res.error ?? '[fx] rpc failed'));
    }
}