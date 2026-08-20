import {Entity} from "./entity";

export class Vehicle extends Entity {
    get speed(): number {
        return GetEntitySpeed(this.handle);
    }

    get engineOn(): boolean {
        return GetIsVehicleEngineRunning(this.handle);
    }

    set engineOn(v: boolean) {
        SetVehicleEngineOn(this.handle, v, true, true);
    }

    repair(): void {
        SetVehicleFixed(this.handle);
    }
}