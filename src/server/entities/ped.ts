import {Entity} from "./entity";

export class Ped extends Entity {
    private h(value: string | number): number {
        return typeof value === "string" ? GetHashKey(value) : value;
    }

    override get maxHealth(): number {
        return GetPedMaxHealth(this.handle);
    }

    get armour(): number {
        return GetPedArmour(this.handle);
    }

    set armour(value: number) {
        SetPedArmour(this.handle, value);
    }

    get dead(): boolean {
        return this.health <= 0;
    }

    get isPlayer(): boolean {
        return IsPedAPlayer(this.handle);
    }

    get relationshipGroup(): number {
        return GetPedRelationshipGroupHash(this.handle);
    }

    get inVehicle(): boolean {
        return IsPedInAnyVehicle(this.handle);
    }

    get isRagdoll(): boolean {
        return IsPedRagdoll(this.handle);
    }

    get isHandcuffed(): boolean {
        return IsPedHandcuffed(this.handle);
    }

    get isStrafing(): boolean {
        return IsPedStrafing(this.handle);
    }

    get isOnMount(): boolean {
        return IsPedOnMount(this.handle);
    }

    get isUsingActionMode(): boolean {
        return IsPedUsingActionMode(this.handle);
    }

    get isStealthMoving(): boolean {
        return GetPedStealthMovement(this.handle);
    }

    get desiredHeading(): number {
        return GetPedDesiredHeading(this.handle);
    }

    get causeOfDeath(): number {
        return GetPedCauseOfDeath(this.handle);
    }

    get sourceOfDamage(): number {
        return GetPedSourceOfDamage(this.handle);
    }

    get sourceOfDeath(): number {
        return GetPedSourceOfDeath(this.handle);
    }

    get vehicle(): number {
        return GetVehiclePedIsIn(this.handle, false);
    }

    get lastVehicle(): number {
        return GetVehiclePedIsIn(this.handle, true);
    }

    get seat(): number {
        return GetSeatPedIsUsing(this.handle);
    }

    isInVehicle(vehicle: number, anyVehicle = false): boolean {
        return anyVehicle
            ? IsPedInAnyVehicle(this.handle)
            : IsPedInVehicle(this.handle, vehicle);
    }

    get currentWeapon(): number {
        return GetSelectedPedWeapon(this.handle);
    }

    giveWeapon(weapon: string | number, ammo = 0, equip = true): void {
        GiveWeaponToPed(this.handle, this.h(weapon), ammo, false, equip);
    }

    removeWeapon(weapon: string | number): void {
        RemoveWeaponFromPed(this.handle, this.h(weapon));
    }

    removeAllWeapons(): void {
        RemoveAllPedWeapons(this.handle, true);
    }

    setAmmo(weapon: string | number, ammo: number): void {
        SetPedAmmo(this.handle, this.h(weapon), ammo);
    }

    setCurrentWeapon(weapon: string | number): void {
        SetCurrentPedWeapon(this.handle, this.h(weapon), true);
    }

    giveWeaponComponent(
        weapon: string | number,
        component: string | number,
    ): void {
        GiveWeaponComponentToPed(this.handle, this.h(weapon), this.h(component));
    }

    removeWeaponComponent(
        weapon: string | number,
        component: string | number,
    ): void {
        RemoveWeaponComponentFromPed(
            this.handle,
            this.h(weapon),
            this.h(component),
        );
    }

    setComponent(
        componentId: number,
        drawable: number,
        texture: number,
        palette = 0,
    ): void {
        SetPedComponentVariation(
            this.handle,
            componentId,
            drawable,
            texture,
            palette,
        );
    }

    setProp(propId: number, drawable: number, texture: number): void {
        SetPedPropIndex(this.handle, propId, drawable, texture, true);
    }

    clearProp(propId: number): void {
        ClearPedProp(this.handle, propId);
    }

    randomizeComponents(): void {
        SetPedRandomComponentVariation(this.handle, 0);
    }

    randomizeProps(): void {
        SetPedRandomProps(this.handle);
    }

    defaultComponents(): void {
        SetPedDefaultComponentVariation(this.handle);
    }

    set canRagdoll(toggle: boolean) {
        SetPedCanRagdoll(this.handle, toggle);
    }

    ragdoll(ms = 3000): void {
        SetPedToRagdoll(this.handle, ms, ms, 0, true, true, false);
    }

    ragdollWithFall(ms = 3000): void {
        SetPedToRagdoll(this.handle, ms, ms, 1, true, true, false);
    }

    setConfigFlag(flag: number, value: boolean): void {
        SetPedConfigFlag(this.handle, flag, value);
    }

    setResetFlag(flag: number, value: boolean): void {
        SetPedResetFlag(this.handle, flag, value);
    }

    clearTasks(immediately = false): void {
        if (immediately) ClearPedTasksImmediately(this.handle);
        else ClearPedTasks(this.handle);
    }

    clearSecondaryTask(): void {
        ClearPedSecondaryTask(this.handle);
    }

    warpIntoVehicle(vehicle: number, seat = -1): void {
        TaskWarpPedIntoVehicle(this.handle, vehicle, seat);
    }

    setIntoVehicle(vehicle: number, seat = -1): void {
        SetPedIntoVehicle(this.handle, vehicle, seat);
    }

    enterVehicle(vehicle: number, seat = -1, speed = 2.0, timeout = -1): void {
        TaskEnterVehicle(this.handle, vehicle, timeout, seat, speed, 1, 0);
    }

    leaveVehicle(flags = 0): void {
        TaskLeaveVehicle(this.handle, this.vehicle, flags);
    }

    combat(target: number): void {
        TaskCombatPed(this.handle, target, 0, 16);
    }

    flee(target: number): void {
        TaskReactAndFleePed(this.handle, target);
    }
}