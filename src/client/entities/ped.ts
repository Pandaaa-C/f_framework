import { Entity } from './entity';

export class Ped extends Entity {
    get isInVehicle(): boolean {
        return IsPedInAnyVehicle(this.handle, false);
    }
    get armour(): number {
        return GetPedArmour(this.handle);
    }
    set armour(v: number) {
        SetPedArmour(this.handle, v);
    }
    get isDead(): boolean {
        return IsPedDeadOrDying(this.handle, true);
    }
}