/// <reference types="@citizenfx/client" />
import {Net} from "../shared"

export function registerInternalHandlers(): void {
    onNet(Net.setHealth, (value: number) => {
        SetEntityHealth(PlayerPedId(), value);
    });

    onNet(Net.setArmour, (value: number) => {
        SetPedArmour(PlayerPedId(), value);
    });

    onNet(Net.setPosition, (x: number, y: number, z: number) => {
        SetEntityCoords(PlayerPedId(), x, y, z, false, false, false, true);
    });
}