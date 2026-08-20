/// <reference types="@citizenfx/server" />

import {BlipData, BlipNet} from "../shared/blips";

let nextId = 1;

export class BlipManager {
    private blips = new Map<number, BlipData>();

    create(data: Omit<BlipData, 'id'>): number {
        const full: BlipData = { ...data, id: nextId++ };
        this.blips.set(full.id, full);
        emitNet(BlipNet.add, -1, full);
        return full.id;
    }

    createFor(source: number, data: Omit<BlipData, 'id'>): number {
        const full: BlipData = { ...data, id: nextId++ };
        emitNet(BlipNet.add, source, full);
        return full.id;
    }

    remove(id: number): void {
        if (this.blips.delete(id)) emitNet(BlipNet.remove, -1, id);
    }

    syncTo(source: number): void {
        emitNet(BlipNet.sync, source, [...this.blips.values()]);
    }
}
