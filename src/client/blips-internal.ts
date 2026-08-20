/// <reference types="@citizenfx/client" />
import { BlipData, BlipNet } from '../shared/blips';

const handles = new Map<number, number>();

function draw(d: BlipData): void {
    const blip = AddBlipForCoord(d.coords.x, d.coords.y, d.coords.z);
    if (d.sprite !== undefined) SetBlipSprite(blip, d.sprite);
    if (d.color !== undefined) SetBlipColour(blip, d.color);
    if (d.scale !== undefined) SetBlipScale(blip, d.scale);
    if (d.shortRange) SetBlipAsShortRange(blip, true);
    if (d.label) {
        BeginTextCommandSetBlipName('STRING');
        AddTextComponentSubstringPlayerName(d.label);
        EndTextCommandSetBlipName(blip);
    }
    handles.set(d.id, blip);
}

export function registerBlipHandlers(): void {
    onNet(BlipNet.add, (d: BlipData) => draw(d));
    onNet(BlipNet.sync, (list: BlipData[]) => list.forEach(draw));
    onNet(BlipNet.remove, (id: number) => {
        const h = handles.get(id);
        if (h !== undefined) {
            RemoveBlip(h);
            handles.delete(id);
        }
    });
}