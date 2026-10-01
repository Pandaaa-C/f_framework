import type {Player} from "./player";

export class PlayerWeapons {
    constructor(private readonly player: Player) {
    }

    private get ped(): number {
        return this.player.ped.handle;
    }

    private h(value: string | number): number {
        return typeof value === "string" ? GetHashKey(value) : value;
    }

    give(weapon: string | number, ammo = 0, equip = true): void {
        GiveWeaponToPed(this.ped, this.h(weapon), ammo, false, equip);
    }

    remove(weapon: string | number): void {
        RemoveWeaponFromPed(this.ped, this.h(weapon));
    }

    removeAll(): void {
        RemoveAllPedWeapons(this.ped, true);
    }

    setAmmo(weapon: string | number, ammo: number): void {
        SetPedAmmo(this.ped, this.h(weapon), ammo);
    }

    giveComponent(weapon: string | number, component: string | number): void {
        GiveWeaponComponentToPed(this.ped, this.h(weapon), this.h(component));
    }

    get current(): number {
        return GetSelectedPedWeapon(this.ped);
    }

    setCurrent(weapon: string | number): void {
        SetCurrentPedWeapon(this.ped, this.h(weapon), true);
    }
}